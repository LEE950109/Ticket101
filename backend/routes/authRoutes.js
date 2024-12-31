const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// DB 연결 설정
const db = mysql.createConnection({
  host: '192.168.0.11',
  user: 'myuser',
  password: 'welcome1!',
  database: 'ticket_system',
  port: 3306
}).promise();

// 회원가입 라우트
router.post('/register', async (req, res) => {
  try {
    const { email, cognitoId } = req.body;
    console.log('회원가입 요청:', { email, cognitoId });

    // 이메일 중복 체크
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 새 사용자 등록
    const [result] = await db.query(
      'INSERT INTO users (email, cognito_id) VALUES (?, ?)',
      [email, cognitoId]
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      userId: result.insertId
    });

  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ message: '회원가입에 실패했습니다.' });
  }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('로그인 요청:', { email });

    // 사용자 조회
    const [users] = await db.query(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      message: '로그인 성공',
      userId: users[0].id
    });

  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '로그인에 실패했습니다.' });
  }
});

module.exports = router; 