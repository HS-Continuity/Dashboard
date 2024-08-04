import { apiGet, PRODUCT_DB_URL } from "./apisCommon";
// ----------- 남성 선호 상품 TOP 3 조회 -----------
export const getProductByManTop3 = async customerId => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&gender=MALE`
    );
    if (Array.isArray(response)) {
      return response;
    } else {
      throw new Error("유효하지 않은 API 응답입니다.");
    }
  } catch (error) {
    throw error;
  }
};

// ----------- 여성 선호 상품 TOP 3 조회 -----------
export const getProductByWomanTop3 = async customerId => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&gender=FEMALE`
    );
    if (Array.isArray(response)) {
      return response;
    } else {
      throw new Error("유효하지 않은 API 응답입니다.");
    }
  } catch (error) {
    throw error;
  }
};

// ----------- 연령별 선호 상품 조회 -----------
export const getProductByAgeRange = async (customerId, ageRange) => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&ageRange=${ageRange}`
    );
    if (Array.isArray(response)) {
      return response;
    } else {
      throw new Error("유효하지 않은 API 응답입니다.");
    }
  } catch (error) {
    throw error;
  }
};

// ----------- 일반구매 상품 조회 -----------
export const getProductByGeneral = async customerId => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&orderType=General`
    );
    if (Array.isArray(response)) {
      return response;
    } else {
      throw new Error("유효하지 않은 API 응답입니다.");
    }
  } catch (error) {
    throw error;
  }
};

// ----------- 정기구매 상품 조회 -----------
export const getProductByRegular = async customerId => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&orderType=Regular`
    );
    if (Array.isArray(response)) {
      return response;
    } else {
      throw new Error("유효하지 않은 API 응답입니다.");
    }
  } catch (error) {
    throw error;
  }
};
