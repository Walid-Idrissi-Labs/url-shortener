terraform{
    required_providers {
      aws={
        source="hashicorp/aws"
        version="~> 5.0"
      }
    }
}

provider "aws" {
    region = "us-east-1"
    profile = "dev"  
}


resource "random_id" "bucket_suffix" {
  byte_length = 4
}




resource "aws_dynamodb_table" "urls" {
    name =  "url-shortener-urls"
    billing_mode = "PAY_PER_REQUEST"
    hash_key = "short_code"

    attribute {
        name = "short_code"
        type = "S"
    }

    ttl {
        attribute_name = "expires_at"
        enabled = true  
    }
}