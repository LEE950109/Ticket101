import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { getCurrentUser } from '@aws-amplify/auth';


const Detail = () => {
    const { id } = useParams();
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDetail, setShowDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBookingPopup, setShowBookingPopup] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShowDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.BACKEND_API_URL}/api/performances/${id}`);
                if (!response.ok) {
                    throw new Error('공연 정보를 가져오는데 실패했습니다.');
                }
                const data = await response.json();
                setShowDetail(data);
                
                // 즐겨찾기 상태 확인 (5004 포트 사용)
                try {
                    const { username } = await getCurrentUser();
                    const favResponse = await fetch(`${process.env.BACKEND_API_URL}/api/favorites/${username}`);
                    if (favResponse.ok) {
                        const favorites = await favResponse.json();
                        setIsFavorite(favorites.some(fav => fav.performance_id === id));
                    }
                } catch (error) {
                    console.log('로그인 상태가 아닙니다.');
                }

                fetchYoutubeVideo(data.title);
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
            // API 키 디버깅
            const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
            console.log('환경변수 전체:', process.env);
            console.log('YouTube API 키:', API_KEY);

            if (!API_KEY) {
                console.error('YouTube API 키를 찾을 수 없습니다');
                return;
            }

            // 검색어 단순화
            const searchQuery = encodeURIComponent(showName);  // 검색어 단순화
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=1&type=video&key=${API_KEY}`;
            
            console.log('검색 URL:', url);
            console.log('검색어:', searchQuery);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`YouTube API 오류: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('YouTube API 응답:', data);

            if (data.items && data.items.length > 0) {
                setVideoId(data.items[0].id.videoId);
                console.log('설정된 비디오 ID:', data.items[0].id.videoId);
            } else {
                console.log('검색 결과가 없습니다');
            }
        } catch (error) {
            console.error('유튜브 영상 검색 에러:', error);
        }
    };

    const toggleFavorite = async (e) => {
        e.preventDefault();
        
        try {
            const { username } = await getCurrentUser();
            if (!username) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            if (isFavorite) {
                const response = await fetch(`${process.env.BACKEND_API_URL}/api/favorites/${username}/${showDetail.performance_id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('즐겨찾기 삭제 실패');
            } else {
                const response = await fetch(`${process.env.BACKEND_API_URL}/api/favorites/${username}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        performance_id: showDetail.performance_id,
                        image: showDetail.image,
                        title: showDetail.title,
                        start_date: showDetail.start_date,
                        end_date: showDetail.end_date
                    })
                });

                if (!response.ok) throw new Error('즐겨찾기 추가 실패');
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('즐겨찾기 처리 중 에러:', error);
            alert('즐겨찾기 처리 중 오류가 발생했습니다.');
        }
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
                    <h1 className="show__title">{showDetail.title}</h1>
                    <div className="show__location">
                        <span>{showDetail.location} | {showDetail.city}</span>
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
                                <dt>공연기간</dt>
                                <dd>{showDetail.start_date} ~ {showDetail.end_date}</dd>
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
