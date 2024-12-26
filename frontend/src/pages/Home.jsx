import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";

const Home = () => {
    const [favorites, setFavorites] = useState({});

    const toggleFavorite = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const recommendedShows = [
        { id: "r1", title: "뮤지컬 라이온킹", image: "https://picsum.photos/200/280?random=1" },
        { id: "r2", title: "뮤지컬 위키드", image: "https://picsum.photos/200/280?random=2" },
        { id: "r3", title: "뮤지컬 데스노트", image: "https://picsum.photos/200/280?random=3" },
        { id: "r4", title: "뮤지컬 레미제라블", image: "https://picsum.photos/200/280?random=4" },
        { id: "r5", title: "뮤지컬 캣츠", image: "https://picsum.photos/200/280?random=5" },
    ];

    const ticketSites = [
        {
            name: "인터파크",
            shows: [
                { id: "i1", title: "인터파크 공연1", image: "https://picsum.photos/200/280?random=11" },
                { id: "i2", title: "인터파크 공연2", image: "https://picsum.photos/200/280?random=12" },
                { id: "i3", title: "인터파크 공연3", image: "https://picsum.photos/200/280?random=13" },
                { id: "i4", title: "인터파크 공연4", image: "https://picsum.photos/200/280?random=14" },
                { id: "i5", title: "인터파크 공연5", image: "https://picsum.photos/200/280?random=15" },
            ]
        },
        {
            name: "예스24",
            shows: [
                { id: "o1", title: "예스24 공연1", image: "https://picsum.photos/200/280?random=21" },
                { id: "o2", title: "예스24 공연2", image: "https://picsum.photos/200/280?random=22" },
                { id: "o3", title: "예스24 공연3", image: "https://picsum.photos/200/280?random=23" },
                { id: "o4", title: "예스24 공연4", image: "https://picsum.photos/200/280?random=24" },
                { id: "o5", title: "예스24 공연5", image: "https://picsum.photos/200/280?random=25" },
            ]
        },
        {
            name: "멜론티켓",
            shows: [
                { id: "p1", title: "멜론티켓 공연1", image: "https://picsum.photos/200/280?random=31" },
                { id: "p2", title: "멜론티켓 공연2", image: "https://picsum.photos/200/280?random=32" },
                { id: "p3", title: "멜론티켓 공연3", image: "https://picsum.photos/200/280?random=33" },
                { id: "p4", title: "멜론티켓 공연4", image: "https://picsum.photos/200/280?random=34" },
                { id: "p5", title: "멜론티켓 공연5", image: "https://picsum.photos/200/280?random=35" },
            ]
        },
        {
            name: "티켓링크",
            shows: [
                { id: "q1", title: "티켓링크 공연1", image: "https://picsum.photos/200/280?random=41" },
                { id: "q2", title: "티켓링크 공연2", image: "https://picsum.photos/200/280?random=42" },
                { id: "q3", title: "티켓링크 공연3", image: "https://picsum.photos/200/280?random=43" },
                { id: "q4", title: "티켓링크 공연4", image: "https://picsum.photos/200/280?random=44" },
                { id: "q5", title: "티켓링크 공연5", image: "https://picsum.photos/200/280?random=45" },
            ]
        }
    ];

    return (
        <main id="main" role="main">
            <section className="ticket-site">
                <h2 className="section__title">추천 공연</h2>
                <div className="show__list">
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
                                            <AiTwotoneStar className="star-icon active" />
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
            </section>

            {ticketSites.map((site) => (
                <section key={site.name} className="ticket-site">
                    <h2 className="section__title">{site.name}</h2>
                    <div className="show__list">
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
                                                <AiTwotoneStar className="star-icon active" />
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
                </section>
            ))}
        </main>
    )
}

export default Home
