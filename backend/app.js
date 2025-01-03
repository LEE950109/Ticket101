const express = require('express');
const cors = require('cors');
const app = express();
const dbConnect = require('./config/dbConnect');

dbConnect(); // 몽고디비 연결

// CORS 설정 단순화
app.use(cors());

// body-parser 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// 라우트 설정
app.use('/api/survey', require('./routes/surveyRoutes')); //mysql 설문조사 라우트
app.use('/api/performances', require('./routes/performanceRoutes')); //몽고디비 공연정보 라우트

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: '서버 에러',
    message: err.message
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 