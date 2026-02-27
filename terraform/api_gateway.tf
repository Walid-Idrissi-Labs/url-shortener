resource "aws_apigatewayv2_api" "main" {
    name = "url-shortener-api"
    protocol_type = "HTTP"

    cors_configuration {
      allow_origins = ["*"] #allow requests from any domain
      allow_methods = ["GET" , "POST" , "OPTIONS"]
      allow_headers = ["Content-Type"]
    }
}

#allow API Gateway to invoke the lambda function
resource "aws_lambda_permission" "api_gateway" {
    statement_id = "AllowAPIGateway"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.main.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}




resource "aws_apigatewayv2_stage" "default" {
    api_id = aws_apigatewayv2_api.main.id
    name = "$default" #default stage, all routes will be deployed here
    auto_deploy = true 
}

#attach (integrate) route to lambda
resource "aws_apigatewayv2_integration" "shorten" {
    api_id = aws_apigatewayv2_api.main.id
    integration_type = "AWS_PROXY" #forwads the entire request to Lambda, without any transformation
    integration_uri = aws_lambda_function.main.invoke_arn
    payload_format_version = "2.0"
}


#route
    #routes are what triggers and integration
resource "aws_apigatewayv2_route" "shorten" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /shorten" 
    target = "integrations/${aws_apigatewayv2_integration.shorten.id}"
}



#redirect route
resource "aws_apigatewayv2_route" "redirect" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /{code}"
    target = "integrations/${aws_apigatewayv2_integration.shorten.id}"
    #same integration for shortnening and redirecting (the lambda function takes care of both depending on the http method) 
}
