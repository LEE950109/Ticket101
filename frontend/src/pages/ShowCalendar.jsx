import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const ShowCalendar = ({ events }) => {
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
                    events={events}
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
    );
};

export default ShowCalendar; 