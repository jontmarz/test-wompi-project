variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "wompi-payment-app"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "wompi_db"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "wompi_public_key" {
  description = "Wompi public key"
  type        = string
  sensitive   = true
}

variable "wompi_private_key" {
  description = "Wompi private key"
  type        = string
  sensitive   = true
}

variable "wompi_integrity_key" {
  description = "Wompi integrity key"
  type        = string
  sensitive   = true
}