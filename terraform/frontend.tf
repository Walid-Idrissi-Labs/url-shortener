#s3 bucket to host the reactapp, only cloudfront will access it 
    #and it will only request it when theres a cache miss, otherwise cloudfront will serve the cached version
resource "aws_s3_bucket" "frontend" {
      bucket = "url-shortener-frontend-${random_id.bucket_suffix.hex}"
      force_destroy = true 
} 

#bucket public access settings 
    #(private, only cloudfront can access it)
resource "aws_s3_bucket_public_access_block" "frontend" {
    bucket = aws_s3_bucket.frontend.id
    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
}



#OAC for cloudfront
resource "aws_cloudfront_origin_access_control" "frontend" {
    name = "url_shortener-oac"
    origin_access_control_origin_type = "s3"
    signing_behavior = "always"
    signing_protocol = "sigv4"
}


#cloudfront distribution to serve the react app
resource "aws_cloudfront_distribution" "frontend" {
    enabled = true
    default_root_object = "index.html"

    origin {
        domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
        origin_id = "S3Frontend"
        origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
    }

    default_cache_behavior {
      allowed_methods = ["GET" , "HEAD"]
      cached_methods = ["GET" , "HEAD"]
      target_origin_id = "S3Frontend"
      viewer_protocol_policy = "redirect-to-https"
      cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"  # "CachingOptimized" Policy


    }

    # custom_error_reponse {
    #     error_code=403
    #     response_code = 200
    #     response_page_path = "/index.html"
    # }


    restrictions {
        geo_restriction {
          restriction_type = "none"
        }
    }

    viewer_certificate {
      cloudfront_default_certificate = true #https via cloudfronts certif
    }

    # depends on the bucket policy
    # depends_on = [ aws_s3_bucket_policy.frontend ]


}


#allow the "frontend" distribution read from the bucket
resource "aws_s3_bucket_policy" "frontend" {
    bucket = aws_s3_bucket.frontend.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
            Effect = "Allow"
            Principal = {
                Service = "cloudfront.amazonaws.com"
            }
            Action = "s3:GetObject"
            Resource : "${aws_s3_bucket.frontend.arn}/*"
            Condition = {
                StringEquals = {
                    "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
                }
            }
        }]
    })
}