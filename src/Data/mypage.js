import { tempUserData } from './tempUserData';

// tempUserData에서 favorites 데이터 가져오기
export const favoriteShows = tempUserData.testUser.favorites;

// 추가로 필요한 경우 upcomingShows도 export 가능
export const upcomingShows = tempUserData.testUser.upcomingShows;
