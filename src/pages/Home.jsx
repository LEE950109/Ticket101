import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillStar, AiOutlineStar, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { getCurrentUser } from '@aws-amplify/auth';
import { useAuth } from '../context/AuthContext';

const Home = () => {

    const { user, loading } = useAuth();
    const isAuthenticated = !!(user && user.sub);
    console.log('로그인 상태:', isAuthenticated);
    
    const [favorites, setFavorites] = useState([]);
    const [performances, setPerformances] = useState({
        recommended: [],
        musical: [],
        popular: [],
        korean: [],
        classical: []
    });
    const [currentSlide, setCurrentSlide] = useState({
        recommended: 0,
        musical: 0,
        popular: 0,
        korean: 0,
        classical: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            console.log('fetchData 실행, 로그인 상태:', isAuthenticated);
            console.log("api 주소 확인: ", process.env.BACKEND_API_URL)
            if (loading) return;

            try {
                const response = await fetch(`${process.env.BACKEND_API_URL}/api/performances`);
                
                const data = await response.json();

                let performancesData = {
                    musical: data.musical,
                    popular: data.popular,
                    korean: data.korean,
                    classical: data.classical,
                    recommended: []
                };
                if (isAuthenticated) {
                    const userInfo = localStorage.getItem('userInfo');
                    console.log('userInfo 값:', userInfo);
                    // JSON으로 파싱하기
                    if (userInfo){
                        const parsedUserInfo = JSON.parse(userInfo);
                        const userId = parsedUserInfo.sub; // 'sub' 값 추출
                        console.log('sub 값:', userId);

                        const response2 = await fetch(`${process.env.BACKEND_API_URL}/api/performances/recommend/${userId}`);
                        const recommendData = await response2.json();
                        console.log('recommend_data:', recommendData);

                        performancesData.recommended = recommendData ?? [];
                    }  
                    // response2 값이 존재하면 recommended에 할당   
                }

                setPerformances(performancesData);

                if (isAuthenticated) {
                    try {
                        const { username } = await getCurrentUser();
                        const favoritesResponse = await fetch(`${process.env.BACKEND_API_URL}/api/favorites/${username}`);
                        if (favoritesResponse.ok) {
                            const favoritesData = await favoritesResponse.json();
                            setFavorites(favoritesData);
                        }
                    } catch (error) {
                        console.log('즐겨찾기 데이터 로딩 실패:', error);
                    }
                } else {
                    setFavorites([]);
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            }
        };

        fetchData();
    }, [isAuthenticated, loading]);

    const handleFavorite = async (e, show) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const { username } = await getCurrentUser();
            if (!username) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            const isAlreadyFavorite = favorites.some(fav => fav.performance_id === show.performance_id);

            if (isAlreadyFavorite) {
                const response = await fetch(`${process.env.BACKEND_API_URL}/api/favorites/${username}/${show.performance_id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('즐겨찾기 삭제 실패');
                setFavorites(favorites.filter(fav => fav.performance_id !== show.performance_id));
            } else {
                const response = await fetch(`${process.env.BACKEND_API_URL}/api/favorites/${username}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        performance_id: show.performance_id,
                        image: show.image,
                        title: show.title,
                        start_date: show.start_date,
                        end_date: show.end_date
                    })
                });

                if (!response.ok) throw new Error('즐겨찾기 추가 실패');
                const newFavorite = await response.json();
                setFavorites([...favorites, newFavorite]);
            }
        } catch (error) {
            console.error('즐겨찾기 처리 중 에러:', error);
            alert('즐겨찾기 처리 중 오류가 발생했습니다.');
        }
    };

    const moveSlide = (genre, direction) => {
        const itemsPerPage = 6;  // 한 슬라이드 화면에 6개의 공연이 보임
        const totalSlides = Math.ceil(performances[genre].length / itemsPerPage);
        // 예: 30개 공연이면 totalSlides는 5가 됨 (30/6 = 5)

        setCurrentSlide(prev => ({
            ...prev,
            [genre]: direction === 'next'
                ? Math.min(prev[genre] + 1, totalSlides - 1)  // 다음 6개로 이동
                : Math.max(prev[genre] - 1, 0)  // 이전 6개로 이동
        }));
    };

    const genreNames = {
        recommended: "추천 공연",
        musical: "뮤지컬",
        popular: "대중음악",
        korean: "한국음악(국악)",
        classical: "서양음악(클래식)"
    };

    // 장르 순서를 로그인 상태에 따라 동적으로 설정
    const genreOrder = isAuthenticated
        ? ['recommended', 'musical', 'popular', 'korean', 'classical']
        : ['musical', 'popular', 'korean', 'classical'];

    // 렌더링 시 장르 순서 로그
    console.log('현재 장르 순서:', genreOrder);

    return (
        <main id="main" role="main">
            {genreOrder.map(genre => (
                <section key={genre}>
                    <h2 className="section__title">
                        {genreNames[genre]}
                        {genre === 'recommended' && isAuthenticated }
                    </h2>
                    <div className="show__list-container">
                        <button
                            className="slide-btn prev"
                            onClick={() => moveSlide(genre, 'prev')}
                            disabled={currentSlide[genre] === 0}
                        >
                            <AiOutlineLeft />
                        </button>
                        <div className="show__list" style={{
                            transform: `translateX(calc(-${currentSlide[genre] * (100 / 6 * 6)}%))`
                        }}>
                            {performances[genre].map((show, index) => (
                                <div key={show.performance_id}
                                     className="show__item"
                                >
                                    <Link to={`/detail/${show.performance_id}`}>
                                        <div className="show__image-container">
                                            <img src={show.image} alt={show.title} />
                                            <button
                                                className="favorite-btn"
                                                onClick={(e) => handleFavorite(e, show)}
                                            >
                                                {favorites.some(fav => fav.performance_id === show.performance_id) ? (
                                                    <AiFillStar className="star-icon active" />
                                                ) : (
                                                    <AiOutlineStar className="star-icon" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="show__info">
                                            <p className="show__title">{show.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <button
                            className="slide-btn next"
                            onClick={() => moveSlide(genre, 'next')}
                            disabled={currentSlide[genre] >= Math.ceil(performances[genre].length / 6) - 1}
                        >
                            <AiOutlineRight />
                        </button>
                    </div>
                </section>
            ))}
        </main>
    );
};

export default Home;
