# OptiMind AI Ecosystem - AWS Provider Configuration
# Premium Diamond-Grade Infrastructure Setup

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

# Configure AWS Provider with enterprise-grade settings
provider "aws" {
  region = var.aws_region
  
  # Default tags for all resources
  default_tags {
    tags = {
      Project        = "OptiMind-AI-Ecosystem"
      Environment    = var.environment
      ManagedBy      = "Terraform"
      CostCenter     = "AI-Platform"
      Compliance     = "SOC2-GDPR-HIPAA"
      SecurityLevel  = "Military-Grade"
    }
  }
}

# Generate unique resource names
resource "random_pet" "unique_name" {
  length    = 2
  separator = "-"
}

# Create TLS certificate for secure communications
resource "tls_private_key" "optimind_tls" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# S3 bucket for infrastructure state (with encryption and versioning)
resource "aws_s3_bucket" "terraform_state" {
  bucket = "optimind-ai-terraform-state-${random_pet.unique_name.id}"
  
  tags = {
    Purpose = "Terraform-State"
    Encryption = "AES-256"
    Versioning = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# DynamoDB table for state locking (with encryption)
resource "aws_dynamodb_table" "terraform_lock" {
  name         = "optimind-ai-terraform-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
  
  server_side_encryption {
    enabled = true
  }
  
  point_in_time_recovery {
    enabled = true
  }
}

# Configure Terraform backend with enterprise settings
terraform {
  backend "s3" {
    bucket         = aws_s3_bucket.terraform_state.id
    key            = "optimind-ai-ecosystem/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = aws_dynamodb_table.terraform_lock.name
    encrypt        = true
    kms_key_id     = aws_kms_key.terraform_state.arn
  }
}

# KMS Key for state encryption
resource "aws_kms_key" "terraform_state" {
  description = "KMS key for Terraform state encryption"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "*"
        }
        Action   = "kms:*"
        Resource = "*"
        Condition = {
          StringEquals = {
            "aws:PrincipalTag/Project" = "OptiMind-AI-Ecosystem"
          }
        }
      }
    ]
  })
  
  tags = {
    Purpose = "Terraform-State-Encryption"
  }
}

resource "aws_kms_alias" "terraform_state" {
  name          = "alias/optimind-ai-terraform-state"
  target_key_id = aws_kms_key.terraform_state.key_id
}