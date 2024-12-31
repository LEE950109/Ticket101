const express = require('express');
const cors = require('cors');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 라우트 연결 전에 요청 로깅
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API 라우트 설정
app.use('/api/survey', surveyRoutes);

// 404 에러 핸들러
app.use((req, res, next) => {
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

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
  console.log('등록된 라우트:', app._router.stack.filter(r => r.route).map(r => `${Object.keys(r.route.methods)} ${r.route.path}`));
});

module.exports = app; 