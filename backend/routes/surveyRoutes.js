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

// 기본 선호도 저장 라우트
router.post('/preferences/basic', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    console.log('기본 선호도 저장 요청:', { userId, preferences });

    if (!userId || !preferences || !preferences.gender || !preferences.age || !preferences.region) {
      return res.status(400).json({ 
        message: '필수 데이터가 누락되었습니다.',
        received: { userId, preferences }
      });
    }

    // 트랜잭션 시작
    await db.beginTransaction();

    try {
      // 기존 선호도 삭제
      await db.query('DELETE FROM user_preferences WHERE user_id = ?', [userId]);
      
      // 새로운 선호도 저장
      const [result] = await db.query(
        'INSERT INTO user_preferences (user_id, gender, age, region) VALUES (?, ?, ?, ?)',
        [userId, preferences.gender, preferences.age, preferences.region]
      );

      // 트랜잭션 커밋
      await db.commit();
      res.json({ message: '기본 선호도가 저장되었습니다.' });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('기본 선호도 저장 에러:', error);
    res.status(500).json({ message: '선호도 저장에 실패했습니다.' });
  }
});

// 아티스트 선호도 저장 라우트
router.post('/preferences/artists', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    console.log('아티스트 선호도 저장 요청:', { userId, preferences });
    
    if (!userId || !Array.isArray(preferences)) {
      return res.status(400).json({ 
        message: '잘못된 요청 형식입니다.',
        received: { userId, preferences }
      });
    }

    // 트랜잭션 시작
    await db.beginTransaction();

    try {
      // 기존 선호도 삭제
      await db.query('DELETE FROM user_artist_preferences WHERE user_id = ?', [userId]);
      
      // 새로운 선호도 저장
      for (const pref of preferences) {
        if (!pref.artistId) {
          throw new Error('아티스트 ID가 누락되었습니다.');
        }
        
        await db.query(
          'INSERT INTO user_artist_preferences (user_id, artist_id) VALUES (?, ?)',
          [userId, pref.artistId]
        );
      }

      // 트랜잭션 커밋
      await db.commit();
      res.json({ message: '아티스트 선호도가 저장되었습니다.' });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('아티스트 선호도 저장 에러:', error);
    res.status(500).json({ message: '선호도 저장에 실패했습니다.' });
  }
});

// 영화 선호도 저장 라우트
router.post('/preferences/movies', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    console.log('영화 선호도 저장 요청:', { userId, preferences });

    if (!userId || !Array.isArray(preferences)) {
      return res.status(400).json({ 
        message: '잘못된 요청 형식입니다.',
        received: { userId, preferences }
      });
    }

    // 트랜잭션 시작
    await db.beginTransaction();

    try {
      // 기존 선호도 삭제
      await db.query('DELETE FROM user_movie_preferences WHERE user_id = ?', [userId]);
      
      // 새로운 선호도 저장
      for (const pref of preferences) {
        if (!pref.movieId) {
          throw new Error('영화 ID가 누락되었습니다.');
        }

        await db.query(
          'INSERT INTO user_movie_preferences (user_id, movie_id) VALUES (?, ?)',
          [userId, pref.movieId]
        );
      }

      // 트랜잭션 커밋
      await db.commit();
      res.json({ message: '영화 선호도가 저장되었습니다.' });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('영화 선호도 저장 에러:', error);
    res.status(500).json({ message: '선호도 저장에 실패했습니다.' });
  }
});

// 아티스트 검색 API
router.get('/artists/search', async (req, res) => {
  try {
    const query = req.query.query;
    const [results] = await db.query(
      'SELECT id, name, genre FROM artists WHERE name LIKE ?',
      [`%${query}%`]
    );
    res.json(results);
  } catch (error) {
    console.error('아티스트 검색 오류:', error);
    res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
  }
});

// 영화 검색 API
router.get('/movies/search', async (req, res) => {
  try {
    const query = req.query.query;
    const [results] = await db.query(
      'SELECT id, title, genre FROM movies WHERE title LIKE ?',
      [`%${query}%`]
    );
    res.json(results);
  } catch (error) {
    console.error('영화 검색 오류:', error);
    res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
  }
});

// 회원가입 라우트
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

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
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, password, name]
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

module.exports = router; 