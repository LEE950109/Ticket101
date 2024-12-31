import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useAuth } from '../context/AuthContext'

const Mypage = () => {
    const { user } = useAuth();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('로그인이 필요한 페이지입니다.');
            navigate('/login');
            return;
        }

        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
    }, [user, navigate]);

    const moveSlide = (direction) => {
        const totalSlides = favorites.length;
        const maxSlides = Math.ceil(totalSlides / 5) - 1;
        
        setCurrentSlide(prev => 
            direction === 'next' 
                ? Math.min(prev + 1, maxSlides)
                : Math.max(prev - 1, 0)
        );
    };

    const handleRemoveFavorite = (showId) => {
        const updatedFavorites = favorites.filter(show => show.id !== showId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    const calendarEvents = favorites.map(show => ({
        title: show.title,
        date: show.date || new Date(), // 임시로 현재 날짜 사용
        id: show.id
    }));

    if (!user) return null;

    return (
        <main id="mypage">
            <div className="mypage__inner">
                <h2 className="mypage__title">마이페이지</h2>
                
                <section className="mypage__section">
                    <div className="section__header">
                        <h3>즐겨찾기</h3>
                        <span className="count">{favorites.length}</span>
                    </div>
                    <div className="show__list-container">
                        <button 
                            className="slide-btn prev" 
                            onClick={() => moveSlide('prev')}
                            disabled={currentSlide === 0}
                        >
                            <AiOutlineLeft />
                        </button>
                        <div className="show__list" style={{
                            transform: `translateX(-${currentSlide * 100}%)`
                        }}>
                            {favorites.map(show => (
                                <div key={show.id} className="show__item">
                                    <Link to={`/detail/${show.id}`}>
                                        <div className="show__image-container">
                                            <img src={show.image} alt={show.title} />
                                        </div>
                                        <p>{show.title}</p>
                                    </Link>
                                    <button 
                                        className="remove-favorite"
                                        onClick={() => handleRemoveFavorite(show.id)}
                                        aria-label="즐겨찾기 삭제"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="slide-btn next" 
                            onClick={() => moveSlide('next')}
                            disabled={currentSlide >= Math.ceil(favorites.length / 5) - 1}
                        >
                            <AiOutlineRight />
                        </button>
                    </div>
                </section>

                <section className="mypage__section">
                    <div className="section__header">
                        <h3>나의 공연 달력</h3>
                    </div>
                    <div className="calendar__container">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            locale="ko"
                            events={calendarEvents}
                            headerToolbar={{
                                left: '',
                                center: 'title',
                                right: 'prev,next'
                            }}
                            height="auto"
                            dayMaxEvents={true}
                            eventClick={(info) => {
                                navigate(`/detail/${info.event.id}`);
                            }}
                        />
                    </div>
                </section>

                <section className="mypage__section">
                    <div className="section__header">
                        <h3>회원정보 수정</h3>
                    </div>
                    <div className="profile__edit">
                        <button className="edit__button">회원정보 수정하기</button>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Mypage;
