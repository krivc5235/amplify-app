const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    const { id, title, text, author, author_id, userId} = event;
    
    const params = {
        Item: {
            "PK": {
                S: "BLOG-" + id
            }, 
            "SK": {
                S: "BLOG-" + id
            },
            "title": {
                S: title
            },
            "text": {
                S: text
            },
            "author": {
                S: author
            },
            "author_id": {
                S: author_id
            },
            "id": {
                S: id
            }
        },
        TableName: "blogs-dev"
    };
    
    let responseBody = null;
    let statusCode = 0;
    
    try {
            if(userId == author_id) {
                
                const data = await dynamodb.putItem(params).promise();
                responseBody = JSON.stringify(data);
                statusCode = 201
            } else {
                return {statusCode: 400, body: userId};
            }
            

        } catch(error) {
            responseBody = error.message
            statusCode= 403
            

        }
        
    const response = {
        statusCode: statusCode,
        body: responseBody
    }    
    
    return response
};
