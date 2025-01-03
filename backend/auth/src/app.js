const env = require('../shared/config/loadEnv')();
const express = require('express');
const cors = require('cors');
const Database = require('../shared/utils/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const db = new Database();

// 라우트 설정
app.use('/api/auth', authRoutes);

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: '서버 에러',
    message: err.message
  });
});

// 공통 환경변수에서 PORT 가져오기
const PORT = env.AUTH_PORT || 5002;
app.listen(PORT, () => {
  console.log(`Auth 서비스가 ${PORT} 포트에서 실행 중입니다.`);
});

module.exports = app;
