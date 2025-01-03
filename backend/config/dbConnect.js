const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'ticket101'
        });
        
        console.log("MongoDB Connected:");
        console.log(`Host: ${connect.connection.host}`);
        console.log(`Database: ${connect.connection.name}`);
    } catch (error) {
        console.error("MongoDB 연결 실패:", error.message);
        process.exit(1);
    }

    mongoose.connection.on('error', err => {
        console.error('MongoDB 연결 에러:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB 연결이 끊어졌습니다. 재연결 시도합니다.');
        dbConnect();
    });
}

module.exports = dbConnect;