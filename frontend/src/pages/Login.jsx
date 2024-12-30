import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tempUserData } from '../Data/tempUserData';

// 로그인 상태 확인
export const checkLoginStatus = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

// 로그인 처리
export const handleLogin = (email, password, userData) => {
    console.log('handleLogin 함수 실행:', {
        입력값검증: {
            이메일일치: email === userData.testUser.email,
            비밀번호일치: password === userData.testUser.password
        }
    });

    if (email === userData.testUser.email && password === userData.testUser.password) {
        console.log('인증 성공 - localStorage 저장');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData.testUser));
        // 로그인 상태 변경 이벤트 발생
        window.dispatchEvent(new Event('storage'));
        return true;
    }
    console.log('인증 실패');
    return false;
};

// 로그아웃 처리
export const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    // 로그아웃 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('storage'));
};

// 사용자 데이터 가져오기
export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

// 로그인 컴포넌트
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('로그인 시도:', {
            입력한이메일: formData.email,
            입력한비밀번호: formData.password,
            테스트계정: {
                이메일: tempUserData.testUser.email,
                비밀번호: tempUserData.testUser.password
            }
        });

        if (handleLogin(formData.email, formData.password, tempUserData)) {
            console.log('로그인 성공!');
            navigate('/');
        } else {
            console.log('로그인 실패: 이메일 또는 비밀번호가 일치하지 않습니다.');
            setError(`로그인 실패!\n
                입력한 정보: ${formData.email}\n
                테스트 계정 정보: ${tempUserData.testUser.email}\n
                (비밀번호는 보안상 표시하지 않습니다)`
            );
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="login">
            <div className="login__inner">
                <h2>로그인</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀호를 입력하세요"
                            required
                        />
                    </div>
                    <button type="submit">로그인</button>
                </form>
                <div className="login__links">
                    <Link to="/signin">회원가입</Link>
                    <Link to="/forgot-password">비밀번호 찾기</Link>
                </div>
            </div>
        </div>
    );
};

export default Login; 