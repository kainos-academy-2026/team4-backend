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
  description = "The name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_uri" {
  description = "The URI of the Key Vault for referencing secrets"
  value       = azurerm_key_vault.main.vault_uri
}

output "managed_identity_id" {
  description = "The resource ID of the managed identity"
  value       = azurerm_user_assigned_identity.main.id
}

output "managed_identity_client_id" {
  description = "The client ID of the managed identity (needed for Container App configuration)"
  value       = azurerm_user_assigned_identity.main.client_id
}

output "container_app_environment_id" {
  description = "The ID of the Container App Environment"
  value       = azurerm_container_app_environment.main.id
}

output "backend_url" {
  description = "The internal FQDN of the backend Container App"
  value       = azurerm_container_app.backend.latest_revision_fqdn
}

output "frontend_url" {
  description = "The public URL of the frontend Container App"
  value       = azurerm_container_app.frontend.latest_revision_fqdn
}
