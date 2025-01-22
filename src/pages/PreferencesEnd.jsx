import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PreferencesThanks = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="preferences-basic">
            <div className="preferences-basic__inner">
                <h1>설문조사 완료</h1>
                <h2>
                    맞춤 공연 추천을 위한<br/>
                    소중한 정보 감사합니다
                </h2>
                <div className="loading-wrapper">
                    <div className="loading-spinner"></div>
                    <p>잠시 후 로그인 페이지로 이동합니다...</p>
                </div>
            </div>
        </div>
    );
};

export default PreferencesThanks;