import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header id='header' role='banner'>
            <div className='header__inner'>
                <nav className='header__nav left'>
                    <ul>
                        <li><Link to='/'>Ticket101</Link></li>
                    </ul>
                </nav>
                <div className='header__logo'>
                    <Link to='/'>
                        <img src="/검은배경 로고(전체).png" alt="Ticket101" />
                    </Link>
                </div>
                <nav className='header__nav right'>
                    <ul>
                        <li><Link to='/Search'>검색</Link></li>
                        <li><Link to='/Mypage'>마이페이지</Link></li>
                        <li><Link to='/Login'>로그인</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
