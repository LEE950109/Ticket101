const dynamoClient = require('./dynamoClients');

class Database {
    constructor() {
        this.tableName = 'PerformancesTable';
        if (!this.tableName) {
            throw new Error('DynamoDB 테이블 이름이 설정되지 않았습니다.');
        }
    }

    async searchPerformances(query) {
        const params = {
            TableName: this.tableName
        };

        console.log('searchPerformances 요청:', params);

        try {
            const result = await dynamoClient.scan(params).promise();
            const today = new Date().toISOString().split('T')[0];
            
            const searchResults = (result.Items || [])
                .filter(item => 
                    (item.title?.toLowerCase().includes(query.toLowerCase()) ||
                    item.location?.toLowerCase().includes(query.toLowerCase()) ||
                    item.city?.toLowerCase().includes(query.toLowerCase())) &&
                    item.end_date >= today
                )
                .sort((a, b) => {
                    const diffA = Math.abs(new Date(a.start_date) - new Date(today));
                    const diffB = Math.abs(new Date(b.start_date) - new Date(today));
                    return diffA - diffB;
                });

            console.log('검색 결과 수:', searchResults.length);
            return searchResults;
        } catch (error) {
            console.error('searchPerformances 에러:', error);
            throw error;
        }
    }
}

module.exports = Database;