import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
//import kakaoLogo from "../../assets/images/kakao_icon.png";
//import googleLogo from "../../assets/images/google_icon.png";
//import naverLogo from "../../assets/images/naver_icon.png";
import { handleSocialLogin } from '../../apis/apisLogIn';
import useAuthStore from '../../stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

const LoginPage = () => {
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" , roleType : "ROLE_CUSTOMER"});
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [touched, setTouched] = useState({ username: false, password: false });

  const login = useAuthStore(state => state.login);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      if (data) {
        // login 함수가 true를 반환했을 때만 성공으로 처리
        message.success("로그인 성공!");
        navigate('/');
      } else {
        message.error("로그인에 실패했습니다.");
      }
    },
    onError: error => {
      console.error("Login error:", error);
      if (error.response && error.response.status === 401) {
        message.error("아이디와 비밀번호가 일치하지 않습니다.");
      } else {
        message.error("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    },
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, loginData[name]);
  };

  const validateField = (fieldName, value) => {
    let errorMessage = "";
    if (value.trim() === "") {
      errorMessage = `${fieldName === "username" ? "아이디" : "비밀번호"}를 입력해주세요.`;
    }
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      try {
        await loginMutation.mutateAsync(loginData);
      } catch (error) {
        // 오류는 mutation의 onError에서 처리
      }
    } else {
      message.error("아이디와 비밀번호를 모두 입력해주세요.");
    }
  };

  const isFormValid = () => {
    return Object.keys(loginData).every(key => loginData[key]);
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
                name="username"
                type="text"
                placeholder="hyosungsquare"
                value={loginData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                비밀번호*
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호(8-12자리, 영문,숫자,특수문자 조합)"
                value={loginData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                {/* <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> */}
                <span className="ml-2 text-sm text-gray-600">아이디 저장</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">비밀번호 찾기</a>
            </div>
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              // disabled={isLoading}
              disabled={loginMutation.isLoading || !isFormValid()
              }
            >
              {/* 로그인 */}
              {loginMutation.isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center">
           
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