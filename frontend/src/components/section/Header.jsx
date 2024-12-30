import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkLoginStatus, handleLogout } from '../../pages/Login'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(checkLoginStatus());

        const checkLoginState = () => {
            setIsLoggedIn(checkLoginStatus());
        };

        window.addEventListener('storage', checkLoginState);

        return () => {
            window.removeEventListener('storage', checkLoginState);
        };
    }, []);

    const onLogout = () => {
        handleLogout();
        setIsLoggedIn(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    return (
        <header id='header' role='banner'>
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
                        <li><Link to='/Search'>검색</Link></li>
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
