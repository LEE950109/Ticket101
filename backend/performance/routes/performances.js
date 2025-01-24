const express = require('express');
const router = express.Router();
const Database = require('../utils/database');
const db = new Database();

const Database2 = require('../utils/database2');
const db2 = new Database2();

// 모든 공연 정보 가져오기
router.get('/', async (req, res) => {
    try {
        console.log('공연 정보 조회 시작');
        
        const today = new Date().toISOString().split('T')[0];
        const limit = 30;  // 각 장르별 최대 공연 수
        
        const performances = await db.getAllPerformances();

        // 현재 진행 중이거나 예정된 공연 필터링
        const filteredPerformances = performances
            .filter(show => 
                show.end_date !== "오픈런" && 
                show.end_date >= today
            )
            .sort((a, b) => {
                const diffA = Math.abs(new Date(a.start_date) - new Date(today));
                const diffB = Math.abs(new Date(b.start_date) - new Date(today));
                return diffA - diffB;
            });

        // 장르별로 분류하고 각각 30개로 제한
        const categorizedResult = {
            musical: filteredPerformances
                .filter(p => p.genre === "뮤지컬")
                .slice(0, limit),
            popular: filteredPerformances
                .filter(p => p.genre === "대중음악")
                .slice(0, limit),
            korean: filteredPerformances
                .filter(p => p.genre === "한국음악(국악)")
                .slice(0, limit),
            classical: filteredPerformances
                .filter(p => p.genre === "서양음악(클래식)")
                .slice(0, limit)
        };

        res.json(categorizedResult);
    } catch (error) {
        console.error('서버 에러:', error);
        res.status(500).json({ 
            error: '서버 에러',
            message: error.message 
        });
    }
});

// 단일 공연 정보 조회
router.get('/:id', async (req, res) => {
    try {
        const performance = await db.getPerformanceById(req.params.id);

        if (!performance) {
            return res.status(404).json({ message: '공연을 찾을 수 없습니다.' });
        }

        res.json(performance);
    } catch (error) {
        console.error('공연 상세 정보 조회 에러:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/recommend/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const params = {
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };
        const result = await db2.queryItems(params);
        
        if (!result || !result.Items) {
            console.error('DynamoDB 쿼리 결과가 비어 있습니다:', result);
            return res.status(404).json({ error: '추천 데이터를 찾을 수 없습니다.' });
        }

        const recommendations = result.Items.map(item => item.performance_id); // 중첩된 리스트를 평탄화
        
        if (!Array.isArray(recommendations) || recommendations.length === 0) {
            return res.status(400).json({ error: 'recommend 필드가 유효하지 않습니다. 배열 형태여야 합니다.' });
          }
          
        // DynamoDB에서 recommend ID에 해당하는 공연 정보 조회
        const performanceDetails = await Promise.all(
            recommendations.map(async (id) => {
            try {
                return await db.getPerformanceById(id);
            } catch (error) {
                console.error(`Performance ID ${id} 조회 실패:`, error);
                return null; // 실패한 ID는 null로 반환
            }
            })
        );
        const validDetails = performanceDetails.filter((detail) => detail !== null);
        res.json(validDetails);

    } catch (error) {
        console.error('데이터 조회 실패:', error);
        res.status(500).json({ error: '서버 에러', details: error.message });
    }
});

router.post('/performances/details', async (req, res) => {
    const { recommend } = req.body;
  
    if (!Array.isArray(recommend) || recommend.length === 0) {
      return res.status(400).json({ error: 'recommend 필드가 유효하지 않습니다. 배열 형태여야 합니다.' });
    }
  
    try {
      // DynamoDB에서 recommend ID에 해당하는 공연 정보 조회
      const performanceDetails = await Promise.all(
        recommend.map(async (id) => {
          try {
            return await db.getPerformanceById(id);
          } catch (error) {
            console.error(`Performance ID ${id} 조회 실패:`, error);
            return null; // 실패한 ID는 null로 반환
          }
        })
      );
  
      // 유효한 데이터만 반환
      const validDetails = performanceDetails.filter((detail) => detail !== null);
  
      res.json(validDetails);
    } catch (error) {
      console.error('공연 정보 조회 중 에러 발생:', error);
      res.status(500).json({ error: '서버 에러', details: error.message });
    }
  });

  
module.exports = router;