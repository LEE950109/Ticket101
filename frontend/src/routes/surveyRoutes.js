const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '192.168.0.11',
  port: 3306,
  user: 'myuser',
  password: 'welcome1!',
  database: 'ticket_system'
});

// 1. 기본 정보 저장 (성별, 나이, 지역)
router.post('/preferences/basic', async (req, res) => {
  try {
    const { userId, gender, age, region } = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      'INSERT INTO user_preferences (user_id, gender, age, region) VALUES (?, ?, ?, ?)',
      [userId, gender, age, region]
    );
    
    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '기본 정보 저장 실패' });
  }
});

// 2. 장르 선호도 저장
router.post('/preferences/genre', async (req, res) => {
  try {
    const { userId, genres } = req.body;
    const connection = await pool.getConnection();
    
    // 기존 선호도 삭제
    await connection.execute(
      'DELETE FROM user_genre_preferences WHERE user_id = ?',
      [userId]
    );
    
    // 새로운 선호도 추가
    for (const genre of genres) {
      await connection.execute(
        'INSERT INTO user_genre_preferences (user_id, genre_type) VALUES (?, ?)',
        [userId, genre]
      );
    }
    
    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '장르 선호도 저장 실패' });
  }
});

// 3. 아티스트 검색
router.get('/artists/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('검색 쿼리:', query);

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM artists WHERE name LIKE ? LIMIT 10',
      [`%${query}%`]
    );
    
    console.log('검색 결과:', rows);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('아티스트 검색 오류:', error);
    res.status(500).json({ error: '아티스트 검색 실패' });
  }
});

// 4. 아티스트 선호도 저장
router.post('/preferences/artists', async (req, res) => {
  try {
    const { userId, artistIds } = req.body;
    const connection = await pool.getConnection();
    
    // 기존 선호도 삭제
    await connection.execute(
      'DELETE FROM user_artist_preferences WHERE user_id = ?',
      [userId]
    );
    
    // 새로운 선호도 추가
    for (const artistId of artistIds) {
      await connection.execute(
        'INSERT INTO user_artist_preferences (user_id, artist_id) VALUES (?, ?)',
        [userId, artistId]
      );
    }
    
    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '아티스트 선호도 저장 실패' });
  }
});

module.exports = router; 