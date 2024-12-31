import { createContext, useState, useContext, useEffect } from 'react';

// Context 생성
const AuthContext = createContext(null);

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 페이지 로드 시 localStorage에서 사용자 정보 확인
        const loadUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    // 서버에서 사용자 정보 가져오기
                    const response = await fetch(`http://localhost:5002/api/users/${userId}`);
                    const userData = await response.json();
                    if (response.ok) {
                        setUser(userData);
                    } else {
                        localStorage.removeItem('userId');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('사용자 정보 로드 실패:', error);
                localStorage.removeItem('userId');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};