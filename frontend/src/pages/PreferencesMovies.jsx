import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PreferencesMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchMovies = async (query) => {
    try {
      const response = await fetch(`http://localhost:5002/api/survey/movies/search?query=${query}`);
      if (!response.ok) throw new Error('검색 실패');
      return await response.json();
    } catch (error) {
      console.error('영화 검색 오류:', error);
      return [];
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    if (query.length > 0) {
      const results = await searchMovies(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      handleSearch(e);
    } else {
      setSearchResults([]);
    }
  };

  const handleMovieSelect = (movie) => {
    if (!selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleMovieRemove = (movieId) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('사용자 ID를 찾을 수 없습니다.');

      const response = await fetch('http://localhost:5002/api/survey/preferences/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          preferences: selectedMovies.map(movie => ({
            movieId: movie.id,
            genre: movie.genre || null
          }))
        })
      });

      if (!response.ok) throw new Error('선호도 저장에 실패했습니다.');
      alert('선호도 조사가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('선호도 저장 에러:', error);
      setError(error.message);
    }
  };

  const isSubmitDisabled = selectedMovies.length < 5;

  return (
    <div className="preferences">
      <div className="preferences__inner">
        <h1>맞춤 공연 설문 조사</h1>
        <h2>좋아하는 영화를 검색 해주세요</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          placeholder="영화를 검색해주세요"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(movie => (
              <div
                key={movie.id}
                onClick={() => handleMovieSelect(movie)}
                className="search-results__item"
              >
                {movie.title}
              </div>
            ))}
          </div>
        )}

        <div className="selected-items">
          <h3>선택된 영화 ({selectedMovies.length}/5)</h3>
          <div className="selected-items__list">
            {selectedMovies.map(movie => (
              <div key={movie.id} className="selected-items__item">
                {movie.title}
                <button onClick={() => handleMovieRemove(movie.id)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="submit-button"
        >
          {isSubmitDisabled ? `최소 5개의 영화를 선택해주세요 (${selectedMovies.length}/5)` : '완료'}
        </button>
      </div>
    </div>
  );
};

export default PreferencesMovies; 