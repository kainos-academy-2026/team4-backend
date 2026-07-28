variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "rg-team4-backend"

  validation {
    condition     = length(var.resource_group_name) >= 1 && length(var.resource_group_name) <= 90
    error_message = "Resource group name must be between 1 and 90 characters."
  }
}

variable "location" {
  description = "Azure region for resources (e.g., uksouth, eastus, northeurope)"
  type        = string
  default     = "uksouth"

  validation {
    condition     = can(regex("^[a-z]+$", var.location))
    error_message = "Location must contain only lowercase letters."
  }
}

variable "environment" {
  description = "Deployment environment (dev, test, or prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "Environment must be one of: dev, test, prod."
  }
}

variable "project_name" {
  description = "Project name for resource naming and tagging"
  type        = string
  default     = "team4-backend"

  validation {
    condition     = length(var.project_name) >= 1 && length(var.project_name) <= 20
    error_message = "Project name must be between 1 and 20 characters."
  }
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    managed_by = "terraform"
    created_by = "platform-course"
  }
}
