# Development Environment Variables
project_name = "cloudops-inventory"
environment  = "dev"
aws_region   = "eu-central-1"

# VPC
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["eu-central-1a", "eu-central-1b"]

# Database
db_instance_class = "db.t3.micro"
db_name           = "inventory_db"
db_username       = "cloudops_user"
db_password       = "YourSecurePassword123!"  # Change this!

# ECS
container_cpu    = 256
container_memory = 512
app_version      = "1.0.0"