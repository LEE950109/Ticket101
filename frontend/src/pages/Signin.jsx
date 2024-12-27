import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from 'aws-amplify/auth';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
    });
    const [error, setError] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            await confirmSignUp({
                username: formData.email,
                confirmationCode: formData.verificationCode
            });
            alert('이메일 인증이 완료되었습니다. 로그인해주세요.');
            navigate('/login');
        } catch (error) {
            console.error('인증 에러:', error);
            setError('인증 코드가 올바르지 않습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('폼 제출 시작');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            console.log('회원가입 시도 중...');
            const { user } = await signUp({
                username: formData.email,
                password: formData.password,
                attributes: {
                    email: formData.email
                }
            });
            
            console.log('회원가입 성공:', user);
            setShowVerification(true); // 회원가입 성공 시 인증 코드 입력 폼 표시
            setError('');
            
        } catch (error) {
            console.error('회원가입 에러:', error);
            switch (error.code) {
                case 'UsernameExistsException':
                    setError('이미 존재하는 이메일입니다.');
                    break;
                case 'InvalidPasswordException':
                    setError('비밀번호는 8자 이상이어야 하며, 숫자, 특수문자, 대문자를 포함해야 합니다.');
                    break;
                case 'InvalidParameterException':
                    setError('입력하신 정보가 유효하지 않습니다.');
                    break;
                default:
                    setError(`회원가입 중 오류가 발생했습니다: ${error.message}`);
            }
        }
    };

    return (
        <div className="signin">
            <div className="signin__inner">
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
                        <button type="submit" className="signin__button">
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
                        <button 
                            type="submit" 
                            className="signin__button"
                            onClick={(e) => {
                                console.log('회원가입 버튼 클릭됨');
                                handleSubmit(e);
                            }}
                        >
                            회원가입
                        </button>
                    </form>
                )}
            </div>
            
            {showVerification && (
                <div className="verification-help">
                    <p>이메일로 전송된 인증 코드를 입력해주세요.</p>
                    <p>인증 코드를 받지 못하셨나요? <button onClick={() => handleSubmit}>코드 재전송</button></p>
                </div>
            )}
        </div>
    );
};

export default SignIn;
