const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '192.168.0.16',
  port: 3306,
  user: 'myuser',
  password: 'welcome1!',
  database: 'ticket_system'
});

// 기본 선호도 저장 라우트
router.post('/preferences/basic', async (req, res) => {
  try {
    const { userId, gender, age, region, user_genre } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        `INSERT INTO user_preferences 
         (user_id, gender, age, region, user_genre) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         gender = ?, age = ?, region = ?, user_genre = ?`,
        [userId, gender, age, region, user_genre, 
         gender, age, region, user_genre]
      );
      
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('기본 선호도 저장 에러:', error);
    res.status(500).json({ error: '기본 정보 저장 실패' });
  }
});

// 아티스트 선호도 저장 라우트
router.post('/preferences/artists', async (req, res) => {
  try {
    const { userId, artistIds } = req.body;
    const connection = await pool.getConnection();
    
    try {
      // 선택된 아티스트의 장르 번호 가져오기
      const [artists] = await connection.query(
        'SELECT genre_number FROM artists WHERE id IN (?)',
        [artistIds]
      );
      
      // 가장 많이 선택된 장르 번호 찾기
      const artist_genre_number = findMostCommonGenre(artists);
      
      // user_preferences 업데이트
      await connection.execute(
        `UPDATE user_preferences 
         SET artist_genre_number = ?
         WHERE user_id = ?`,
        [artist_genre_number, userId]
      );
      
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('아티스트 선호도 저장 에러:', error);
    res.status(500).json({ error: '아티스트 선호도 저장 실패' });
  }
});

// 영화 선호도 저장 라우트
router.post('/preferences/movies', async (req, res) => {
  try {
    const { userId, movieIds } = req.body;
    const connection = await pool.getConnection();
    
    try {
      // 선택된 영화의 장르 번호 가져오기
      const [movies] = await connection.query(
        'SELECT genre_number FROM movies WHERE id IN (?)',
        [movieIds]
      );
      
      // 가장 많이 선택된 장르 번호 찾기
      const movie_genre_number = findMostCommonGenre(movies);
      
      // user_preferences 업데이트
      await connection.execute(
        `UPDATE user_preferences 
         SET movie_genre_number = ?
         WHERE user_id = ?`,
        [movie_genre_number, userId]
      );
      
      res.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('영화 선호도 저장 에러:', error);
    res.status(500).json({ error: '영화 선호도 저장 실패' });
  }
});

// 가장 많이 선택된 장르 번호 찾기 함수
function findMostCommonGenre(items) {
  const genreCounts = {};
  items.forEach(item => {
    genreCounts[item.genre_number] = (genreCounts[item.genre_number] || 0) + 1;
  });
  
  return Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
}

module.exports = router; 