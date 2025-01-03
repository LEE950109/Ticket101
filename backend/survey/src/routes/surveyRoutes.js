const express = require('express');
const router = express.Router();
const db = require('../../shared/utils/database');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// 기본 선호도 저장 라우트
router.post('/preferences/basic', async (req, res) => {
  try {
    const { userId, gender, age, region, user_genre } = req.body;

    // 필수 데이터 검증
    if (!userId || !gender || !age || !region || !user_genre) {
      return res.status(400).json({
        error: '필수 데이터 누락',
        message: '모든 필드를 입력해주세요.'
      });
    }

    const query = `
      INSERT INTO user_preferences 
      (user_id, gender, age, region, user_genre) 
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      gender = VALUES(gender),
      age = VALUES(age),
      region = VALUES(region),
      user_genre = VALUES(user_genre)
    `;

    const params = [userId, gender, age, region, user_genre];
    const result = await db.query(query, params);

    res.status(200).json({
      success: true,
      message: '기본 정보가 저장되었습니다.',
      data: result
    });
  } catch (error) {
    console.error('기본 선호도 저장 에러:', error);
    res.status(500).json({
      error: '서버 에러',
      message: error.message
    });
  }
});

// 공통 데이터 저장 함수
const validateAndSavePreferences = async (userId, preferences, tableName, column) => {
  if (!userId || !Array.isArray(preferences)) {
    throw new Error('잘못된 요청 형식');
  }

  await db.beginTransaction();

  try {
    // 기존 데이터 삭제
    await db.query(`DELETE FROM ${tableName} WHERE user_id = ?`, [userId]);

    // 새로운 데이터 삽입
    for (const pref of preferences) {
      await db.query(`INSERT INTO ${tableName} (user_id, ${column}) VALUES (?, ?)`, [
        userId,
        pref
      ]);
    }

    await db.commit();
    return { success: true };
  } catch (error) {
    await db.rollback();
    throw error;
  }
};

// 아티스트 선호도 저장 라우트
router.post('/preferences/artists', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const genreNumbers = preferences.map(p => p.genre_number);
    const result = await validateAndSavePreferences(userId, genreNumbers, 'user_artist_preferences', 'artist_genre_number');
    res.status(200).json(result);
  } catch (error) {
    console.error('아티스트 선호도 저장 에러:', error);
    res.status(500).json({
      error: '서버 에러',
      message: error.message
    });
  }
});

// 영화 선호도 저장 라우트
router.post('/preferences/movies', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const movieIds = preferences.map(pref => pref.movieId);
    const result = await validateAndSavePreferences(userId, movieIds, 'user_movie_preferences', 'movie_id');
    res.status(200).json(result);
  } catch (error) {
    console.error('영화 선호도 저장 에러:', error);
    res.status(500).json({
      error: '서버 에러',
      message: error.message
    });
  }
});

// 아티스트 검색 API
router.get('/artists/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        error: '검색어는 2글자 이상이어야 합니다.'
      });
    }

    const results = await db.query(
      'SELECT id, artist_name, genre, genre_number FROM artists WHERE artist_name LIKE ?',
      [`%${query}%`]
    );

    res.json(results || []);
  } catch (error) {
    console.error('아티스트 검색 에러:', error);
    res.status(500).json({
      error: '검색 중 오류가 발생했습니다.',
      message: error.message
    });
  }
});

// 영화 검색 API
router.get('/movies/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        error: '검색어는 2글자 이상이어야 합니다.'
      });
    }

    const results = await db.query(
      'SELECT id, title, genre, genre_number FROM movies WHERE title LIKE ?',
      [`%${query}%`]
    );

    res.json(results || []);
  } catch (error) {
    console.error('영화 검색 에러:', error);
    res.status(500).json({
      error: '검색 중 오류가 발생했습니다.',
      message: error.message
    });
  }
});

// CSV 파일 업로드 라우트
router.post('/upload-csv', async (req, res) => {
  try {
    const results = [];
    const csvPath = path.join(__dirname, '../../frontend/src/Data/cc.csv');

    // CSV 파일 읽기
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // 빈 컬럼 제거 및 데이터 정제
        delete data[''];
        results.push(data);
      })
      .on('end', async () => {
        try {
          await db.query('TRUNCATE TABLE performances');

          const query = `
            INSERT INTO performances 
            (image_url, name, region, performance_time, location, age_limit, price, reservation_site, link)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          for (const row of results) {
            await db.query(query, [
              row.image_url,
              row.name,
              row.region,
              row.time,
              row.location,
              row.age_limit,
              row.price,
              row.reservation_site,
              row.link
            ]);
          }

          res.json({
            success: true,
            message: 'CSV 파일이 성공적으로 업로드되었습니다.',
            count: results.length
          });
        } catch (error) {
          console.error('CSV 데이터 삽입 에러:', error);
          res.status(500).json({
            error: 'CSV 데이터 삽입 중 오류가 발생했습니다.',
            details: error.message
          });
        }
      });
  } catch (error) {
    console.error('CSV 처리 에러:', error);
    res.status(500).json({
      error: 'CSV 처리 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

module.exports = router;
