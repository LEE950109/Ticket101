import React, { useMemo, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarCheck } from "react-icons/fa";

const ShowCalendar = ({ events = [] }) => {
    const navigate = useNavigate();
    
    const colorMap = useMemo(() => {
        const map = new Map();
        const eventColors = [
            'var(--calendar-event1)',
            'var(--calendar-event2)',
            'var(--calendar-event3)',
            'var(--calendar-event4)',
            'var(--calendar-event5)',
            'var(--calendar-event6)',
            'var(--calendar-event7)',
            'var(--calendar-event8)',
            'var(--calendar-event9)',
            'var(--calendar-event10)'
        ];

        // performance_id를 정렬하여 항상 같은 순서로 색상 할당
        const sortedEvents = [...new Set(events.map(show => show.performance_id))].sort();
        
        sortedEvents.forEach((performanceId, index) => {
            if (!map.has(performanceId)) {
                map.set(performanceId, eventColors[index % eventColors.length]);
            }
        });

        return map;
    }, []); // 의존성 배열을 비워서 컴포넌트가 마운트될 때만 실행되도록 함

    const getEventColor = useCallback((performanceId) => {
        return colorMap.get(performanceId);
    }, [colorMap]);

    const calendarEvents = events.map(show => {
        const startDate = show.start_date ? new Date(show.start_date).toISOString().split('T')[0] : null;
        const endDate = show.end_date ? new Date(show.end_date).toISOString().split('T')[0] : null;
        const eventColor = getEventColor(show.performance_id);

        if (!startDate || !endDate) {
            console.warn('Invalid dates for show:', show.title);
            return null;
        }

        return {
            title: show.title,
            start: startDate,
            end: endDate,
            id: show.performance_id,
            backgroundColor: eventColor,
            borderColor: eventColor,
            classNames: 'custom-event',
            allDay: true
        };
    }).filter(event => event !== null);

    return (
        <section className="mypage__section">
            <div className="section__header">
                <h3>나의 공연 달력</h3>
                <FaRegCalendarCheck className="calendar-icon" />
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
                    dayMaxEvents={3}
                    eventDisplay="block"
                    displayEventEnd={false}
                    eventClick={(info) => {
                        navigate(`/detail/${info.event.id}`);
                    }}
                    moreLinkText="더보기"
                    moreLinkClick="popover"
                />
            </div>
        </section>
    );
};

export default ShowCalendar; 