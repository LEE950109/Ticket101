import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useNavigate } from 'react-router-dom';

const ShowCalendar = ({ events }) => {
    const navigate = useNavigate();

    // events 데이터 형식 맞추기
    const calendarEvents = events.map(show => ({
        title: show.name,        // title -> name
        date: show.date,         // MongoDB의 date 필드
        id: show._id            // id -> _id
    }));

    return (
        <section className="mypage__section">
            <div className="section__header">
                <h3>나의 공연 달력</h3>
            </div>
            <div className="calendar__container">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    locale="ko"
                    events={calendarEvents}    // 변환된 이벤트 데이터 사용
                    headerToolbar={{
                        left: '',
                        center: 'title',
                        right: 'prev,next'
                    }}
                    height="auto"
                    dayMaxEvents={true}
                    eventClick={(info) => {
                        navigate(`/detail/${info.event.id}`);  // 클릭 시 상세 페이지로 이동
                    }}
                />
            </div>
        </section>
    );
};

export default ShowCalendar; 