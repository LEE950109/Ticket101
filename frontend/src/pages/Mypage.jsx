import React from 'react'
import { Link } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const Mypage = () => {
    // 즐겨찾기한 공연 목록 (예시 데이터)
    const favoriteShows = [
        { id: "r1", title: "뮤지컬 라이온킹", image: "https://picsum.photos/200/280?random=1", date: "2024-03-15" },
        { id: "r2", title: "뮤지컬 위키드", image: "https://picsum.photos/200/280?random=2", date: "2024-03-20" },
    ];

    // 캘린더에 표시할 이벤트 데이터로 변환
    const calendarEvents = favoriteShows.map(show => ({
        title: show.title,
        date: show.date,
        id: show.id
    }));

    const handleRemoveFavorite = (showId) => {
        // 즐겨찾기 삭제 로직 구현
        console.log(`Remove show ${showId} from favorites`);
    };

    return (
        <main id="mypage">
            <div className="mypage__inner">
                <h2 className="mypage__title">마이페이지</h2>
                
                <section className="mypage__section">
                    <div className="section__header">
                        <h3>즐겨찾기</h3>
                        <span className="count">1</span>
                    </div>
                    <div className="favorite__list">
                        {favoriteShows.map(show => (
                            <div className="favorite__item-wrapper" key={show.id}>
                                <Link to={`/detail/${show.id}`} className="favorite__item">
                                    <div className="show__image">
                                        <img src={show.image} alt={show.title} />
                                    </div>
                                    <p className="show__title">{show.title}</p>
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
    )
}

export default Mypage
