import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PreferencesMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 영화 검색 함수
  const searchMovies = async (query) => {
    try {
      const response = await fetch(`http://localhost:5002/api/survey/movies/search?query=${query}`);
      
      if (!response.ok) {
        throw new Error('검색 실패');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('영화 검색 오류:', error);
      return [];
    }
  };

  // 검색어 변경 시 호출되는 함수
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      handleSearch(e);
    } else {
      setSearchResults([]);
    }
  };

  // 검색 결과 처리 함수
  const handleSearch = async (e) => {
    const query = e.target.value;
    if (query.length > 0) {
      const results = await searchMovies(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // 영화 선택 함수
  const handleMovieSelect = (movie) => {
    if (!selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // 선택된 영화 제거 함수
  const handleMovieRemove = (movieId) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
  };

  // 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      // 각 영화에 대해 genre 정보를 포함하여 전송
      const response = await fetch('http://localhost:5002/api/survey/preferences/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          preferences: selectedMovies.map(movie => ({
            movieId: movie.id,
            genre: movie.genre || null  // genre 정보가 있다면 포함
          }))
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('서버 응답:', errorText);
        throw new Error('선호도 저장에 실패했습니다.');
      }

      // 선호도 조사 완료 후 메인 페이지로 이동
      alert('선호도 조사가 완료되었습니다.');
      navigate('/');

    } catch (error) {
      console.error('선호도 저장 에러:', error);
      setError(error.message || '선호도 저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-[#40E0D0] text-center mb-12">Ticket 101</h1>
        <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-8 text-white text-center">선호 영화 선택</h2>
          
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          {/* 검색 입력창 */}
          <input
            type="text"
            placeholder="영화 검색..."
            className="w-full p-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#40E0D0]"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {/* 검색 결과 목록 */}
          {searchResults.length > 0 && (
            <div className="mt-4 max-h-48 overflow-y-auto">
              {searchResults.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieSelect(movie)}
                  className="p-2 hover:bg-[#2a2a2a] cursor-pointer text-white"
                >
                  {movie.title}
                </div>
              ))}
            </div>
          )}

          {/* 선택된 영화 목록 */}
          <div className="mt-6">
            <h3 className="text-gray-300 mb-2">선택된 영화 ({selectedMovies.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedMovies.map(movie => (
                <span
                  key={movie.id}
                  className="bg-[#40E0D0] text-black px-3 py-1 rounded-full flex items-center"
                >
                  {movie.title}
                  <button
                    onClick={() => handleMovieRemove(movie.id)}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 완료 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={selectedMovies.length === 0}
            className="w-full mt-8 bg-[#40E0D0] text-black py-3 rounded-lg font-bold
                     hover:bg-[#3bcdc1] transition duration-200 ease-in-out
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesMovies; 