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

variable "acr_name" {
  description = "The name of the Azure Container Registry."
  type        = string
}

variable "acr_resource_group" {
  description = "The resource group containing the Azure Container Registry."
  type        = string
}

variable "key_vault_name" {
  description = "The name of the existing Azure Key Vault."
  type        = string
}

variable "key_vault_resource_group" {
  description = "The resource group containing the Key Vault."
  type        = string
}

variable "backend_image_tag" {
  description = "The image tag to deploy for the backend container app."
  type        = string
  default     = "main"
}

variable "frontend_image_tag" {
  description = "The image tag to deploy for the frontend container app."
  type        = string
  default     = "main"
}

variable "aws_region" {
  description = "The AWS region for S3 access."
  type        = string
}

variable "s3_bucket_name" {
  description = "The S3 bucket name for CV uploads."
  type        = string
}

variable "feature_job_applications_enabled" {
  description = "Feature flag to enable or disable job applications."
  type        = bool
  default     = true
}

variable "postgres_password" {
  description = "Password for the postgres container app database user."
  type        = string
  sensitive   = true
}