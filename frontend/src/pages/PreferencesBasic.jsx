import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import { usePreferences } from '../context/PreferencesContext';

const PreferencesBasic = () => {
  const navigate = useNavigate();
  const { updateBasicPreferences } = usePreferences();
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    region: '',
    user_genre: ''
  });
  const [error, setError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 데이터 검증
    if (!formData.gender || !formData.age || !formData.region || !formData.user_genre) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    console.log('기본 정보 저장:', formData); // 로깅 추가
    updateBasicPreferences(formData);
    navigate('/preferences/artists');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('업데이트된 formData:', newData);
      return newData;
    });
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
              value={formData.user_genre}
              onChange={(e) => setFormData({...formData, user_genre: e.target.value})}
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