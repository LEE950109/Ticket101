import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PreferencesArtists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchArtists = async (query) => {
    try {
      const response = await fetch(`http://localhost:5002/api/survey/artists/search?query=${query}`);
      if (!response.ok) throw new Error('검색 실패');
      return await response.json();
    } catch (error) {
      console.error('아티스트 검색 오류:', error);
      return [];
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    if (query.length > 0) {
      const results = await searchArtists(query);
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

  const handleArtistSelect = (artist) => {
    if (!selectedArtists.find(a => a.id === artist.id)) {
      setSelectedArtists([...selectedArtists, artist]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleArtistRemove = (artistId) => {
    setSelectedArtists(selectedArtists.filter(a => a.id !== artistId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('사용자 ID를 찾을 수 없습니다.');

      const response = await fetch('http://localhost:5002/api/survey/preferences/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          preferences: selectedArtists.map(artist => ({ artistId: artist.id }))
        })
      });

      if (!response.ok) throw new Error('선호도 저장에 실패했습니다.');
      navigate('/preferences/movies');
    } catch (error) {
      console.error('선호도 저장 에러:', error);
      setError(error.message);
    }
  };

  const isSubmitDisabled = selectedArtists.length < 3;

  return (
    <div className="preferences-artists">
      <div className="preferences-artists__inner">
        <h1>맞춤 공연 설문 조사</h1>
        <h2>선호하는 가수를 검색 해주세요</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          placeholder="아티스트를 검색해주세요"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(artist => (
              <div
                key={artist.id}
                onClick={() => handleArtistSelect(artist)}
                className="search-results__item"
              >
                {artist.name}
              </div>
            ))}
          </div>
        )}

        <div className="selected-items">
          <h3>선택된 아티스트 ({selectedArtists.length}/3)</h3>
          <div className="selected-items__list">
            {selectedArtists.map(artist => (
              <div key={artist.id} className="selected-items__item">
                {artist.name}
                <button onClick={() => handleArtistRemove(artist.id)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="submit-button"
        >
          {isSubmitDisabled ? `3명 이상의 아티스트를 선택해주세요 (${selectedArtists.length}/3)` : '다음'}
        </button>
      </div>
    </div>
  );
};

export default PreferencesArtists;