const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB

const tableName= "blogs-dev"

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    let { comment_id, user_id, type }  = event;
    
    
    
    switch(type) {
        case"like":
            let likeParams= {
                Item: {
                    "PK": {
                        S: "COMM-" + comment_id
                    },
                    "SK": {
                        S: "LIKE-" + user_id
                    },
                    "user_id": {
                        S: user_id
                    },
                    "comment_id": {
                        S: comment_id
                    }
                },
                TableName: tableName
            };
            try{
                const data = await dynamodb.putItem(likeParams).promise();
                return {statusCode: 200, body: data};
            } catch(e) {
                return {statusCode: 400, body: JSON.stringify(e)};
            }
            break;
            
            
        case "dislike":
            let dislikeParams= {
                Item: {
                    "PK": {
                        S: "COMM-" + comment_id
                    },
                    "SK": {
                        S: "DISL-" + user_id
                    },
                    "user_id": {
                        S: user_id
                    },
                    "comment_id": {
                        S: comment_id
                    }
                },
                TableName: tableName
            };
            try{
                const data = await dynamodb.putItem(dislikeParams).promise();
                return {statusCode: 200, body: data};
            } catch(e) {
                return {statusCode: 400, body: JSON.stringify(e)};
            }
            break;  
        
        case "unlike":
            let unlikeParams= {
                Key: {
                    "PK": {
                        S: "COMM-" + comment_id
                    },
                    "SK": {
                        S: "LIKE-" + user_id
                    }
                },
                TableName: tableName
            };
            try{
                const data = await dynamodb.deleteItem(unlikeParams).promise();
                return {statusCode: 200, body: data};
            } catch(e) {
                return {statusCode: 400, body: JSON.stringify(e)};
            }
            break;      
            
        case "undislike":
            let undislikeParams= {
                Key: {
                    "PK": {
                        S: "COMM-" + comment_id
                    },
                    "SK": {
                        S: "DISL-" + user_id
                    }
                },
                TableName: tableName
            };
            try{
                const data = await dynamodb.deleteItem(undislikeParams).promise();
                return {statusCode: 200, body: data};
            } catch(e) {
                return {statusCode: 400, body: JSON.stringify(e)};
            }
            break;     
            
    }
    
    
    
};