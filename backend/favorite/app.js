const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS 설정
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// DynamoDB 연결 상태 확인
app.get('/health', async (req, res) => {
    try {
        const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
        const client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY
            }
            // endpoint: process.env.DYNAMODB_ENDPOINT // 로컬 테스트용
        });
        await client.config.credentials();
        res.status(200).json({
            status: 'healthy',
            message: 'DynamoDB connection successful',
            // table: process.env.AUTH_TABLE
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            message: 'DynamoDB connection failed',
            error: error.message
        });
    }
});

// 즐겨찾기 라우터
app.use('/api/favorites', require('./routes/favorites'));

const PORT = process.env.AUTH_PORT || 5004;
app.listen(PORT, () => {
    console.log(`Favorite service running on port ${PORT}`);
    console.log('Environment variables:');
    console.log(`- PORT: ${PORT}`);
    console.log(`- AWS Region: ${process.env.AWS_REGION}`);
    // console.log(`- DynamoDB Table: ${process.env.AUTH_TABLE}`);
    console.log(`- Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;