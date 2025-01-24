const express = require('express');
const router = express.Router();
const Database = require('../utils/database');
const db = new Database();

router.get('/', async (req, res) => {
    try {
        const { query } = req.query;
        console.log('검색 요청:', { query });
        
        if (!query) {
            return res.status(400).json({ 
                success: false,
                message: '검색어를 입력해주세요.' 
            });
        }

        const searchResults = await db.searchPerformances(query);

        // 장르별로 분류
        const categorizedResults = {
            musical: searchResults.filter(item => item.genre === '뮤지컬'),
            popular: searchResults.filter(item => item.genre === '대중음악'),
            korean: searchResults.filter(item => item.genre === '한국음악(국악)'),
            classical: searchResults.filter(item => item.genre === '서양음악(클래식)')
        };

        console.log('검색 결과:', {
            total: searchResults.length
        });

        res.json({
            success: true,
            categorizedResults
        });

    } catch (error) {
        console.error('검색 처리 중 에러:', error);
        res.status(500).json({ 
            success: false,
            message: '검색 처리 중 오류가 발생했습니다.',
            error: error.message 
        });
    }
});

module.exports = router;