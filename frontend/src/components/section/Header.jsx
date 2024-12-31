import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
    const { user, setUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // localStorage에서 userId 확인
                const userId = localStorage.getItem('userId');
                if (userId) {
                    // 서버에서 사용자 정보 가져오기
                    const response = await fetch(`http://localhost:5002/api/users/${userId}`);
                    const userData = await response.json();
                    if (response.ok) {
                        setUser(userData);  // AuthContext에 사용자 정보 저장
                    } else {
                        setUser(null);
                        localStorage.removeItem('userId');
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('인증 확인 에러:', error);
                setUser(null);
                localStorage.removeItem('userId');
            }
        };

        checkAuth();

        // 다른 탭에서의 로그인/로그아웃 감지
        const handleStorageChange = (e) => {
            if (e.key === 'userId') {
                if (!e.newValue) {
                    setUser(null);
                } else {
                    checkAuth();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [setUser]);

    const onLogout = async () => {
        try {
            // 로그아웃 처리
            localStorage.removeItem('userId');
            localStorage.removeItem('favorites');  // 즐겨찾기 데이터 삭제
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('로그아웃 에러:', error);
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
        <header id="header">
            <div className='header__inner'>
                <nav className='header__nav left'>
                    <ul>
                        <li>
                            <Link to='/'>
                                <img src="/로고.png" alt="Ticket101" />
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className='header__logo'>
                    <Link to='/'>
                        <img src="/로고 글씨.png" alt="Ticket101" />
                    </Link>
                </div>
                <nav className='header__nav right'>
                    <ul>
                        <div className='header__search'>
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
                        <li><Link to='/Mypage'>마이페이지</Link></li>
                        <li>
                            {user ? (
                                <Link to='/' onClick={onLogout}>로그아웃</Link>
                            ) : (
                                <Link to='/Login'>로그인</Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
