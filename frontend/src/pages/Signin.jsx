import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn, confirmSignUp, signOut } from 'aws-amplify/auth';

const Signin = () => {
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
            // 1. 기존 세션 정리
            try {
                await signOut();
                localStorage.removeItem('userId');
            } catch (signOutError) {
                console.log('기존 세션 정리 중 에러:', signOutError);
            }

            // 2. 인증 코드 확인
            await confirmSignUp({
                username: formData.email,
                confirmationCode: formData.verificationCode
            });
            
            console.log('인증 코드 확인 성공');

            // 3. 로그인 시도
            const signInResponse = await signIn({
                username: formData.email,
                password: formData.password
            });

            console.log('로그인 성공:', signInResponse);

            // 4. 백엔드에서 userId 가져오기
            const userResponse = await fetch('http://localhost:5002/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email
                })
            });

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                console.error('백엔드 응답:', errorText);
                throw new Error('사용자 정보를 가져오는데 실패했습니다.');
            }

            const userData = await userResponse.json();
            console.log('백엔드에서 받은 사용자 정보:', userData);
            
            // userId로 체크 (백엔드 응답 구조에 맞춤)
            if (userData.userId === undefined || userData.userId === null) {
                throw new Error('유효하지 않은 사용자 ID입니다.');
            }

            // userId 저장
            localStorage.setItem('userId', userData.userId.toString());
            console.log('저장된 userId:', localStorage.getItem('userId'));
            
            // 기본 선호도 조사 페이지로 이동 (/preferences/basic)
            alert('회원가입이 완료되었습니다. 선호도 조사를 진행해주세요.');
            navigate('/preferences/basic');  // 다시 basic으로 수정
            
        } catch (error) {
            console.error('인증/로그인 에러:', error);
            setError(error.message || '인증 과정에서 오류가 발생했습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log('회원가입 시도:', formData.email);

            const signUpResponse = await signUp({
                username: formData.email,
                password: formData.password,
                options: {
                    userAttributes: {
                        email: formData.email
                    }
                }
            });

            console.log('Cognito 응답 전체:', signUpResponse);
            console.log('Cognito userId:', signUpResponse.userId);

            // DB 저장 시도 - userSub 대신 userId 사용
            const response = await fetch('http://localhost:5002/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    cognitoId: signUpResponse.userId  // userSub -> userId로 변경
                }),
            });

            console.log('서버 응답 상태:', response.status);
            const data = await response.json();
            console.log('서버 응답 데이터:', data);
            
            if (response.ok) {
                localStorage.setItem('userId', data.userId);
                setShowVerification(true);
                console.log('인증 화면으로 전환');
            } else {
                throw new Error(data.message || '회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            alert(error.message || '회원가입에 실패했습니다.');
        }
    };
    /*
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
            setShowVerification(true);
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
*/
    return (
        <section id="signin">
            <div className="signin__inner">
                <h2>회원가입</h2>
                {error && <p className="error-message">{error}</p>}
                
                {showVerification ? (
                    <form onSubmit={handleVerification}>
                        <fieldset>
                            <legend className="blind">인증 코드 확인</legend>
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
                            <button type="submit">인증하기</button>
                        </fieldset>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <legend className="blind">회원가입 폼</legend>
                            <div className="form-group">
                                <label htmlFor="youEmail">이메일</label>
                                <input 
                                    type="email"
                                    id="youEmail"
                                    name="email"
                                    placeholder="이메일을 입력해주세요."
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="youPass">비밀번호</label>
                                <input 
                                    type="password"
                                    id="youPass"
                                    name="password"
                                    placeholder="비밀번호를 입력해주세요."
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="youPassC"></label>
                                <input 
                                    type="password"
                                    id="youPassC"
                                    name="confirmPassword"
                                    placeholder="비밀번호를 다시 한번 입력해주세요."
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit">회원가입</button>
                        </fieldset>
                    </form>
                )}

                {showVerification && (
                    <div className="verification-info">
                        <p>이메일로 전송된 인증 코드를 입력해주세요.</p>
                        <button onClick={handleSubmit} className="resend-button">코드 재전송</button>
                    </div>
                )}

                <div className="signin__footer">
                    <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
                </div>
            </div>
        </section>
    );
}

export default Signin;
