const dynamoClient = require('./dynamoClients');

class Database2 {
  constructor() {
    this.tableName = 'userRecommend';
    if (!this.tableName) {
      throw new Error('DynamoDB 테이블 이름이 설정되지 않았습니다. 환경 변수 userRecommend tableName을 확인하세요.');
    }
  }


  async queryItems(queryParams) {
    const params = {
      ...queryParams,
      TableName: this.tableName,
    };
    try {
      const result = await dynamoClient.query(params).promise();
      console.log('queryItems 결과:', result);
      return result;
      
    } catch (error) {
      console.error('queryItems 에러:', error);
      throw error;
    }
  }
}

module.exports = Database2;