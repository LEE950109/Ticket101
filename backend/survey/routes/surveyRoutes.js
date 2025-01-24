const express = require('express');
const router = express.Router();
const Database = require('../utils/database');
const db = new Database();

  // 기본 선호도 저장 라우트
  router.post('/preferences/basic', async (req, res) => {
    try {
      const { userId, gender, age, city, user_genre } = req.body;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: '유효한 userId가 필요합니다.' });
      }
      if (!gender || !['male', 'female', 'other'].includes(gender)) {
        return res.status(400).json({ error: 'gender는 male, female, other 중 하나여야 합니다.' });
      }
  
      if (!age || typeof age !== 'number' || age <= 0) {
        return res.status(400).json({ error: '유효한 나이를 입력하세요.' });
      }
  
      if (!city || typeof city !== 'string') {
        return res.status(400).json({ error: '유효한 city를 입력하세요.' });
      }
  
      if (!user_genre || typeof user_genre !== 'string') {
        return res.status(400).json({ error: 'user_genre는 문자열이어야 합니다.' });
      }
  


      if (!userId || !gender || !age || !city || !user_genre) {
        return res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
      }

      const preferences = { userId, gender, age, city, user_genre };
      await db.savePreferences(preferences);

      res.status(200).json({
        success: true,
        message: '기본 정보가 저장되었습니다.',
      });
    } catch (error) {
      console.error('Error saving basic preferences:', error);
      res.status(500).json({ error: '서버 에러', message: error.message });
    }
  });

  // 아티스트 선호도 저장 라우트
  router.post('/preferences/artists', async (req, res) => {
    try {
      const { userId, preferences } = req.body;

      if (!userId || !Array.isArray(preferences)) {
        return res.status(400).json({ error: '잘못된 요청 형식입니다.' });
      }

      const artistGenres = preferences.map((p) => p.artist_num).join(',');
      await db.savePreferences({ userId, artistGenres });

      res.status(200).json({
        success: true,
        message: '아티스트 장르 선호도가 저장되었습니다.',
      });
    } catch (error) {
      console.error('Error saving artist preferences:', error);
      res.status(500).json({ error: '서버 에러', message: error.message });
    }
  });

  // 영화 선호도 저장 라우트
  router.post('/preferences/movies', async (req, res) => {
    try {
      const { userId, preferences } = req.body;

      if (!userId || !Array.isArray(preferences)) {
        return res.status(400).json({ error: '잘못된 요청 형식입니다.' });
      }

      const movieGenres = preferences.map((p) => p.genre_num).join(',');
      await db.savePreferences({ userId, movieGenres });

      res.status(200).json({
        success: true,
        message: '영화 장르 선호도가 저장되었습니다.',
      });
    } catch (error) {
      console.error('Error saving movie preferences:', error);
      res.status(500).json({ error: '서버 에러', message: error.message });
    }
  });

  // 아티스트 검색 API
  router.get('/artists/search', async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || query.length < 2) {
        return res.status(400).json({ error: '검색어는 2글자 이상이어야 합니다.' });
      }

      const results = await db.searchArtists(query);
      res.json(results || []);
    } catch (error) {
      console.error('Error searching artists:', error);
      res.status(500).json({ error: '검색 중 오류가 발생했습니다.', message: error.message });
    }
  });

  // 영화 검색 API
  router.get('/movies/search', async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || query.length < 2) {
        return res.status(400).json({ error: '검색어는 2글자 이상이어야 합니다.' });
      }

      const results = await db.searchMovies(query);
      res.json(results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ error: '검색 중 오류가 발생했습니다.', message: error.message });
    }
  });

  // 모든 선호도 저장 라우트
  router.post('/preferences', async (req, res) => {
    console.log('요청 데이터:', req.body);
    try {
      const {
        userId,
        gender,
        age,
        city,
        user_genre,
        artist_genre_number,
        movie_genre_number,
      } = req.body;


      const preferences = {
        userId,
        gender,
        age,
        city,
        user_genre,
        artist_genre_number,
        movie_genre_number,
      };

      await db.savePreferences(preferences);

      res.status(200).json({
        success: true,
        message: '모든 선호도가 저장되었습니다.',
      });
    } catch (error) {
      console.error('Error saving all preferences:', error);
      res.status(500).json({ error: '서버 에러', message: error.message });
    }
  });
  module.exports = router;
