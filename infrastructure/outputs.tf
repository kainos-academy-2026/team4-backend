output "resource_group_name" {
  description = "The name of the resource group."
  value       = module.resource_group.name
}

output "frontend_url" {
  description = "The public URL of the frontend container app."
  value       = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
}

output "backend_fqdn" {
  description = "The internal FQDN of the backend container app (not publicly accessible)."
  value       = azurerm_container_app.backend.ingress[0].fqdn
}