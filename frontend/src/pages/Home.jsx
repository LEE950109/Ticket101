import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiFillStar, AiOutlineStar, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Home = () => {
    const [favorites, setFavorites] = useState({});
    const [currentSlide, setCurrentSlide] = useState({
        recommended: 0,
        interpark: 0,
        yes24: 0,
        melon: 0,
        ticketlink: 0
    });

    const toggleFavorite = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const moveSlide = (section, direction) => {
        const totalSlides = section === 'recommended' 
            ? recommendedShows.length 
            : ticketSites.find(site => site.id === section)?.shows.length || 0;
        
        const maxSlides = Math.ceil(totalSlides / 5) - 1;

        setCurrentSlide(prev => ({
            ...prev,
            [section]: direction === 'next' 
                ? Math.min(prev[section] + 1, maxSlides)
                : Math.max(prev[section] - 1, 0)
        }));
    };

    const recommendedShows = [
        { id: "r1", title: "뮤지컬 라이온킹", image: "https://picsum.photos/200/280?random=1" },
        { id: "r2", title: "뮤지컬 위키드", image: "https://picsum.photos/200/280?random=2" },
        { id: "r3", title: "뮤지컬 데스노트", image: "https://picsum.photos/200/280?random=3" },
        { id: "r4", title: "뮤지컬 레미제라블", image: "https://picsum.photos/200/280?random=4" },
        { id: "r5", title: "뮤지컬 캣츠", image: "https://picsum.photos/200/280?random=5" },
        { id: "r6", title: "뮤지컬 오페라의 유령", image: "https://picsum.photos/200/280?random=6" },
        { id: "r7", title: "뮤지컬 맘마미아", image: "https://picsum.photos/200/280?random=7" },
        { id: "r8", title: "뮤지컬 지킬앤하이드", image: "https://picsum.photos/200/280?random=8" },
        { id: "r9", title: "뮤지컬 헤드윅", image: "https://picsum.photos/200/280?random=9" },
        { id: "r10", title: "뮤지컬 아이다", image: "https://picsum.photos/200/280?random=10" },
    ];

    const ticketSites = [
        {
            name: "인파파크",
            id: "interpark",
            shows: Array.from({ length: 10 }, (_, i) => ({
                id: `i${i + 1}`,
                title: `인터파크 공연${i + 1}`,
                image: `https://picsum.photos/200/280?random=${11 + i}`
            }))
        },
        {
            name: "예스24",
            id: "yes24",
            shows: Array.from({ length: 10 }, (_, i) => ({
                id: `y${i + 1}`,
                title: `예스24 공연${i + 1}`,
                image: `https://picsum.photos/200/280?random=${21 + i}`
            }))
        },
        {
            name: "멜론티켓",
            id: "melon",
            shows: Array.from({ length: 10 }, (_, i) => ({
                id: `m${i + 1}`,
                title: `멜론티켓 공연${i + 1}`,
                image: `https://picsum.photos/200/280?random=${31 + i}`
            }))
        },
        {
            name: "티켓링크",
            id: "ticketlink",
            shows: Array.from({ length: 10 }, (_, i) => ({
                id: `t${i + 1}`,
                title: `티켓���크 공연${i + 1}`,
                image: `https://picsum.photos/200/280?random=${41 + i}`
            }))
        }
    ];

    return (
        <main id="main" role="main">
            <section className="ticket-site">
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
                        {recommendedShows.map((show) => (
                            <div key={show.id} className="show__item">
                                <Link to={`/detail/${show.id}`}>
                                    <div className="show__image-container">
                                        <img src={show.image} alt={show.title} />
                                        <button 
                                            className="favorite-btn"
                                            onClick={(e) => toggleFavorite(e, show.id)}
                                        >
                                            {favorites[show.id] ? (
                                                <AiFillStar className="star-icon active" />
                                            ) : (
                                                <AiOutlineStar className="star-icon" />
                                            )}
                                        </button>
                                    </div>
                                    <p>{show.title}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="slide-btn next" 
                        onClick={() => moveSlide('recommended', 'next')}
                        disabled={currentSlide.recommended >= (recommendedShows.length / 5) - 1}
                    >
                        <AiOutlineRight />
                    </button>
                </div>
            </section>

            {ticketSites.map((site) => (
                <section key={site.id} className="ticket-site">
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
                            {site.shows.map((show) => (
                                <div key={show.id} className="show__item">
                                    <Link to={`/detail/${show.id}`}>
                                        <div className="show__image-container">
                                            <img src={show.image} alt={show.title} />
                                            <button 
                                                className="favorite-btn"
                                                onClick={(e) => toggleFavorite(e, show.id)}
                                            >
                                                {favorites[show.id] ? (
                                                    <AiFillStar className="star-icon active" />
                                                ) : (
                                                    <AiOutlineStar className="star-icon" />
                                                )}
                                            </button>
                                        </div>
                                        <p>{show.title}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="slide-btn next" 
                            onClick={() => moveSlide(site.id, 'next')}
                            disabled={currentSlide[site.id] >= (site.shows.length / 5) - 1}
                        >
                            <AiOutlineRight />
                        </button>
                    </div>
                </section>
            ))}
        </main>
    )
}

export default Home
