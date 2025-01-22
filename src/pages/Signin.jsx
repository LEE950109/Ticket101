import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp, signIn, signOut } from 'aws-amplify/auth';
import { useAuth } from '../context/AuthContext';

const Signin = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
    });
    const [showVerification, setShowVerification] = useState(false);
    const [error, setError] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            // 기존 세션 정리
            try {
                await signOut({ global: true });
            } catch (signOutError) {
                console.log('기존 세션 정리 중:', signOutError);
            }

            // 이메일 인증
            await confirmSignUp({
                username: tempEmail,
                confirmationCode: formData.verificationCode
            });

            // 새로운 로그인 시도
            const signInResponse = await signIn({
                username: tempEmail,
                password: formData.password
            });

            // // 사용자 정보 저장


            // console.log('signIn의 userId 확인:', userInfo);

            
            
            alert('이메일 인증이 완료되었습니다.');
            navigate('/preferences/basic');

        } catch (error) {
            console.error('인증/로그인 에러:', error);
            if (error.code === 'CodeMismatchException') {
                setError('잘못된 인증 코드입니다. 다시 확인해주세요.');
            } else if (error.code === 'NotAuthorizedException') {
                setError('인증에 실패했습니다. 다시 시도해주세요.');
            } else {
                setError('인증 과정에서 오류가 발생했습니다: ' + error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            setTempEmail(formData.email);
            
            const signUpResponse = await signUp({
                username: formData.email,
                password: formData.password,
                attributes: {
                    email: formData.email
                }
            });

            console.log('회원가입 성공:', signUpResponse);
            
            const userInfo = {
                // email: tempEmail,
                sub: signUpResponse.userId
            };
            console.log('유저 Id 확인', userInfo);
            
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setUser(userInfo);

            setShowVerification(true);
            setError('이메일로 전송된 인증 코드를 입력해주세요.');
        } catch (error) {
            console.error('회원가입 에러:', error);
            if (error.code === 'UsernameExistsException') {
                setError('이미 등록된 이메일입니다.');
            } else if (error.code === 'InvalidPasswordException') {
                setError('비밀번호는 최소 8자 이상이어야 하며, 숫자와 특수문자를 포함해야 합니다.');
            } else {
                setError('회원가입 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="login">
            <div className="login__inner">
                <h2>회원가입</h2>
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
                                onChange={handleChange}
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
                        <div className="form-group">
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="비밀번호를 다시 입력하세요"
                                required
                            />
                        </div>
                        <button type="submit">회원가입</button>
                    </form>
                )}
                <div className="login__links">
                    <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
                </div>
            </div>
        </div>
    );
};

export default Signin;
