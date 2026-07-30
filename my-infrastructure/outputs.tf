output "resource_group_name" {
  description = "The name of the created resource group"
  value       = module.resource_group.name
}

output "resource_group_id" {
  description = "The ID of the created resource group (unique Azure identifier)"
  value       = module.resource_group.id
}

output "location" {
  description = "The Azure region where the resource group is deployed"
  value       = module.resource_group.location
}

output "resource_group_full_info" {
  description = "Complete resource group information for reference"
  value = {
    name     = module.resource_group.name
    id       = module.resource_group.id
    location = module.resource_group.location
  }
}

output "key_vault_name" {
  description = "The name of the created Key Vault"
  value       = azurerm_key_vault.app.name
}

output "key_vault_id" {
  description = "The ID of the created Key Vault"
  value       = azurerm_key_vault.app.id
}

output "key_vault_uri" {
  description = "The URI of the created Key Vault (used for secret references)"
  value       = azurerm_key_vault.app.vault_uri
}

output "managed_identity_name" {
  description = "The name of the created user assigned managed identity"
  value       = azurerm_user_assigned_identity.app.name
}

output "managed_identity_id" {
  description = "The resource ID of the created user assigned managed identity"
  value       = azurerm_user_assigned_identity.app.id
}

output "managed_identity_principal_id" {
  description = "The principal ID of the managed identity (used for RBAC role assignments)"
  value       = azurerm_user_assigned_identity.app.principal_id
}

output "managed_identity_client_id" {
  description = "The client ID of the managed identity"
  value       = azurerm_user_assigned_identity.app.client_id
}

output "container_app_environment_name" {
  description = "The name of the created Container Apps environment"
  value       = azurerm_container_app_environment.app.name
}

output "container_app_environment_id" {
  description = "The ID of the created Container Apps environment"
  value       = azurerm_container_app_environment.app.id
}

output "container_app_environment_default_domain" {
  description = "The default domain for apps in the Container Apps environment"
  value       = azurerm_container_app_environment.app.default_domain
}

output "container_app_environment_static_ip" {
  description = "The static outbound IP address of the Container Apps environment"
  value       = azurerm_container_app_environment.app.static_ip_address
}

output "acr_id" {
  description = "The Azure resource ID for the container registry used by the apps"
  value       = data.azurerm_container_registry.app.id
}

output "acr_login_server" {
  description = "The login server for the configured container registry"
  value       = data.azurerm_container_registry.app.login_server
}

output "acr_pull_role_assignment_id" {
  description = "Role assignment ID granting AcrPull to the managed identity"
  value       = try(azurerm_role_assignment.acr_pull[0].id, null)
}

output "key_vault_secrets_user_role_assignment_id" {
  description = "Role assignment ID granting Key Vault Secrets User to the managed identity"
  value       = azurerm_role_assignment.key_vault_secrets_user.id
}

output "frontend_container_app_name" {
  description = "The name of the frontend container app"
  value       = azurerm_container_app.frontend.name
}

output "frontend_container_app_id" {
  description = "The resource ID of the frontend container app"
  value       = azurerm_container_app.frontend.id
}

output "frontend_container_app_fqdn" {
  description = "Public FQDN for the frontend container app"
  value       = azurerm_container_app.frontend.latest_revision_fqdn
}

output "backend_container_app_name" {
  description = "The name of the backend container app"
  value       = azurerm_container_app.backend.name
}

output "backend_container_app_id" {
  description = "The resource ID of the backend container app"
  value       = azurerm_container_app.backend.id
}

output "backend_container_app_fqdn" {
  description = "Internal FQDN for the backend container app"
  value       = azurerm_container_app.backend.latest_revision_fqdn
}
