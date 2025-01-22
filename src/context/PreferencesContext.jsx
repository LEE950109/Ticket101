import React, { createContext, useContext, useState, useEffect  } from 'react';
import { useAuth } from './AuthContext';
import { getCurrentUser } from 'aws-amplify/auth';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const { user } = useAuth();
  // const { user } = getCurrentUser()
  const authUserId = user?.sub; // user가 null이 아닐 때만 sub 접근

  const [preferences, setPreferences] = useState({
    basic: {
      gender: '',
      age: '',
      city: '',
      user_genre: ''
    },
    artists: [],
    movies: [],
  });
  const userId = authUserId || JSON.parse(localStorage.getItem('userInfo'))?.sub;
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
    console.log('updateMoviePreferences 호출 후 preferences.movies:', preferences.movies);
  };

  const saveAllPreferences = async () => {
    if (!preferences.basic.gender || !preferences.basic.age || !preferences.basic.city || !preferences.basic.user_genre) {
      throw new Error('기본 정보가 누락되었습니다.');
    }
    console.log('preferences artist확인:', preferences.artists);
    console.log('preferences  movie확인:', preferences.movies);
    try {
      const artistGenreNumbers = preferences.artists
        .map((artist) => artist.artist_num)
        .join(',');
      const movieGenreNumbers = preferences.movies
        .map((movie) => movie.movie_num)
        .join(',');



      console.log('artistGenreNumbers  확인:', artistGenreNumbers);
      console.log('movieGenreNumbers  확인:', movieGenreNumbers);
        
        const formattedData = {
          userId,
          gender: preferences.basic.gender,
          age: preferences.basic.age,
          city: preferences.basic.city,
          user_genre: preferences.basic.user_genre,
          artist_genre_number: artistGenreNumbers,
          movie_genre_number: movieGenreNumbers,
        };
        console.log('전송 데이터:', formattedData);

      // 디버깅을 위한 로그 추가
      const response = await fetch(`${process.env.BACKEND_API_URL}/api/survey/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('선호도 저장에 실패했습니다.');
      }

      console.log('선호도 저장 성공');
    } catch (error) {
      console.error('선호도 저장 에러:', error);
      throw error;
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updateBasicPreferences,
        updateArtistPreferences,
        updateMoviePreferences,
        saveAllPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences는 PreferencesProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};