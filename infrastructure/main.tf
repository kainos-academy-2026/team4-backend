terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  # Remote state (Azure Storage). The `dev` prefix on the key keeps this
  # environment's state isolated so a `prod.terraform.tfstate` can be added
  # later in the same storage account/container without any code changes.
  #
  # Auth is intentionally NOT hardcoded here (no `use_cli`/`use_oidc` flag) so
  # the same config works in both places via environment variables:
  #   - Local dev:  `az login` + `ARM_USE_CLI=true`
  #   - CI/CD:      `ARM_USE_OIDC=true` + ARM_CLIENT_ID/TENANT_ID/SUBSCRIPTION_ID
  #                 (federated Service Principal credential, no client secret)
  backend "azurerm" {
    resource_group_name  = "rg-team4-backend-dev"
    storage_account_name = "sateam4backend"
    container_name       = "tfstate"
    key                  = "dev.terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
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
