import React, { createContext, useContext, useState } from 'react';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    basic: {
      gender: '',
      age: '',
      region: '',
      user_genre: ''
    },
    artists: [],
    movies: []
  });

  const updateBasicPreferences = (basicData) => {
    setPreferences(prev => ({
      ...prev,
      basic: basicData
    }));
  };

  const updateArtistPreferences = (artistData) => {
    setPreferences(prev => ({
      ...prev,
      artists: artistData
    }));
  };

  const updateMoviePreferences = (movieData) => {
    setPreferences(prev => ({
      ...prev,
      movies: movieData
    }));
  };

  const saveAllPreferences = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('저장된 userId:', userId);

      if (!userId) {
        localStorage.setItem('userId', '1');
        console.log('임시 userId 설정:', 1);
      }

      const finalUserId = localStorage.getItem('userId');

      // 디버깅을 위한 로그 추가
      console.log('preferences 전체:', preferences);
      console.log('artists 데이터:', preferences.artists);
      console.log('movies 데이터:', preferences.movies);

      // 아티스트 장르 번호 처리
      const artistGenreNumbers = preferences.artists
        .map(artist => artist.genre_number)
        .filter(Boolean)
        .join(',');

      // 영화 장르 번호 처리
      const movieGenreNumbers = preferences.movies
        .map(movie => {
          console.log('개별 영화 데이터:', movie); // 각 영화 객체 확인
          return movie.genre_number;
        })
        .filter(Boolean)
        .join(',');

      console.log('처리된 아티스트 장르:', artistGenreNumbers);
      console.log('처리된 영화 장르:', movieGenreNumbers);

      const formattedData = {
        userId: parseInt(finalUserId),
        gender: preferences.basic.gender || null,
        age: preferences.basic.age ? parseInt(preferences.basic.age) : null,
        region: preferences.basic.region || null,
        user_genre: preferences.basic.user_genre || null,
        artist_genre_number: artistGenreNumbers || null,
        movie_genre_number: movieGenreNumbers || null
      };

      console.log('전송할 데이터:', formattedData);

      const response = await fetch('http://localhost:5002/api/survey/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '선호도 저장에 실패했습니다.');
      }

      const data = await response.json();
      console.log('서버 응답:', data);
      return data;

    } catch (error) {
      console.error('선호도 저장 에러:', error);
      throw error;
    }
  };

  return (
    <PreferencesContext.Provider value={{
      preferences,
      updateBasicPreferences,
      updateArtistPreferences,
      updateMoviePreferences,
      saveAllPreferences
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}; 