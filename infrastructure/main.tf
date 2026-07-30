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