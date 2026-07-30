terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

locals {
  resource_group_name = "rg-team4-${var.environment}-${var.location}"
}

module "resource_group" {
  source   = "../modules/resource-group"
  name     = local.resource_group_name
  location = var.location

  tags = {
    environment = var.environment
    managed_by  = var.managed_by
    project     = var.project
  }
}

data "azurerm_client_config" "current" {}

data "azurerm_container_registry" "main" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group
}

data "azurerm_key_vault" "main" {
  name                = var.key_vault_name
  resource_group_name = var.key_vault_resource_group
}

resource "azurerm_user_assigned_identity" "main" {
  name                = "id-team4-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = var.location

  tags = {
    environment = var.environment
    managed_by  = var.managed_by
    project     = var.project
  }
}

resource "azurerm_log_analytics_workspace" "main" {
  name                = "log-team4-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = var.location
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    environment = var.environment
    managed_by  = var.managed_by
    project     = var.project
  }
}

resource "azurerm_container_app_environment" "main" {
  name                       = "cae-team4-${var.environment}"
  resource_group_name        = module.resource_group.name
  location                   = var.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  tags = {
    environment = var.environment
    managed_by  = var.managed_by
    project     = var.project
  }
}

resource "azurerm_container_app" "postgres" {
  name                         = "ca-team4-postgres-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = module.resource_group.name
  revision_mode                = "Single"

  ingress {
    external_enabled = false
    target_port      = 5432
    transport        = "tcp"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    container {
      name   = "postgres"
      image  = "postgres:16"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "POSTGRES_DB"
        value = "job_roles_db"
      }

      env {
        name  = "POSTGRES_USER"
        value = "academy_user"
      }

      env {
        name        = "POSTGRES_PASSWORD"
        secret_name = "postgres-password"
      }
    }
  }

  secret {
    name  = "postgres-password"
    value = var.postgres_password
  }

  tags = {
    environment = var.environment
    managed_by  = var.managed_by
    project     = var.project
  }
}

resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.main.principal_id
}

resource "azurerm_role_assignment" "kv_secrets_user" {
  scope                = data.azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.main.principal_id
}

resource "azurerm_container_app" "backend" {
  name                         = "ca-team4-backend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = module.resource_group.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }

  registry {
    server   = data.azurerm_container_registry.main.login_server
    identity = azurerm_user_assigned_identity.main.id
  }

  ingress {
    external_enabled = false
    target_port      = 4000
    transport        = "http"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    container {
      name   = "team4-backend"
      image  = "${data.azurerm_container_registry.main.login_server}/team4-backend:${var.backend_image_tag}"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = "4000"
      }

      env {
        name  = "DATABASE_URL"
        value = "postgresql://academy_user:${var.postgres_password}@${azurerm_container_app.postgres.ingress[0].fqdn}:5432/job_roles_db"
      }

      env {
        name        = "JWT_ACCESS_SECRET"
        secret_name = "jwt-access-secret"
      }

      env {
        name  = "AWS_REGION"
        value = var.aws_region
      }

      env {
        name  = "S3_BUCKET_NAME"
        value = var.s3_bucket_name
      }

      env {
        name  = "FEATURE_JOB_APPLICATIONS_ENABLED"
        value = tostring(var.feature_job_applications_enabled)
      }
    }
  }

  secret {
    name                = "jwt-access-secret"
    key_vault_secret_id = "${data.azurerm_key_vault.main.vault_uri}secrets/JwtAccessSecret"
    identity            = azurerm_user_assigned_identity.main.id
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.kv_secrets_user,
    azurerm_container_app.postgres,
  ]

  tags = {
    environment = var.environment
    managed_by  = var.managed_by
    project     = var.project
  }
}

resource "azurerm_container_app" "frontend" {
  name                         = "ca-team4-frontend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = module.resource_group.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }

  registry {
    server   = data.azurerm_container_registry.main.login_server
    identity = azurerm_user_assigned_identity.main.id
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    transport        = "http"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    container {
      name   = "team4-frontend"
      image  = "${data.azurerm_container_registry.main.login_server}/team4-frontend:${var.frontend_image_tag}"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "BACKEND_URL"
        value = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
      }

      env {
        name  = "FEATURE_JOB_APPLICATIONS_ENABLED"
        value = tostring(var.feature_job_applications_enabled)
      }
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_container_app.backend,
  ]

  tags = {
    environment = var.environment
    managed_by  = var.managed_by
    project     = var.project
  }
}