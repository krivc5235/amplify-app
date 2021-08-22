const AWS = require("aws-sdk");
AWS.config.update({region: "eu-west-1"})

const dynamodb = new AWS.DynamoDB

exports.handler = async (event) => {
    
    const dbb= new AWS.DynamoDB({apiVersion: "2012-08-10"})
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
    console.log(event.body)
    
    let id  = event.id;
    
    
    const params = {
        TableName: "blogs-dev",
        
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
    
    let responseBody = "";
    let statusCode = 0;
    try {

        const data = await dynamodb.query(params).promise();
        const items = data.Items.map(
            (dataField) => {
                return {id: dataField.id.S, blog_id: dataField.blog_id.S, text: dataField.text.S, user_id: dataField.author_id.S, username: dataField.author.S, depth: dataField.depth.S, parents: dataField.parents.S};
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
    };
    
    return response;
    
    
};
