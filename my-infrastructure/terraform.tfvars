resource_group_name = "rg-team4-backend"
location            = "uksouth"
environment         = "dev"
project_name        = "team4-backend"
acr_name            = "acraiacademy26"
acr_resource_group  = "rg-ai-academy-26"
image_tag             = "latest"
frontend_project_name = "team4-frontend"

secret_env_vars = {
  # "DATABASE_URL" = "https://kv-team4-backend-dev.vault.azure.net/secrets/DATABASE-URL"
  # "JWT_SECRET"   = "https://kv-team4-backend-dev.vault.azure.net/secrets/JWT-SECRET"
}

feature_flags = {
  # "FEATURE_NEW_UI" = "false"
}

tags = {
  managed_by  = "terraform"
  created_by  = "platform-course"
  cost_center = "engineering"
}
