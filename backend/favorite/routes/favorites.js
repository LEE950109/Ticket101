const express = require('express');
const router = express.Router();
const Database = require('../utils/database');
const db = new Database();

// 즐겨찾기 목록 가져오기
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const params = {
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await db.queryItems(params);
        res.json(result.Items || []);
    } catch (error) {
        console.error('즐겨찾기 조회 실패:', error);
        res.status(500).json({ error: '서버 에러', details: error.message });
    }
});

// 즐겨찾기 추가
router.post('/:userId', async (req, res) => {
    try {
        const {
            performance_id,
            image,
            title,
            start_date,
            end_date
        } = req.body;

        const item = {
            userId: req.params.userId,
            performance_id,
            image,
            title,
            start_date,
            end_date
        };

        await db.addFavorite(item);
        res.json(item);
    } catch (error) {
        console.error('즐겨찾기 추가 실패:', error);
        res.status(500).json({ error: '서버 에러', details: error.message });
    }
});

// 즐겨찾기 삭제
router.delete('/:userId/:performance_id', async (req, res) => {
    try {
        const { userId, performance_id } = req.params;
        await db.deleteFavorite(userId, performance_id);
        res.json({ message: '성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('즐겨찾기 삭제 실패:', error);
        res.status(500).json({
            error: '서버 에러',
            details: error.message
        });
    }
});

module.exports = router;