import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 임시 로그인 처리
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // 임시 검증 (나중에 Cognito로 교체)
        if (formData.email === 'test@test.com' && formData.password === 'password') {
            // 로그인 성공
            console.log('로그인 성공!');
            navigate('/'); // 홈으로 이동
        } else {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
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
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>
                    <button type="submit">로그인</button>
                </form>
                <div className="login__links">
                    <a href="/signin">회원가입</a>
                    <a href="/forgot-password">비밀번호 찾기</a>
                </div>
            </div>
        </div>
    );
};

export default Login;