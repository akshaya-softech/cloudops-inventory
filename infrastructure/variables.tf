# General
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "cloudops-inventory"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

# VPC
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["eu-central-1a", "eu-central-1b"]
}

# Database
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "inventory_db"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "cloudops_user"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# ECS
variable "container_cpu" {
  description = "Container CPU units"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "Container memory (MB)"
  type        = number
  default     = 512
}

variable "app_version" {
  description = "Application version"
  type        = string
  default     = "1.0.0"
}