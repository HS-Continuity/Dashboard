import { login } from '../../apis/apisLogIn';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import kakaoLogo from "../../assets/images/kakao_icon.png";
import googleLogo from "../../assets/images/google_icon.png";
import naverLogo from "../../assets/images/naver_icon.png";
import { handleSocialLogin } from '../../apis/apisLogIn';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const socialLogins = [
    { name: "kakao", icon: kakaoLogo, url: "http://localhost:8010/oauth2/authorization/kakao" },
    { name: "google", icon: googleLogo, url: "http://localhost:8010/oauth2/authorization/google" },
    { name: "naver", icon: naverLogo, url: "http://localhost:8010/oauth2/authorization/naver" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log("login정보:", username, password)
    try {
      const response = await login(username, password);
      console.log('Login successful', response);
      // 로그인 성공 시 메인 페이지로 리다이렉트
      navigate(`/`);
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* 왼쪽 로그인 섹션 */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-3/4 max-w-md">
          <h1 className="text-4xl font-bold text-[#3B3F68] mb-2">연이음</h1>
          <p className="text-sm text-gray-500 mb-8">배송 사업의 모든 과정을 한 번에!</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                아이디*
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="username"
                type="text"
                placeholder="hyosungsquare"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                비밀번호*
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="password"
                type="password"
                placeholder="비밀번호(8-12자리, 영문,숫자,특수문자 조합)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">아이디 저장</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">비밀번호 찾기</a>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {/* 로그인 */}
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {socialLogins.map(social => (
              <button 
                key={social.name} 
                className='h-12 w-12 overflow-hidden rounded-full m-2'
                onClick={() => handleSocialLogin(social.name)}
              >
                <img
                  src={social.icon}
                  alt={`${social.name} login`}
                  className='h-full w-full object-cover'
                />
              </button>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
              아직 아이디가 없으신가요? 효성CMS+ 스퀘어에 계정만들기
            </a>
          </div>
        </div>
      </div>

      {/* 오른쪽 이미지 섹션 */}
      <div className="w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        {/* 로고? */}
      </div>
    </div>
  );
};

export default LoginPage;