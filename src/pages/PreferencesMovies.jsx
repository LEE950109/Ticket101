import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';

const PreferencesMovies = () => {
  const navigate = useNavigate();
  // const { checkAuth } = useAuth();

  const { updateMoviePreferences, saveAllPreferences, preferences } = usePreferences();
  console.log('usePreferences 반환 값:', { updateMoviePreferences, saveAllPreferences });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [error, setError] = useState(null);



  useEffect(() => {
    console.log('preferences.movies 변경됨:', preferences.movies); // preferences.movies 상태가 변경될 때 실행
  }, [preferences.movies]); // dependencies로 preferences.movies 추가


  const searchMovies = async (query) => {
    try {
      const response = await fetch(`${process.env.BACKEND_API_URL}/api/survey/movies/search?query=${query}`);
      if (!response.ok) throw new Error('검색 실패');
      const data = await response.json();
      console.log('response movie data 확인:', data);
      // 데이터 매핑
      return data.map(movie => ({
        movie_id: movie.movie_id,
        title: movie.title,
        genre: movie.genre,
        movie_num: movie.movie_num
      }));

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
    console.log('선택된 아티스트:', movie);
    console.log('현재 선택된 아티스트 목록 (업데이트 전):', selectedMovies);

    setSelectedMovies((prevSelected) => {
      // 중복 확인 후 상태 업데이트
    console.log('현재 상태의 selectedArtists:', prevSelected);

    if (!prevSelected.some(a => a.movie_id === movie.movie_id)) {
      const updated = [...prevSelected, movie];
      console.log('업데이트된 selectedMpvoies:', updated);
      return updated;
    }
    return prevSelected;
    });
    // if (!selectedMovies.find(m => m.movie_id === movie.movie_id)) {
    //   setSelectedMovies([...selectedMovies, movie]);
    // }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleMovieRemove = (movieId) => {
    setSelectedMovies(selectedMovies.filter(m => m.movie_id !== movieId));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      if (selectedMovies.length < 3) {
        throw new Error('최소 3개의 영화를 선택해주세요.');
      }

      // 선택된 영화의 장르 번호를 포함한 전체 데이터 전달
      const moviePreferences = selectedMovies.map(movie => ({
        movie_num: movie.movie_num  // 장르 번호 포함
      }));

      // Context에 영화 데이터 저장
      updateMoviePreferences(moviePreferences);

      console.log('usePreferences 반환 값:', { updateMoviePreferences, saveAllPreferences });
      // await delay(500);
      // 모든 데이터 한 번에 저장
      console.log('최종 제출 전 movie 장르:', moviePreferences);

      // setTimeout(() => {
      //   saveAllPreferences(userId);
      // }, 500);


      // await checkAuth();
      // 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/preferences/end');
      }, 100);
      

    } catch (error) {
      console.error('선호도 저장 에러:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
  if (preferences.movies.length > 0) {
    saveAllPreferences();
  }
}, [preferences.movies]); // movies 상태 변경 시 saveAllPreferences 호출


  const isSubmitDisabled = selectedMovies.length < 3;

  return (
    <div className="preferences-movies">
      <div className="preferences-movies__inner">
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
                key={movie.movie_id}
                onClick={() => handleMovieSelect(movie)}
                className="search-results__item"
              >
                {movie.title}
              </div>
            ))}
          </div>
        )}

        <div className="selected-items">
          <h3>선택된 영화 ({selectedMovies.length}/3)</h3>
          <div className="selected-items__list">
            {selectedMovies.map(movie => (
              <div key={movie.movie_id} className="selected-items__item">
                {movie.title}
                <button onClick={() => handleMovieRemove(movie.movie_id)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="submit-button"
        >
          {isSubmitDisabled ? `3개 이상 영화를 선택해주세요 (${selectedMovies.length}/3)` : '완료'}
        </button>
      </div>
    </div>
  );
};

export default PreferencesMovies; 