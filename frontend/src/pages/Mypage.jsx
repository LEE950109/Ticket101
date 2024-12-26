import React from 'react'
import { Link } from 'react-router-dom'

const Mypage = () => {
    // 즐겨찾기한 공연 목록 (예시 데이터)
    const favoriteShows = [
        { id: "r1", title: "뮤지컬 라이온킹", image: "https://picsum.photos/200/280?random=1" },
        { id: "r2", title: "뮤지컬 위키드", image: "https://picsum.photos/200/280?random=2" },
    ];

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
                            <Link to={`/detail/${show.id}`} key={show.id} className="favorite__item">
                                <div className="show__image">
                                    <img src={show.image} alt={show.title} />
                                </div>
                                <p className="show__title">{show.title}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mypage__section">
                    <div className="section__header">
                        <h3>캘린더</h3>
                    </div>
                    <div className="calendar__container">
                        {/* 캘린더 컴포넌트 추가 예정 */}
                        <p className="placeholder">캘린더가 들어갈 자리입니다.</p>
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
