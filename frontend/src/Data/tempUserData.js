export const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn === 'true';
};

export const getUserData = () => {
    return tempUserData.testUser;
};

export const tempUserData = {
    testUser: {
        email: 'test@test.com',
        password: '123456',
        nickname: '테스트계정'
    }
}; 