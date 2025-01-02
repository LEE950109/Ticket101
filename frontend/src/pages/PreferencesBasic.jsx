import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

const PreferencesBasic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    region: '',
    genre: ''
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      const userId = localStorage.getItem('userId');
      
      if (!user || !userId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      
      console.log('현재 로그인된 사용자:', user);
      console.log('localStorage userId:', userId);
    } catch (error) {
      console.error('인증 확인 에러:', error);
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };

  const regions = [
    "서울", "경기", "인천", "강원", "충북", "충남", "대전", "세종", 
    "전북", "전남", "광주", "경북", "경남", "대구", "울산", "부산", "제주"
  ];

  const genres = [
    "뮤지컬",
    "콘서트",
    "클래식",
    "국악"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      }

      console.log('저장할 데이터:', {
        userId,
        preferences: {
          gender: formData.gender,
          age: formData.age,
          region: formData.region,
          genre: formData.genre
        }
      });

      const response = await fetch('http://localhost:5002/api/survey/preferences/basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          preferences: {
            gender: formData.gender,
            age: parseInt(formData.age),
            region: formData.region,
            genre: formData.genre
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '선호도 저장에 실패했습니다.');
      }

      navigate('/preferences/artists');
    } catch (error) {
      console.error('선호도 저장 에러 상세:', error);
      if (error.message.includes('사용자 정보를 찾을 수 없습니다')) {
        navigate('/login');
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="preferences-basic">
      <div className="preferences-basic__inner">
        <h1>맞춤 공연 설문 조사</h1>
        <h2>더 정확한 공연 추천을 위해<br/>
        간단한 정보를 입력해주세요</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>성별</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">선택해주세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div className="form-group">
            <label>나이</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
              min="1"
              max="120"
              placeholder="나이를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>지역</label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              required
            >
              <option value="">선택해주세요</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>선호 장르</label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
              required
            >
              <option value="">선택해주세요</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <button type="submit">다음</button>
        </form>
      </div>
    </div>
  );
};

export default PreferencesBasic; 