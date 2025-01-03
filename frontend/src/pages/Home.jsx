import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillStar, AiOutlineStar, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { recommendedPerformances, ticketSites } from '../Data/home';

const Home = () => {
    const [favorites, setFavorites] = useState([]);
    const [performances, setPerformances] = useState({
        recommended: [],
        ticketSites: []
    });
    const [currentSlide, setCurrentSlide] = useState({
        recommended: 0,
        interpark: 0,
        yes24: 0,
        melon: 0,
        ticketlink: 0,
        others: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await fetch('http://localhost:5002/api/performances');
                const data = await response.json();
                setPerformances(data);
            } catch (error) {
                console.error('공연 정보를 가져오는데 실패했습니다:', error);
            }
        };

        fetchPerformances();
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
    }, []);

    const handleFavorite = (e, show) => {
        e.preventDefault();
        e.stopPropagation();

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isAlreadyFavorite = currentFavorites.some(fav => fav._id === show._id);
        
        let updatedFavorites;
        if (isAlreadyFavorite) {
            updatedFavorites = currentFavorites.filter(fav => fav._id !== show._id);
        } else {
            updatedFavorites = [...currentFavorites, show];
        }
        
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    const moveSlide = (section, direction) => {
        const totalSlides = section === 'recommended' 
            ? recommendedPerformances.length 
            : ticketSites.find(site => site.id === section)?.shows.length || 0;
        
        const maxSlides = Math.ceil(totalSlides / 5) - 1;

        setCurrentSlide(prev => ({
            ...prev,
            [section]: direction === 'next' 
                ? Math.min(prev[section] + 1, maxSlides)
                : Math.max(prev[section] - 1, 0)
        }));
    };

    return (
        <main id="main" role="main">
            <section>
                <h2 className="section__title">추천 공연</h2>
                <div className="show__list-container">
                    <button 
                        className="slide-btn prev" 
                        onClick={() => moveSlide('recommended', 'prev')}
                        disabled={currentSlide.recommended === 0}
                    >
                        <AiOutlineLeft />
                    </button>
                    <div className="show__list" style={{
                        transform: `translateX(-${currentSlide.recommended * 100}%)`
                    }}>
                        {performances.recommended.map(show => (
                            <div key={show._id} className="show__item">
                                <Link to={`/detail/${show._id}`}>
                                    <div className="show__image-container">
                                        <img src={show.image} alt={show.name} />
                                        <button 
                                            className="favorite-btn"
                                            onClick={(e) => handleFavorite(e, show)}
                                        >
                                            {favorites.some(fav => fav._id === show._id) ? (
                                                <AiFillStar className="star-icon active" />
                                            ) : (
                                                <AiOutlineStar className="star-icon" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="show__info">
                                        <p className="show__title">{show.name}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="slide-btn next" 
                        onClick={() => moveSlide('recommended', 'next')}
                        disabled={currentSlide.recommended >= Math.ceil(performances.recommended.length / 5) - 1}
                    >
                        <AiOutlineRight />
                    </button>
                </div>
            </section>

            {performances.ticketSites && performances.ticketSites.map(site => (
                <section key={site.id}>
                    <h2 className="section__title">{site.name}</h2>
                    <div className="show__list-container">
                        <button 
                            className="slide-btn prev" 
                            onClick={() => moveSlide(site.id, 'prev')}
                            disabled={currentSlide[site.id] === 0}
                        >
                            <AiOutlineLeft />
                        </button>
                        <div className="show__list" style={{
                            transform: `translateX(-${currentSlide[site.id] * 100}%)`
                        }}>
                            {site.shows.map(show => (
                                <div key={show._id} className="show__item">
                                    <Link to={`/detail/${show._id}`}>
                                        <div className="show__image-container">
                                            <img src={show.image} alt={show.name} />
                                            <button 
                                                className="favorite-btn"
                                                onClick={(e) => handleFavorite(e, show)}
                                            >
                                                {favorites.some(fav => fav._id === show._id) ? (
                                                    <AiFillStar className="star-icon active" />
                                                ) : (
                                                    <AiOutlineStar className="star-icon" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="show__info">
                                            <p className="show__title">{show.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="slide-btn next" 
                            onClick={() => moveSlide(site.id, 'next')}
                            disabled={currentSlide[site.id] >= Math.ceil(site.shows.length / 5) - 1}
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
