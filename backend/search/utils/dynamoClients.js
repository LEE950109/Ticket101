const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
// AWS 설정값 출력
console.log('AWS Config:', {
    region: AWS.config.region,
    accessKeyId: AWS.config.credentials ? AWS.config.credentials.accessKeyId : 'undefined',
    secretAccessKey: AWS.config.credentials ? AWS.config.credentials.secretAccessKey : 'undefined',
  });
const dynamoClient = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoClient;