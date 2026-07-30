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

variable "key_vault_name" {
  description = "Globally unique Key Vault name"
  type        = string
  default     = "kv-team4-backend-dev"

  validation {
    condition     = can(regex("^[a-z0-9-]{3,24}$", var.key_vault_name))
    error_message = "Key Vault name must be 3-24 chars and use lowercase letters, numbers, or hyphens."
  }
}

variable "managed_identity_name" {
  description = "Name of the user assigned managed identity"
  type        = string
  default     = "id-team4-backend-dev"

  validation {
    condition     = can(regex("^[a-zA-Z0-9-]{3,128}$", var.managed_identity_name))
    error_message = "Managed identity name must be 3-128 chars and use letters, numbers, or hyphens."
  }
}

variable "container_app_environment_name" {
  description = "Name of the Azure Container Apps environment"
  type        = string
  default     = "cae-team4-backend-dev"

  validation {
    condition     = can(regex("^[a-z0-9-]{3,60}$", var.container_app_environment_name))
    error_message = "Container Apps environment name must be 3-60 chars and use lowercase letters, numbers, or hyphens."
  }
}

variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "acraiacademy26"

  validation {
    condition     = can(regex("^[a-z0-9]{5,50}$", var.acr_name))
    error_message = "ACR name must be 5-50 chars and use lowercase letters or numbers."
  }
}

variable "acr_resource_group_name" {
  description = "Resource group name containing the Azure Container Registry"
  type        = string
  default     = "rg-ai-academy-26"

  validation {
    condition     = length(var.acr_resource_group_name) >= 1 && length(var.acr_resource_group_name) <= 90
    error_message = "ACR resource group name must be between 1 and 90 characters."
  }
}

variable "enable_acr_pull_role_assignment" {
  description = "Set true only when your account has permission to create role assignments on the ACR scope"
  type        = bool
  default     = false
}

variable "frontend_container_app_name" {
  description = "Name of the frontend container app"
  type        = string
  default     = "ca-team4-frontend-dev"
}

variable "backend_container_app_name" {
  description = "Name of the backend container app"
  type        = string
  default     = "ca-team4-backend-dev"
}

variable "frontend_image_repository" {
  description = "Repository name for the frontend image in ACR"
  type        = string
  default     = "team4-frontend"
}

variable "frontend_image_tag" {
  description = "Tag for the frontend image"
  type        = string
  default     = "latest"
}

variable "backend_image_repository" {
  description = "Repository name for the backend image in ACR"
  type        = string
  default     = "team4-backend"
}

variable "backend_image_tag" {
  description = "Tag for the backend image"
  type        = string
  default     = "latest"
}

variable "frontend_target_port" {
  description = "Exposed container port for the frontend app"
  type        = number
  default     = 80
}

variable "backend_target_port" {
  description = "Exposed container port for the backend app"
  type        = number
  default     = 3000
}

variable "frontend_cpu" {
  description = "Frontend container CPU cores"
  type        = number
  default     = 0.25
}

variable "frontend_memory" {
  description = "Frontend container memory allocation"
  type        = string
  default     = "0.5Gi"
}

variable "backend_cpu" {
  description = "Backend container CPU cores"
  type        = number
  default     = 0.5
}

variable "backend_memory" {
  description = "Backend container memory allocation"
  type        = string
  default     = "1Gi"
}

variable "container_app_min_replicas" {
  description = "Minimum number of replicas for container apps"
  type        = number
  default     = 1
}

variable "container_app_max_replicas" {
  description = "Maximum number of replicas for container apps"
  type        = number
  default     = 2
}

variable "feature_flags" {
  description = "Feature flags injected as environment variables"
  type        = map(string)
  default     = {}
}

variable "kv_secret_name_database_url" {
  description = "Key Vault secret name for DATABASE_URL"
  type        = string
  default     = "database-url"
}

variable "kv_secret_name_jwt_access_secret" {
  description = "Key Vault secret name for JWT_ACCESS_SECRET"
  type        = string
  default     = "jwt-access-secret"
}

variable "kv_secret_name_access_token_ttl" {
  description = "Key Vault secret name for ACCESS_TOKEN_TTL"
  type        = string
  default     = "access-token-ttl"
}

variable "kv_secret_name_aws_region" {
  description = "Key Vault secret name for AWS_REGION"
  type        = string
  default     = "aws-region"
}

variable "kv_secret_name_s3_bucket_name" {
  description = "Key Vault secret name for S3_BUCKET_NAME"
  type        = string
  default     = "s3-bucket-name"
}

variable "kv_secret_name_aws_access_key_id" {
  description = "Key Vault secret name for AWS_ACCESS_KEY_ID"
  type        = string
  default     = "aws-access-key-id"
}

variable "kv_secret_name_aws_secret_access_key" {
  description = "Key Vault secret name for AWS_SECRET_ACCESS_KEY"
  type        = string
  default     = "aws-secret-access-key"
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    managed_by = "terraform"
    created_by = "platform-course"
  }
}
