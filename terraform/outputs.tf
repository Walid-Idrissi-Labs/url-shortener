output "api_endpoint" {
    description = "API ENDPOINT"
    value = aws_apigatewayv2_api.main.api_endpoint
}

output "api_id" {
    value = aws_apigatewayv2_api.main.id
}

output "cloudfront_domain" {
    #https and not http because of the certificate provided by cloudfront
    description = "CloudFront Domain"
    value = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
    description = "CloudFront Distrib ID"
    value = aws_cloudfront_distribution.frontend.id
} 

output "s3_bucket_name" {
    description = "S3 Bucket Name"
    value = aws_s3_bucket.frontend.id
}