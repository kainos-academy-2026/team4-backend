terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-team4-backend-dev"
    storage_account_name = "sateam4backend"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_client_config" "current" {}

data "azurerm_container_registry" "app" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group_name
}

module "resource_group" {
  source = "../modules/resource-group"

  name     = "${var.resource_group_name}-${var.environment}"
  location = var.location

  tags = merge(
    var.tags,
    {
      environment = var.environment
      project     = var.project_name
    }
  )
}

resource "azurerm_key_vault" "app" {
  name                = var.key_vault_name
  location            = module.resource_group.location
  resource_group_name = module.resource_group.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  # Use Azure RBAC for access control so role assignments can be managed consistently.
  rbac_authorization_enabled = true

  # Key Vault retention is immutable after creation, so keep this aligned with existing vault setting.
  soft_delete_retention_days = 90

  tags = merge(
    var.tags,
    {
      environment = var.environment
      project     = var.project_name
    }
  )
}

resource "azurerm_user_assigned_identity" "app" {
  name                = var.managed_identity_name
  location            = module.resource_group.location
  resource_group_name = module.resource_group.name

  tags = merge(
    var.tags,
    {
      environment = var.environment
      project     = var.project_name
    }
  )
}

resource "azurerm_container_app_environment" "app" {
  name                = var.container_app_environment_name
  location            = module.resource_group.location
  resource_group_name = module.resource_group.name

  tags = merge(
    var.tags,
    {
      environment = var.environment
      project     = var.project_name
    }
  )
}

resource "azurerm_role_assignment" "acr_pull" {
  count                = var.enable_acr_pull_role_assignment ? 1 : 0
  scope                = data.azurerm_container_registry.app.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.app.principal_id

  # Mitigate transient AAD replication delays when assigning roles to fresh identities.
  skip_service_principal_aad_check = true
}

resource "azurerm_role_assignment" "key_vault_secrets_user" {
  scope                = azurerm_key_vault.app.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.app.principal_id

  skip_service_principal_aad_check = true
}

resource "azurerm_container_app" "frontend" {
  name                         = var.frontend_container_app_name
  resource_group_name          = module.resource_group.name
  container_app_environment_id = azurerm_container_app_environment.app.id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.app.id]
  }

  registry {
    server   = data.azurerm_container_registry.app.login_server
    identity = azurerm_user_assigned_identity.app.id
  }

  ingress {
    external_enabled = true
    target_port      = var.frontend_target_port

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = var.container_app_min_replicas
    max_replicas = var.container_app_max_replicas

    container {
      name   = "frontend"
      image  = "${data.azurerm_container_registry.app.login_server}/${var.frontend_image_repository}:${var.frontend_image_tag}"
      cpu    = var.frontend_cpu
      memory = var.frontend_memory

      dynamic "env" {
        for_each = var.feature_flags
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.key_vault_secrets_user
  ]
}

resource "azurerm_container_app" "backend" {
  name                         = var.backend_container_app_name
  resource_group_name          = module.resource_group.name
  container_app_environment_id = azurerm_container_app_environment.app.id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.app.id]
  }

  registry {
    server   = data.azurerm_container_registry.app.login_server
    identity = azurerm_user_assigned_identity.app.id
  }

  ingress {
    external_enabled = false
    target_port      = var.backend_target_port

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  secret {
    name                = "database-url"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/${var.kv_secret_name_database_url}"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "jwt-access-secret"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/${var.kv_secret_name_jwt_access_secret}"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "access-token-ttl"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/${var.kv_secret_name_access_token_ttl}"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "aws-region"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/${var.kv_secret_name_aws_region}"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "s3-bucket-name"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/${var.kv_secret_name_s3_bucket_name}"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "aws-access-key-id"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/${var.kv_secret_name_aws_access_key_id}"
    identity            = azurerm_user_assigned_identity.app.id
  }

  secret {
    name                = "aws-secret-access-key"
    key_vault_secret_id = "${azurerm_key_vault.app.vault_uri}secrets/${var.kv_secret_name_aws_secret_access_key}"
    identity            = azurerm_user_assigned_identity.app.id
  }

  template {
    min_replicas = var.container_app_min_replicas
    max_replicas = var.container_app_max_replicas

    container {
      name   = "backend"
      image  = "${data.azurerm_container_registry.app.login_server}/${var.backend_image_repository}:${var.backend_image_tag}"
      cpu    = var.backend_cpu
      memory = var.backend_memory

      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }

      env {
        name        = "JWT_ACCESS_SECRET"
        secret_name = "jwt-access-secret"
      }

      env {
        name        = "ACCESS_TOKEN_TTL"
        secret_name = "access-token-ttl"
      }

      env {
        name        = "AWS_REGION"
        secret_name = "aws-region"
      }

      env {
        name        = "S3_BUCKET_NAME"
        secret_name = "s3-bucket-name"
      }

      env {
        name        = "AWS_ACCESS_KEY_ID"
        secret_name = "aws-access-key-id"
      }

      env {
        name        = "AWS_SECRET_ACCESS_KEY"
        secret_name = "aws-secret-access-key"
      }

      env {
        name  = "PORT"
        value = tostring(var.backend_target_port)
      }

      dynamic "env" {
        for_each = var.feature_flags
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.key_vault_secrets_user
  ]
}

