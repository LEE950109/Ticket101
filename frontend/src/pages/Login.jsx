import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, confirmSignUp, getCurrentUser } from 'aws-amplify/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        verificationCode: ''
    });
    const [showVerification, setShowVerification] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    //수정된 부분 << 데이터 받아오는 부분이랑 error 처리 부분 다름
    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            await confirmSignUp({
                username: formData.email,
                confirmationCode: formData.verificationCode
            });
            alert('이메일 인증이 완료되었습니다. 로그인해주세요.');
            setShowVerification(false);
        } catch (error) {
            console.error('인증 에러:', error);
            setError('인증 코드가 올바르지 않습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5002/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('userId', data.userId);
                console.log('로그인 성공, userId:', data.userId);
                alert('로그인 성공!');
                navigate('/');
            } else {
                alert(data.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            alert('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div className="login">
            <div className="login__inner">
                <h2>로그인</h2>
                {error && <p className="error-message">{error}</p>}
                
                {showVerification ? (
                    <form onSubmit={handleVerification}>
                        <div className="form-group">
                            <label htmlFor="verificationCode">인증 코드</label>
                            <input
                                type="text"
                                id="verificationCode"
                                name="verificationCode"
                                value={formData.verificationCode}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    verificationCode: e.target.value
                                })}
                                placeholder="이메일로 받은 인증 코드를 입력하세요"
                                required
                            />
                        </div>
                        <button type="submit" className="login__button">
                            인증하기
                        </button>
                    </form>
                ) : (
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
                )}
                <div className="login__links">
                    <Link 
                        to="/signin" 
                        onClick={() => console.log('회원가입 링크 클릭됨')}
                    >
                        회원가입
                    </Link>
                    <Link to="/forgot-password">비밀번호 찾기</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;