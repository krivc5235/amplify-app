const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    let id  = event.id;
    
    if(id != null) {
        const params= {
            Key: {
                "PK": {
                    S: "BLOG-" + id
                },
                "SK": {
                    S: "BLOG-" +id
                }
            }, TableName: "blogs-dev"
        };
        
      
        try {

            const d = await dynamodb.getItem(params).promise();
            const data = d.Item;
            const blog = {id: data.id.S, title: data.title.S, text: data.text.S, author: data.author.S, author_id: data.author_id.S}
            const response = {
                statusCode: 200,
                body: blog
            };
            return response;

        } catch(error) {
            const response = {
                statusCode: 403,
                body: error.message
            };
            return response;
        }
        
        
    } else {
        const params = {
            TableName: "blogs-dev",
            
            FilterExpression: "begins_with(SK, :SK)",
            ExpressionAttributeValues: {
                ":SK": {
                    S: "BLOG-"
                }, 
                
            }
        };
        
        let responseBody = "";
        let statusCode = 0;
        try {

            const data = await dynamodb.scan(params).promise();
            const items = data.Items.map(
                (dataField) => {
                    return {id: dataField.id.S, title: dataField.title.S, text: dataField.text.S, author: dataField.author.S, author_id: dataField.author_id.S}
                }    
            );
            responseBody = JSON.stringify(items);
            statusCode = 200;

        } catch(error) {
            responseBody = error.message;
            statusCode= 400;
        }
        
        const response = {
            statusCode: statusCode,
            body: responseBody
        }    ;
        
        return response;
    }
    
};
