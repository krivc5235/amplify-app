const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB

const tableName= "blogs-dev"

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    let { comment_id, blog_id, userId }  = event;
    
    //za brisanje lajkov
    const getCommParams = {
        TableName: tableName,

        KeyConditionExpression: "PK = :PK",
        ExpressionAttributeValues: {
            ":PK": {
                S: "COMM-" + comment_id
            }

        }
    };
                
    
    
    
    const params = {
        TableName: tableName,
        Key: {
            "PK": {
                S: "BLOG-" + blog_id
            },
            "SK": {
                S: "COMM-" + comment_id
            }
        }
        
    };
    
    let responseBody = "";
    let statusCode = 0;
    try {
        
        const commentData = await dynamodb.query(getCommParams).promise();
        for(let j = 0; j < commentData.Count; j++) {
            const paramsCommDelete = {
                TableName: tableName,
                Key: {
                    "PK": {
                        S: "COMM-" + comment_id
                    },
                    "SK": {
                        S: commentData.Items[j].SK.S
                    }
                }
            };
            await dynamodb.deleteItem(paramsCommDelete).promise();
        }
        
        const comment = await dynamodb.getItem(params).promise();
        if(comment.Item.author_id.S === userId) {
            const data = await dynamodb.deleteItem(params).promise();
            responseBody = data;
            statusCode = 200;
        } else {
            responseBody= "Wrong userId";
            statusCode = 300;
        }
        

    } catch(error) {
        responseBody = error.message;
        statusCode= 400;
    }
    
    const response = {
        statusCode: statusCode,
        body: responseBody
    };
    
    return response;
    
    
};