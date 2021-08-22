const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB
const tableName = "blogs-dev"

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    const { id, userId }  = event;
    let responseBody = "";
    let statusCode = 0;
    const paramsComments= {
        TableName: tableName,
        
        KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)",
        ExpressionAttributeValues: {
            ":SK": {
                S: "COMM-"
            }, 
            ":PK": {
                S: "BLOG-" + id
            }
            
        }
        
    };
    
    const params = {
        TableName: tableName,
        Key: {
            "PK": {
                S: "BLOG-" + id
            },
            "SK": {
                S: "BLOG-" + id
            }
        }
        
    };
    let author_id = "";
    try {
        const data = await dynamodb.getItem(params).promise();
        author_id = data.Item.author_id.S;
        
    } catch (e) {
        return {statusCode: 400, body: e}
    }
    if(author_id === userId) {
        try {
        
        const data = await dynamodb.query(paramsComments).promise();
        
        /*const items = data.Items.map(
            (dataField) => {
                return {id: dataField.id.S, blog_id: dataField.blog_id.S, text: dataField.text.S, user_id: dataField.author_id.S, username: dataField.author.S, depth: dataField.depth.S, parents: dataField.parents.S};
            }    
        );*/
        try {
            
            for(let i = 0; i < data.Count; i++) {
                //brisanje lajkov
                const getCommParams = {
                    TableName: tableName,
        
                    KeyConditionExpression: "PK = :PK",
                    ExpressionAttributeValues: {
                        ":PK": {
                            S: data.Items[i].SK.S
                        }
            
                    }
                };
                const commentData = await dynamodb.query(getCommParams).promise();
                for(let j = 0; j < commentData.Count; j++) {
                    const paramsCommDelete = {
                        TableName: tableName,
                        Key: {
                            "PK": {
                                S: data.Items[i].SK.S
                            },
                            "SK": {
                                S: commentData.Items[j].SK.S
                            }
                        }
                    };
                    await dynamodb.deleteItem(paramsCommDelete).promise();
                }
                
                
                //brisanje komentarja
                const paramsDelete = {
                    TableName: tableName,
                    Key: {
                        "PK": {
                            S: "BLOG-" + id
                        },
                        "SK": {
                            S: data.Items[i].SK.S
                        }
                    }
                };
                //return {statusCode: 206, body: JSON.stringify(paramsDelete.Key)};
                await dynamodb.deleteItem(paramsDelete).promise();
            }
            } catch (e) {
                return {statusCode: 400, body: e};
                
            }
            
    
    
        } catch(error) {
            return {statusCode: 400, body: error}
        }
        
        
        
        try {
    
            const data = await dynamodb.deleteItem(params).promise();
            responseBody = data;
            statusCode = 200;
    
        } catch(error) {
            responseBody = error.message;
            statusCode= 400;
        }
        
        const response = {
            statusCode: statusCode,
            body: responseBody
        };
        
        return response;
    }
    else {
        return {statusCode: 400, body: "Not correct user"};
    }
    
    
};

