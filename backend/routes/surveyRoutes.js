const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

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
    // 요청 데이터 로깅
    console.log('받은 데이터:', req.body);
    
    const { userId, gender, age, region, user_genre } = req.body;
    
    // 데이터 검증
    if (!userId || !gender || !age || !region || !user_genre) {
      console.log('누락된 데이터:', {
        userId: !userId,
        gender: !gender,
        age: !age,
        region: !region,
        user_genre: !user_genre
      });
      return res.status(400).json({
        error: '필수 데이터 누락',
        message: '모든 필드를 입력해주세요.',
        received: req.body
      });
    }

    const connection = await db.getConnection();
    
    try {
      // 쿼리 실행
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
      console.log('실행할 쿼리:', query);
      console.log('쿼리 파라미터:', params);

      const [result] = await connection.execute(query, params);
      console.log('쿼리 실행 결과:', result);

      return res.status(200).json({
        success: true,
        message: '기본 정보가 저장되었습니다.',
        data: {
          userId,
          gender,
          age,
          region,
          user_genre
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('서버 에러:', error);
    return res.status(500).json({
      error: '서버 에러',
      message: error.message,
      stack: error.stack
    });
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

    // 선택된 아티스트들의 장르 번호를 하나의 값으로 저장
    const genreNumbers = preferences.map(p => p.genre_number);
    console.log('저장할 장르 번호들:', genreNumbers);

    // 직접 db.query 사용
    const query = `
      INSERT INTO user_preferences 
      (user_id, artist_genre_number) 
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      artist_genre_number = VALUES(artist_genre_number)
    `;

    const [result] = await db.query(query, [userId, genreNumbers.join(',')]);
    
    return res.status(200).json({
      success: true,
      message: '아티스트 장르 선호도가 저장되었습니다.'
    });

  } catch (error) {
    console.error('아티스트 선호도 저장 에러:', error);
    return res.status(500).json({ 
      error: '선호도 저장에 실패했습니다.',
      message: error.message 
    });
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
    const { query } = req.query;
    console.log('검색어:', query);

    if (!query || query.length < 2) {
      return res.status(400).json({
        error: '검색어는 2글자 이상이어야 합니다.'
      });
    }

    // 직접 db.query 사용 (getConnection 대신)
    const [results] = await db.query(
      'SELECT id, artist_name, genre, genre_number FROM artists WHERE artist_name LIKE ?',
      [`%${query}%`]
    );
    
    console.log('검색 결과:', results);
    return res.json(results || []);

  } catch (error) {
    console.error('아티스트 검색 상세 에러:', error);
    return res.status(500).json({ 
      error: '검색 중 오류가 발생했습니다.',
      message: error.message
    });
  }
});

// 영화 검색 API
router.get('/movies/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('영화 검색어:', query);

    if (!query || query.length < 2) {
      return res.status(400).json({
        error: '검색어는 2글자 이상이어야 합니다.'
      });
    }

    // 직접 db.query 사용 (getConnection 대신)
    const [results] = await db.query(
      'SELECT id, title, genre, genre_number FROM movies WHERE title LIKE ?',
      [`%${query}%`]
    );
    
    console.log('영화 검색 결과:', results);
    return res.json(results || []);

  } catch (error) {
    console.error('영화 검색 에러:', error);
    return res.status(500).json({ 
      error: '검색 중 오류가 발생했습니다.',
      message: error.message 
    });
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

// 모든 선호도 저장 라우트 추가
router.post('/preferences', async (req, res) => {
  try {
    const { 
      userId, 
      gender, 
      age, 
      region, 
      user_genre,
      artist_genre_number,
      movie_genre_number 
    } = req.body;

    console.log('받은 데이터:', req.body);

    // 데이터 검증
    if (!userId) {
      return res.status(400).json({
        error: '사용자 ID가 필요합니다.',
        received: req.body
      });
    }

    // 장르 번호 처리
    const processGenreNumbers = (numbers) => {
      if (!numbers) return null;
      // 배열인 경우 처리
      if (Array.isArray(numbers)) {
        return numbers.join(',');
      }
      // 이미 문자열인 경우
      return numbers;
    };

    // SQL 쿼리
    const query = `
      INSERT INTO user_preferences 
      (user_id, gender, age, region, user_genre, artist_genre_number, movie_genre_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      gender = VALUES(gender),
      age = VALUES(age),
      region = VALUES(region),
      user_genre = VALUES(user_genre),
      artist_genre_number = VALUES(artist_genre_number),
      movie_genre_number = VALUES(movie_genre_number)
    `;

    // 값 변환 및 NULL 처리
    const values = [
      userId,
      gender || null,
      age ? parseInt(age) : null,
      region || null,
      user_genre || null,
      processGenreNumbers(artist_genre_number),
      processGenreNumbers(movie_genre_number)
    ];

    console.log('실행할 쿼리 값:', values);

    const [result] = await db.query(query, values);
    console.log('저장 결과:', result);

    return res.json({
      success: true,
      message: '선호도가 저장되었습니다.',
      data: result
    });

  } catch (error) {
    console.error('선호도 저장 상세 에러:', error);
    return res.status(500).json({
      error: '선호도 저장에 실패했습니다.',
      message: error.message,
      details: error.stack
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
          // 기존 데이터 삭제 (선택사항)
          await db.query('TRUNCATE TABLE performances');

          // 데이터 삽입 쿼리
          const query = `
            INSERT INTO performances 
            (image_url, name, region, performance_time, location, age_limit, price, reservation_site, link)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          // 각 행을 데이터베이스에 삽입
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
          console.error('데이터베이스 삽입 에러:', error);
          res.status(500).json({
            error: '데이터베이스 삽입 중 오류가 발생했습니다.',
            details: error.message
          });
        }
      });
  } catch (error) {
    console.error('CSV 파일 처리 에러:', error);
    res.status(500).json({
      error: 'CSV 파일 처리 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

module.exports = router; 