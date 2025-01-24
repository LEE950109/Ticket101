const AWS = require('aws-sdk');

// AWS DynamoDB 설정
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    // endpoint: process.env.DYNAMODB_ENDPOINT, // 로컬 테스트용
});
// AWS 설정값 출력
console.log('AWS Config:', {
    region: AWS.config.region,
    accessKeyId: AWS.config.credentials ? AWS.config.credentials.accessKeyId : 'undefined',
    secretAccessKey: AWS.config.credentials ? AWS.config.credentials.secretAccessKey : 'undefined',
  });
  
const dynamoClient = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoClient;