import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { showDetails } from '../Data/detail';

const Detail = () => {
    const { id } = useParams();
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDetail, setShowDetail] = useState(null);

    useEffect(() => {
        const detail = showDetails.find(show => show.id === id);
        setShowDetail(detail);
    }, [id]);

    const toggleFavorite = (e) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);
    };

    if (!showDetail) {
        return <div>Loading...</div>;
    }

    return (
        <main id="detail" role="main">
            <div className="detail__inner">
                <div className="show__header">
                    <h1 className="show__title">{showDetail.title}</h1>
                    <div className="show__date-location">
                        <span>{showDetail.date}</span>
                        <span>{showDetail.location}</span>
                    </div>
                </div>
                
                <div className="detail__content">
                    <div className="detail__left">
                        <div className="show__image">
                            <img src={showDetail.image} alt={showDetail.title} />
                            <button 
                                className="favorite-btn"
                                onClick={toggleFavorite}
                            >
                                {isFavorite ? (
                                    <AiFillStar className="star-icon active" />
                                ) : (
                                    <AiOutlineStar className="star-icon" />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="detail__right">
                        <div className="show__info">
                            <dl>
                                <dt>관람연령</dt>
                                <dd>{showDetail.age}</dd>
                                <dt>관람시간</dt>
                                <dd>{showDetail.runningTime}</dd>
                                <dt>출연진</dt>
                                <dd>{showDetail.cast}</dd>
                                <dt>가격</dt>
                                <dd>{showDetail.price}</dd>
                            </dl>
                        </div>
                        <div className="show__description">
                            <h3>공연소개</h3>
                            <p>{showDetail.description}</p>
                        </div>
                        <div className="show__rating">
                            <h3>별점 및 리뷰</h3>
                            <div className="stars">
                                {[...Array(5)].map((_, index) => (
                                    <AiFillStar 
                                        key={index}
                                        className={index < showDetail.rating ? "active" : ""}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="show__buttons">
                            <button className="booking-btn">예매하기</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="detail__video">
                <iframe 
                    width="100%" 
                    height="700" 
                    src="https://www.youtube.com/embed/NpRzm7TTXok?autoplay=1&mute=1&start=60"
                    title={showDetail.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        </main>
    )
}

export default Detail
