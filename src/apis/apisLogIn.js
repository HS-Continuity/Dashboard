import { apiPost, AUTH_DB_URL } from "./apisCommon";

// ----------- 일반 로그인 ----------- 
export const login = async (username, password) => {
  try {
    const response = await apiPost(AUTH_DB_URL, `/api/auth/login`, { username, password })
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// // ----------- 소셜 로그인 URL ----------- 
// const SOCIAL_LOGIN_URLS = {
//   google: `http://localhost:8010/oauth2/authorization/google`,
//   kakao: `http://localhost:8010/oauth2/authorization/kakao`,
//   naver: `http://localhost:8010/oauth2/authorization/naver`
// };

// ----------- 소셜 로그인 Redirect ----------- 
export const handleSocialLogin = (provider) => {
  window.location.href = `${AUTH_DB_URL}/oauth2/authorization/${provider}`;
};