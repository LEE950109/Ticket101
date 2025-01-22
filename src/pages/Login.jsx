import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';


const poolData = {
    UserPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID || 'default-user-pool-id',
    ClientId: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID || 'default-client-id',
};

const userPool = new CognitoUserPool(poolData);

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 브라우저 닫힐 때 세션 스토리지 초기화
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.clear();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('이메일과 비밀번호를 입력하세요.');
            return;
        }

        const authenticationDetails = new AuthenticationDetails({
            Username: formData.email,
            Password: formData.password,
        });

        const cognitoUser = new CognitoUser({
            Username: formData.email,
            Pool: userPool,
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const idToken = result.getIdToken().getJwtToken();
                
                if (isTokenExpired(idToken)) {
                    console.error('로그인 실패: 받은 토큰이 만료되었습니다.');
                    setError('로그인 실패: 받은 토큰이 만료되었습니다.');
                    return;
                }

                console.log('로그인 성공:', idToken);
                sessionStorage.setItem('idToken', idToken);
                sessionStorage.setItem('email', formData.email);

                login({ email: formData.email, idToken });

                navigate('/', { replace: true });
                setTimeout(() => {
                    window.location.reload(); // 딜레이 후 새로고침
                  }, 100); // 100ms 딜레이

            },
            onFailure: (err) => {
                console.error('로그인 실패:', err);
                setError(err.message || '로그인에 실패했습니다.');
            },
        });
    };

    return (
        <div className="login">
            <div className="login__inner">
                <h2>로그인</h2>
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

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
                    <button type="submit" className="login__button">로그인</button>
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
