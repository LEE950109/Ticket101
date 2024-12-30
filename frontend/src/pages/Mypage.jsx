import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { checkLoginStatus, getUserData } from './Login'

const Mypage = () => {
    const [userData, setUserData] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkLoginStatus()) {
            navigate('/login');
            return;
        }

        const userInfo = getUserData();
        setUserData(userInfo);
    }, [navigate]);

    const moveSlide = (direction) => {
        const totalSlides = userData?.favorites?.length || 0;
        const maxSlides = Math.ceil(totalSlides / 5) - 1;
        
        setCurrentSlide(prev => 
            direction === 'next' 
                ? Math.min(prev + 1, maxSlides)
                : Math.max(prev - 1, 0)
        );
    };

    // 캘린더에 표시할 이벤트 데이터로 변환
    const calendarEvents = userData?.favorites.map(show => ({
        title: show.title,
        date: show.date,
        id: show.id
    })) || [];

    const handleRemoveFavorite = (showId) => {
        // 즐겨찾기 삭제 로직 구현
        console.log(`Remove show ${showId} from favorites`);
    };

    if (!userData) return <div>로딩 중...</div>;

    return (
        <main id="mypage">
            <div className="mypage__inner">
                <h2 className="mypage__title">마이페이지</h2>
                
                <section className="mypage__section">
                    <div className="section__header">
                        <h3>즐겨찾기</h3>
                        <span className="count">{userData?.favorites.length}</span>
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
                            {userData?.favorites.map(show => (
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
                            disabled={currentSlide >= Math.ceil((userData?.favorites.length - 5) / 5)}
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
                                console.log('Clicked event:', info.event.title);
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
}

export default Mypage;
