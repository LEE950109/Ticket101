import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, getCurrentUser } from '@aws-amplify/auth';
import { jwtDecode } from 'jwt-decode'; // JWT 디코딩 라이브러리

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
        checkAuth();
    }, []);
    
    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
            return decodedToken.exp < currentTime; // 만료 여부 반환
        } catch (error) {
            console.error('토큰 디코딩 실패:', error);
            return true; // 디코딩 실패 시 만료된 것으로 간주
        }
    };

    const checkAuth = async () => {
        try {
            // 세션 스토리지 확인
            const idToken = sessionStorage.getItem('idToken');
            if (!idToken || isTokenExpired(idToken)) {
                console.log('세션 스토리지가 없거나 토큰이 만료되었습니다.');
                
                if (!sessionStorage.getItem('logoutTriggered')) {
                    sessionStorage.setItem('logoutTriggered', 'true'); // 로그아웃 플래그 설정
                    handleLogout(); // 만료된 경우 로그아웃 처리
                }
                return;
            }
            
            // Amplify 인증 확인
            await getCurrentUser();
            setIsAuthenticated(true);
        } catch (error) {
            console.error('로그인 상태 확인 실패:', error);
            setIsAuthenticated(false);
        }
    };
    
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         console.log('사용자가 로그인 상태입니다. UI를 업데이트합니다.');
    //         // 인증 상태가 변경된 후 추가 작업을 여기에 작성
    //     } else {
    //         console.log('사용자가 로그아웃 상태입니다.');
    //     }
    // }, [isAuthenticated]); // isAuthenticated 상태 변경을 감지

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlHeader);

        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, [lastScrollY]);

    const handleLogout = async () => {
        try {
            await signOut();
            sessionStorage.clear(); // 세션 스토리지 초기화\
            sessionStorage.setItem('logoutTriggered', 'false'); // 로그아웃 플래그 초기화
            setIsAuthenticated(false);
            // window.location.href = '/';
            navigate('/');
            window.location.reload();
            
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <header id="header" className={`${isVisible ? '' : 'header-hidden'}`}>
            <div className="header__inner">
                <nav className="header__nav left">
                    <ul>
                        <li>
                            <Link to="/">
                                <img src="/로고.png" alt="Ticket101" />
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="header__logo">
                    <Link to="/">
                        <img src="/로고 글씨.png" alt="Ticket101" />
                    </Link>
                </div>
                <nav className="header__nav right">
                    <ul>
                        <div className="header__search">
                            <form onSubmit={handleSearch}>
                                <div className="search-input-wrapper">
                                    <span className="search-icon"></span>
                                    <input
                                        type="search"
                                        placeholder="공연을 검색하세요"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                        <li><Link to="/Mypage">마이페이지</Link></li>
                        <li>
                            {isAuthenticated ? (
                                <button className="logout-btn" onClick={handleLogout}>
                                    로그아웃
                                </button>
                            ) : (
                                <Link to="/Login">로그인</Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
