resource_group_name = "rg-team4-backend"
location            = "uksouth"
environment         = "dev"
project_name        = "team4-backend"
key_vault_name      = "kv-team4-backend-dev"
managed_identity_name = "id-team4-backend-dev"
container_app_environment_name = "cae-team4-backend-dev"
acr_name = "acraiacademy26"
acr_resource_group_name = "rg-ai-academy-26"
enable_acr_pull_role_assignment = false
frontend_container_app_name = "ca-team4-frontend-dev"
backend_container_app_name = "ca-team4-backend-dev"
frontend_image_repository = "team4-frontend"
frontend_image_tag = "9b5d5904-prod-deps-2026-07-30-11-06-05"
backend_image_repository = "team4-backend"
backend_image_tag = "3fffb75d4757dbaf0e8b1a1b346280f9759628ee"
frontend_target_port = 80
backend_target_port = 3000
frontend_cpu = 0.25
frontend_memory = "0.5Gi"
backend_cpu = 0.5
backend_memory = "1Gi"
container_app_min_replicas = 1
container_app_max_replicas = 2

feature_flags = {
  ENABLE_DEV_TEST_USER = "false"
}

kv_secret_name_database_url = "database-url"
kv_secret_name_jwt_access_secret = "jwt-access-secret"
kv_secret_name_access_token_ttl = "access-token-ttl"
kv_secret_name_aws_region = "aws-region"
kv_secret_name_s3_bucket_name = "s3-bucket-name"
kv_secret_name_aws_access_key_id = "aws-access-key-id"
kv_secret_name_aws_secret_access_key = "aws-secret-access-key"

tags = {
  managed_by  = "terraform"
  created_by  = "platform-course"
  cost_center = "engineering"
}
