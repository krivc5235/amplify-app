const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB

const tableName= "blogs-dev"

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    let { comment_id, type }  = event;
    
    
    
    switch(type) {
        case"like":
            const likeParams= {
                TableName: tableName,
        
                KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues: {
                    ":SK": {
                        S: "LIKE-"
                    }, 
                   ":PK": {
                        S: "COMM-" + comment_id
                    }
            
                }
        
            };
            //return {statusCode: 205, body: JSON.stringify(likeParams)};
            try{
                const data = await dynamodb.query(likeParams).promise();
                const items = data.Items.map(
                    (entry) => {
                        return {user_id: entry.user_id.S}
                    }    
                )
                return {statusCode: 200, body: JSON.stringify(items)};
            } catch(e) {
                return {statusCode: 400, body: JSON.stringify(e)};
            }
            break;
            
            
        case "dislike":
            const dislikeParams= {
                TableName: tableName,
        
                KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)",
                ExpressionAttributeValues: {
                    ":SK": {
                        S: "DISL-"
                    }, 
                   ":PK": {
                        S: "COMM-" + comment_id
                    }
            
                }
        
            };
            try{
                const data = await dynamodb.query(dislikeParams).promise();
                const items = data.Items.map(
                    (entry) => {
                        return {user_id: entry.user_id.S}
                    }    
                )
                return {statusCode: 200, body: JSON.stringify(items)};
            } catch(e) {
                return {statusCode: 400, body: JSON.stringify(e)};
            }
            break;
        
        
    }
    
    
    
};