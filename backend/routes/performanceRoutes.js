const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');


// 모든 공연 정보 가져오기
router.get('/', async (req, res) => {
    try {
        console.log('공연 정보 조회 시작');
        
        const performances = await Performance.find().lean();
        
        // 랜덤하게 5개의 공연을 선택하여 추천 공연으로 설정
        const shuffled = performances.sort(() => 0.5 - Math.random());
        const recommendedShows = shuffled.slice(0, 5);

        const result = {
            recommended: recommendedShows,
            ticketSites: [
                {
                    name: "인터파크",
                    id: "interpark",
                    shows: performances.filter(p => 
                        p.site && p.site.includes('인터파크')
                    )
                },
                {
                    name: "YES24",
                    id: "yes24",
                    shows: performances.filter(p => 
                        p.site && p.site.includes('예스24')
                    )
                },
                {
                    name: "멜론티켓",
                    id: "melon",
                    shows: performances.filter(p => 
                        p.site && p.site.includes('멜론')
                    )
                },
                {
                    name: "티켓링크",
                    id: "ticketlink",
                    shows: performances.filter(p => 
                        p.site && p.site.includes('티켓링크')
                    )
                },
                {
                    name: "기타 예매처",
                    id: "others",
                    shows: performances.filter(p => 
                        p.site && 
                        !p.site.includes('인터파크') && 
                        !p.site.includes('예스24') && 
                        !p.site.includes('멜론') && 
                        !p.site.includes('티켓링크')
                    )
                }
            ]
        };

        console.log('필터링 결과:', {
            total: performances.length,
            recommended: recommendedShows.length,
            byTicketSite: result.ticketSites.map(site => ({
                name: site.name,
                count: site.shows.length
            }))
        });

        res.json(result);

    } catch (error) {
        console.error('서버 에러 상세 정보:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            error: '서버 에러',
            message: error.message
        });
    }
});

// 단일 공연 정보 조회
router.get('/:id', async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({ message: '공연을 찾을 수 없습니다.' });
        }
        res.json(performance);
    } catch (error) {
        console.error('공연 상세 정보 조회 에러:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;