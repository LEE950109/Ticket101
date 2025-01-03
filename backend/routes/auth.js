const express = require('express');
const router = express.Router();

// 회원가입 라우트
router.post('/register', async (req, res) => {
  try {
    const { email, cognitoId } = req.body;
    console.log('1. 받은 데이터:', { email, cognitoId });

    const db = req.db;
    console.log('3. DB 연결 확인:', !!db);

    // 먼저 users 테이블 구조 확인
    const [columns] = await db.promise().query('DESCRIBE users');
    console.log('테이블 구조:', columns);

    // 이미 등록된 이메일인지 확인
    const [existingUsers] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    console.log('4. 기존 사용자 조회 결과:', existingUsers);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // cognito_id 컬럼 타입 확인 후 INSERT
    console.log('5. INSERT 시도:', { email, cognitoId });
    const [result] = await db.promise().query(
      'INSERT INTO users (email, cognito_id) VALUES (?, ?)',
      [email, cognitoId.toString()]  // cognitoId를 문자열로 변환
    );
    console.log('6. INSERT 결과:', result);

    res.status(201).json({
      message: '회원가입 성공',
      userId: result.insertId
    });

  } catch (error) {
    console.error('상세 에러 정보:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const db = req.db;

    // 사용자 조회
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: '등록되지 않은 사용자입니다.' });
    }

    const user = users[0];

    // 로그인 성공
    res.json({
      userId: user.id,
      message: '로그인 성공'
    });

  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 