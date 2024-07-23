import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL;
const config = import.meta.env.VITE_CONFIG;

// 에러 처리 공통 함수
const handleApiError = (error, customErrorMessage) => {
  console.error(customErrorMessage, error);
  throw error;
};

// API 호출 공통 함수
const apiCall = async (method, url, data = null, params = null) => {
  try {
    const response = await axios({
      method,
      url: `${DB_URL}${url}`,
      data,
      params,
      ...config,
    });
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    handleApiError(error, `API call failed: ${method} ${url}`);
  }
};

// GET 요청 함수
export const apiGet = (url, params) => apiCall("get", url, null, params);

// POST 요청 함수
export const apiPost = (url, data) => apiCall("post", url, data);

// PUT 요청 함수
export const apiPut = (url, data) => apiCall("put", url, data);

// DELETE 요청 함수
export const apiDelete = url => apiCall("delete", url);

export { DB_URL, config };