const dynamoClient = require('./dynamoClients');

class Database {
  constructor() {
    this.tableName = 'favoritesTable';
    if (!this.tableName) {
      throw new Error('DynamoDB 테이블 이름이 설정되지 않았습니다. 환경 변수 FAVORITE_TABLE 또는 tableName을 확인하세요.');
    }
  }

  // 즐겨찾기 조회
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

  // 즐겨찾기 추가
  async addFavorite(item) {
    const params = {
      TableName: this.tableName,
      Item: item
    };

    console.log('addFavorite 요청:', params);

    try {
      await dynamoClient.put(params).promise();
      console.log('addFavorite 성공:', item);
      return item;
    } catch (error) {
      console.error('addFavorite 에러:', error);
      throw error;
    }
  }

  // 즐겨찾기 삭제
  async deleteFavorite(userId, performance_id) {
    const params = {
      TableName: this.tableName,
      Key: {
        userId,
        performance_id
      }
    };

    console.log('deleteFavorite 요청:', params);

    try {
      await dynamoClient.delete(params).promise();
      console.log('deleteFavorite 성공');
      return true;
    } catch (error) {
      console.error('deleteFavorite 에러:', error);
      throw error;
    }
  }
}

module.exports = Database;
