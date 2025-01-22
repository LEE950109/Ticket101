import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Hub } from '@aws-amplify/core';
import { 
    getCurrentUser,
    fetchUserAttributes,
    signOut,
    signIn,
    signUp
} from '@aws-amplify/auth';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();

        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            switch (payload.event) {
                case 'signIn':
                    checkUser();
                    break;
                case 'signOut':
                    handleSignOut();
                    break;
                default:
                    break;
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);
    
    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
            return decodedToken.exp < currentTime; // 만료되었으면 true 반환
        } catch (error) {
            console.error('JWT 디코딩 실패:', error);
            return true; // 디코딩 실패 시 만료된 것으로 간주
        }
    };

    const checkUser = async () => {
        try {
            const idToken = sessionStorage.getItem('idToken');
            if (!idToken || isTokenExpired(idToken)) {
                console.log('토큰이 만료되었습니다. 세션을 초기화합니다.');
                handleSignOut(); // 토큰 만료 시 로그아웃 처리
                return;
            }

            const userAttributes = await fetchUserAttributes();
            setUser(userAttributes);
        } catch (error) {
            console.error('User check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        setUser(null);
        sessionStorage.clear(); // 세션 초기화
    };

    const login = async (username, password) => {
        try {
            const user = await signIn({ username, password });
            const idToken = user.signInUserSession.idToken.jwtToken;

            if (isTokenExpired(idToken)) {
                console.error('받은 토큰이 이미 만료되었습니다.');
                throw new Error('로그인 실패: 토큰이 만료되었습니다.');
            }

            sessionStorage.setItem('idToken', idToken); // 세션 스토리지에 토큰 저장
            setUser(user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut();
            handleSignOut();
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const register = async (username, password, email) => {
        try {
            await signUp({
                username,
                password,
                attributes: {
                    email
                }
            });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };
    
    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
