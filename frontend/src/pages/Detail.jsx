import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

const Detail = () => {
    const { id } = useParams();
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDetail, setShowDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBookingPopup, setShowBookingPopup] = useState(false);
    const [videoId, setVideoId] = useState(null);

    useEffect(() => {
        const fetchShowDetail = async () => {
            try {
                const response = await fetch(`http://localhost:5002/api/performances/${id}`);
                if (!response.ok) {
                    throw new Error('공연 정보를 찾을 수 없습니다.');
                }
                const data = await response.json();
                setShowDetail(data);
                
                // 즐겨찾기 상태 확인
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                setIsFavorite(favorites.some(fav => fav._id === id));

                // 유튜브 영상 검색
                fetchYoutubeVideo(data.name);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShowDetail();
    }, [id]);

    const fetchYoutubeVideo = async (showName) => {
        try {
            // API 키 확인을 위한 디버깅
            console.log('API KEY:', process.env.REACT_APP_YOUTUBE_API_KEY);
            
            const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
            if (!API_KEY) {
                console.error('YouTube API 키가 없습니다.');
                return;
            }

            const searchQuery = encodeURIComponent(`${showName} 공연 하이라이트`);
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=1&type=video&key=${API_KEY}`;
            
            console.log('검색 URL:', url); // 디버깅용

            const response = await fetch(url);
            const data = await response.json();
            
            console.log('YouTube API 응답:', data); // 디버깅용

            if (data.items && data.items.length > 0) {
                setVideoId(data.items[0].id.videoId);
                console.log('설정된 비디오 ID:', data.items[0].id.videoId);
            } else {
                console.log('검색 결과가 없습니다.');
            }
        } catch (error) {
            console.error('유튜브 영상을 가져오는데 실패했습니다:', error);
        }
    };

    const toggleFavorite = (e) => {
        e.preventDefault();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (isFavorite) {
            const updatedFavorites = favorites.filter(fav => fav._id !== id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } else {
            const updatedFavorites = [...favorites, showDetail];
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        }
        
        setIsFavorite(!isFavorite);
    };

    const handleBookingClick = (e) => {
        e.preventDefault();
        setShowBookingPopup(true);
    };

    const closePopup = () => {
        setShowBookingPopup(false);
    };

    // 예매처 목록 컴포넌트
    const BookingPopup = () => {
        if (!showBookingPopup) return null;

        // 예매처와 링크 문자열 분리
        const sites = showDetail.site ? showDetail.site.split(',').map(s => s.trim()) : [];
        const links = showDetail.link ? showDetail.link.split(';').map(l => l.trim()) : [];

        // 예매처와 링크 매칭
        const ticketSites = sites.map((site, index) => ({
            name: site,
            link: links[index] || '',
            show: links[index] ? true : false
        }));

        return (
            <div className="popup-overlay">
                <div className="popup-content">
                    <div className="popup-header">
                        <h3>예매하기</h3>
                        <button className="close-btn" onClick={closePopup}>
                            <IoMdClose />
                        </button>
                    </div>
                    <div className="booking-sites">
                        {ticketSites.map((site, index) => (
                            site.show && (
                                <div key={index} className="booking-site-item">
                                    <a 
                                        href={site.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="booking-link"
                                    >
                                        {site.name}에서 예매하기
                                    </a>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러: {error}</div>;
    if (!showDetail) return <div>공연 정보를 찾을 수 없습니다.</div>;

    return (
        <main id="detail" role="main">
            <div className="detail__inner">
                <div className="show__header">
                    <h1 className="show__title">{showDetail.name}</h1>
                    <div className="show__location">
                        <span>{showDetail.location} | {showDetail.region}</span>
                    </div>
                </div>
                
                <div className="detail__content">
                    <div className="detail__left">
                        <div className="show__image">
                            <img src={showDetail.image} alt={showDetail.name} />
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
                                <dt>공연기간</dt>
                                <dd>{showDetail.date}</dd>
                                <dt>관람연령</dt>
                                <dd>{showDetail.age}</dd>
                                <dt>티켓가격</dt>
                                <dd>{showDetail.price}</dd>
                            </dl>
                        </div>

                        <div className="show__buttons">
                            <button 
                                onClick={handleBookingClick}
                                className="booking-btn"
                            >
                                예매하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {videoId && (
                <div className="detail__video">
                    <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
            
            <BookingPopup />
        </main>
    )
}

export default Detail
