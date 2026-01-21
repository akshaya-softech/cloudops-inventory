terraform {
  required_version = ">= 1.0.0"

  # Remote backend - stores state in S3
  backend "s3" {
    bucket = "cloudops-inventory-tfstate-304450758375"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CloudOps-Inventory"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}