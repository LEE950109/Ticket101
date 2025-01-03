import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, signOut } from 'aws-amplify/auth'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setIsLoggedIn(true);
                    localStorage.setItem('isLoggedIn', 'true');
                } else {
                    setIsLoggedIn(false);
                    localStorage.removeItem('isLoggedIn');
                }
            } catch (error) {
                setIsLoggedIn(false);
                localStorage.removeItem('isLoggedIn');
            }
        };

        checkAuth();

        const handleStorageChange = () => {
            const isLoggedInStorage = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(isLoggedInStorage);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const onLogout = async () => {
        try {
            await signOut();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            setIsLoggedIn(false);
            window.dispatchEvent(new Event('storage'));
            navigate('/');
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(''); // 검색 후 입력창 초기화
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
                            {isLoggedIn ? (
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
