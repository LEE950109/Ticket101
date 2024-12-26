import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";

const Detail = () => {
    const { id } = useParams();
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = (e) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);
    };

    // 실제로는 API나 데이터베이스에서 가져올 데이터
    const showDetail = {
        id: id,
        title: "뮤지컬 라이온킹",
        image: "https://picsum.photos/400/560?random=1",
        date: "2024.03.01 - 2024.05.31",
        location: "예술의전당",
        price: "60,000원 ~ 140,000원",
        runningTime: "150분",
        age: "8세 이상",
        cast: "김OO, 이OO, 박OO",
        description: "브로드웨이 최고의 뮤지컬...",
    }

    return (
        <main id="detail" role="main">
            <div className="detail__inner">
                <div className="detail__content">
                    <div className="detail__left">
                        <div className="show__image">
                            <img src={showDetail.image} alt={showDetail.title} />
                            <button 
                                className="favorite-btn"
                                onClick={toggleFavorite}
                            >
                                {isFavorite ? (
                                    <AiTwotoneStar className="star-icon active" />
                                ) : (
                                    <AiOutlineStar className="star-icon" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="detail__right">
                        <h2 className="show__title">{showDetail.title}</h2>
                        <div className="show__info">
                            <dl>
                                <dt>공연기간</dt>
                                <dd>{showDetail.date}</dd>
                                <dt>공연장소</dt>
                                <dd>{showDetail.location}</dd>
                                <dt>관람시간</dt>
                                <dd>{showDetail.runningTime}</dd>
                                <dt>관람연령</dt>
                                <dd>{showDetail.age}</dd>
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
                        <div className="show__buttons">
                            <button className="booking-btn">예매하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Detail
