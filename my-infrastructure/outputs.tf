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
