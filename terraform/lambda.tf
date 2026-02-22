resource "aws_iam_role" "lambda" {
    name = "url-shortener-lambda-role"

    #only the lambda will assume this role
    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = "lambda.amazonaws.com"
                }
            }
        ]
    })
}


#attach lambda to DynamoDB for reading/writing urls from/to DynamoDB table via the created iam role
resource "aws_iam_role_policy" "lambda_dynamodb" {
    role = aws_iam_role.lambda.id
    policy = jsonencode( {
        Version = "2012-10-17"
        Statement = [
            {
                Action = [
                    "dynamodb:PutItem",
                    "dynamodb:GetItem"
                ]
                Effect = "Allow"
                Resource = aws_dynamodb_table.urls.arn
            }
        ]
    })
}


#attach role, for lambda to write logs to cloudwatch
resource "aws_iam_role_policy_attachment" "lambda_logs" {
    role = aws_iam_role.lambda.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}




#zip the lambda code
data "archive_file" "lambda"{
    type = "zip"
    source_dir = "../lambda"
    output_path = "../lambda.zip"
}

resource "aws_lambda_function" "main"{
    filename = data.archive_file.lambda.output_path
    function_name = "url-shortener"
    role = aws_iam_role.lambda.arn
    runtime = "nodejs20.x"
    handler = "index.handler" #"handler" export in index.js
    source_code_hash = data.archive_file.lambda.output_base64sha256 #hash the zip file, 
    #when the source code changes, so does the its hash, which triggers lambda to update the function code

    environment {
      variables = {
        DYNAMODB_TABLE = aws_dynamodb_table.urls.name
      }
    }
}
