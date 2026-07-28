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
    use_cli              = true
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
