variable "location" {
  description = "The location of the resource group."
  type        = string
  default     = "uksouth"

  validation {
    condition     = can(regex("^[a-z0-9]+$", var.location))
    error_message = "location must be a valid Azure region in lowercase letters and numbers (for example: uksouth, westus2)."
  }
}

variable "environment" {
  description = "The environment tag for the resource group."
  type        = string
  default     = "dev"

  validation {
    condition     = can(regex("^[a-z]+$", var.environment))
    error_message = "environment must be a valid environment name in lowercase letters."
  }
}

variable "project" {
  description = "The project tag for the resource group."
  type        = string
  default     = "team4"

  validation {
    condition     = can(regex("^[a-z0-9]+$", var.project))
    error_message = "project must be a valid project name in lowercase letters and numbers."
  }
}

variable "managed_by" {
  description = "The managed_by tag for the resource group."
  type        = string
  default     = "terraform"

  validation {
    condition     = can(regex("^[a-z]+$", var.managed_by))
    error_message = "managed_by must be a valid manager name in lowercase letters."
  }
}