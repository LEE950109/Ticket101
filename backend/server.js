const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const surveyRoutes = require('./routes/surveyRoutes');
const app = express();

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// DB 연결 설정
const db = mysql.createConnection({
  host: '192.168.0.11',
  user: 'myuser',
  password: 'welcome1!',
  database: 'ticket_system',
  port: 3306
}).promise();

// DB 연결 테스트
db.connect()
  .then(() => console.log('MySQL DB 연결 성공'))
  .catch((err) => console.error('MySQL DB 연결 실패:', err));

// 라우트 설정
console.log('surveyRoutes 로드됨:', !!surveyRoutes);
const authRoutes = require('./routes/authRoutes');

app.use('/api/survey', surveyRoutes);
app.use('/api/auth', authRoutes);

// 404 에러 핸들러
app.use((req, res) => {
  console.log('404 에러:', req.method, req.url);
  res.status(404).json({ 
    message: '요청하신 경로를 찾을 수 없습니다.',
    path: req.url,
    method: req.method
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 에러:', err);
  res.status(500).json({ 
    message: '서버 에러가 발생했습니다.',
    error: err.message 
  });
});

// 서버 시작
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
  console.log('등록된 라우트:', app._router.stack
    .filter(r => r.route)
    .map(r => `${Object.keys(r.route.methods)} ${r.route.path}`));
});
module.exports = app;

