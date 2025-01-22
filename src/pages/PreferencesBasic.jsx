import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { getCurrentUser } from 'aws-amplify/auth';
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from 'aws-amplify/auth';



const PreferencesBasic = () => {


  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    city: '',
    user_genre: ''
  });
  
  // const { user } = useAuth();
  // const userId = user?.sub; // user가 null이 아닌 경우에만 sub를 가져옴
  const { user } = getCurrentUser()
  const userId = user?.sub; // user가 null이 아닐 때만 sub 접근

  const navigate = useNavigate();
  const { updateBasicPreferences } = usePreferences();

  const [error, setError] = useState('');

 const citys = [
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
    console.log('userId 확인:', userId);
    
    // 데이터 검증
    if (!formData.gender || !formData.age || !formData.city || !formData.user_genre) {
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
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            >
              <option value="">선택해주세요</option>
              {citys.map(city => (
                <option key={city} value={city}>{city}</option>
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