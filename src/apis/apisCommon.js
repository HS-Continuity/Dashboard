import axios from "axios";

const ORDER_DB_URL = import.meta.env.VITE_ORDER_DB_URL;
const PRODUCT_DB_URL = import.meta.env.VITE_PRODUCT_DB_URL || "http://localhost:8020/api";
const MEMBER_DB_URL = import.meta.env.VITE_MEMBER_DB_URL;
const AUTH_DB_URL = import.meta.env.VITE_AUTH_DB_URL;
const config = import.meta.env.VITE_CONFIG;

// 에러 처리 공통 함수
const handleApiError = (error, customErrorMessage) => {
  console.error(customErrorMessage, error);
  throw error;
};

// API 호출 공통 함수
const apiCall = async (baseURL, method, url, data = null, params = null) => {
  try {
    const defaultConfig = {
      withCredentials: true,
    };

    const response = await axios({
      method,
      url: `${baseURL}${url}`,
      data,
      params,
      ...defaultConfig,
    });
    // console.log(response);
    // console.log("콘솔:",response.data.result);
    return response.data.result;
  } catch (error) {
    handleApiError(error, `API call failed: ${method} ${url}`);
  }
};

// GET 요청 함수
export const apiGet = (baseURL, url, params) => apiCall(baseURL, "get", url, null, params);

// POST 요청 함수
export const apiPost = (baseURL, url, data) => apiCall(baseURL, "post", url, data);

// PUT 요청 함수
export const apiPut = (baseURL, url, data) => apiCall(baseURL, "put", url, data);

// PATCH 요청 함수
export const apiPatch = (baseURL, url, data) => apiCall(baseURL, "patch", url, data);

// DELETE 요청 함수
export const apiDelete = (baseURL, url) => apiCall(baseURL, "delete", url);

export { ORDER_DB_URL, PRODUCT_DB_URL, MEMBER_DB_URL, AUTH_DB_URL, config };
