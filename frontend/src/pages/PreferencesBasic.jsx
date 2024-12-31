import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

const PreferencesBasic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    region: ''
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
          region: formData.region
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
            region: formData.region
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-[#40E0D0] text-center mb-12">Ticket 101</h1>
        <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-8 text-white text-center">기본 정보 입력</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">성별</label>
              <select 
                className="w-full p-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#40E0D0]"
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

            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">나이</label>
              <input
                type="number"
                className="w-full p-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#40E0D0]"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                required
                min="1"
                max="120"
                placeholder="나이를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">지역</label>
              <select
                className="w-full p-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#40E0D0]"
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

            <button
              type="submit"
              className="w-full bg-[#40E0D0] text-black py-3 rounded-lg font-bold
                       hover:bg-[#3bcdc1] transition duration-200 ease-in-out mt-8"
            >
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreferencesBasic; 