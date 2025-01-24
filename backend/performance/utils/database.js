const dynamoClient = require('./dynamoClients');

class Database {
  constructor() {
    this.tableName = 'PerformancesTable';
    if (!this.tableName) {
      throw new Error('DynamoDB 테이블 이름이 설정되지 않았습니다. 환경 변수 performance tableName을 확인하세요.');
    }
  }

  // 모든 공연 정보 조회
  async getAllPerformances() {
    const params = {
      TableName: this.tableName
    };
    // console.log('getAllPerformances 요청:', params);

    try {
      const result = await dynamoClient.scan(params).promise();
      // console.log('getAllPerformances 결과:', result);
      return result.Items || [];
    } catch (error) {
      console.error('getAllPerformances 에러:', error);
      throw error;
    }
  }

  // 단일 공연 정보 조회
  async getPerformanceById(performance_id) {
    const params = {
      TableName: this.tableName,
      Key: {
        performance_id
      }
    };

    // console.log('getPerformanceById 요청:', params);

    try {
      const result = await dynamoClient.get(params).promise();
      // console.log('getPerformanceById 결과:', result);
      return result.Item;
    } catch (error) {
      console.error('getPerformanceById 에러:', error);
      throw error;
    }
  }
}

module.exports = Database;