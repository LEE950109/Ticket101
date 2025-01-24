const dynamoClient = require('./dynamoClients');

class Database {
  constructor() {
    // 테이블 이름 유효성 확인
    this.tableName = 'AuthTable';
    if (!this.tableName) {
      throw new Error('DynamoDB 테이블 이름이 설정되지 않았습니다. 환경 변수 AUTH_TABLE 또는 tableName을 확인하세요.');
    }
  }

  // 이메일로 사용자 가져오기
  async getUserById(email) {
    const params = {
      TableName: this.tableName,
      Key: { email }, // DynamoDB에서 이메일을 기본 키로 사용
    };

    console.log('getUserById 요청:', params);

    try {
      const result = await dynamoClient.get(params).promise();
      console.log('getUserById 결과:', result);
      return result.Item || null;
    } catch (error) {
      console.error('getUserById 에러:', error);
      throw error;
    }
  }

  // 사용자 생성
  async createUser(user) {
    const params = {
      TableName: this.tableName,
      Item: user, // 전체 사용자 데이터 삽입
    };

    console.log('createUser 요청:', params);

    try {
      await dynamoClient.put(params).promise();
      console.log('createUser 성공:', user);
    } catch (error) {
      console.error('createUser 에러:', error);
      throw error;
    }
  }

  // DynamoDB 쿼리 실행
  async queryItems(queryParams) {
    const params = {
      ...queryParams,
      TableName: this.tableName,
    };

    console.log('queryItems 요청:', params);

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

module.exports = Database;
