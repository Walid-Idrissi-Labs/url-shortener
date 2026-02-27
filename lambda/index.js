const {DynamoDBClient , PutItemCommand , GetItemCommand} = require('@aws-sdk/client-dynamodb')
const crypto = require("crypto")


const dbclient = new DynamoDBClient({})

//environment variable for the DynamoDB table name, set in terraform when creating the lambda function
const TABLE = process.env.DYNAMODB_TABLE


// export async function handleShorten(event){
async function handleShorten(event){
    let body
    try 
    {
        body = JSON.parse(event.body)
    }
    catch{return respond(400 , {error : "invalid body"})}

    const {url} = body 
    if(!url){
        return respond(400 , {error : "no url provided"})
    }

    const code = crypto.randomBytes(4).toString("hex")

    const expiresAt = Math.floor(Date.now()/1000) + 3600*24*30

    await dbclient.send(  new PutItemCommand(
        {
            TableName : TABLE,
            Item : {
                short_code : {S:code},
                url : {S:url},
                expires_at : {N:String(expiresAt)},
            }
        }
    ) )

    return respond(200 , {code , expiresAt})
}




async function handleRedirect(code){
    const result = await dbclient.send( new GetItemCommand({
        TableName : TABLE,
        Key :  {
            short_code : {S:code}
        }
    }))

    if (!result.Item){
        return respond(404 , {error : "short url not found / expired"}) 
    }

    const url = result.Item.url.S

    return {
        statusCode : 302,
        headers : {
            Location : url
        },
        body : ""
    }


}


exports.handler = async (event) => {
    const method = event.requestContext.http.method
    const path = event.requestContext.http.path

    if (method === "POST" && path === "/shorten" ){
        return handleShorten(event)
    }

    if (method === "GET" && path!=="/"){
        const code = path.replace("/" , "")
        return handleRedirect(code)
    }

    return {statusCode:404 , body:"not found"}
}





//helper
function respond(statusCode , body){
    return {
        statusCode,
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    }
}