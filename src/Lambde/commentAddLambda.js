const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    
    const {comment_id, blog_id, user_id, username, text, depth, parents} = event;
    

    
    const params = {
        Item: {
            "PK": {
                S: "BLOG-" +  blog_id
            }, 
            "SK": {
                S: "COMM-" + comment_id
            },
            "author_id": {
                S: user_id
            },
            "author": {
                S: username
            },
            "text": {
                S: text
            },
            "depth": {
                S: depth 
            },
            "id": {
                S: comment_id
            }, 
            "parents": {
                S: parents
            }, 
            "blog_id": {
                S: blog_id
            }
        },
        TableName: "blogs-dev"
    };
    
    let responseBody = null;
    let statusCode = 0;
    
    try {

            const data = await dynamodb.putItem(params).promise()
            responseBody = JSON.stringify(data);
            statusCode = 201

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
