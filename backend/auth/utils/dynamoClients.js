const AWS = require('aws-sdk');

// AWS DynamoDB 설정
AWS.config.update({
  region: process.env.AWS_REGION, // AWS 리전 설정
  accessKeyId: process.env.ACCESS_KEY_ID,   // 환경 변수에서 가져오기
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  // endpoint: 'http://localhost:8000', // 환경 변수에서 가져오기
});
// AWS 설정값 출력
console.log('AWS Config:', {
  region: AWS.config.region,
  accessKeyId: AWS.config.credentials ? AWS.config.credentials.accessKeyId : 'undefined',
  secretAccessKey: AWS.config.credentials ? AWS.config.credentials.secretAccessKey : 'undefined',
});


const dynamoClient = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoClient;
