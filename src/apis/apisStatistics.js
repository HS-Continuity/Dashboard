import { apiGet, PRODUCT_DB_URL } from "./apisCommon";

// ----------- 남성 선호 상품 TOP 3 조회 -----------
export const getProductByManTop3 = async customerId => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&gender=MALE`
    );
    console.log("API Response:", response);
    if (Array.isArray(response)) {
      return response;
    } else {
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error("Error in getProductByManTop3:", error);
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
    console.log("API Response:", response);
    if (Array.isArray(response)) {
      return response;
    } else {
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error("Error in getProductByManTop3:", error);
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
    console.log("API Full Response:", response);

    if (Array.isArray(response)) {
      return response;
    } else {
      console.error("API Response is invalid: ", response);
      throw new Error(`Invalid API response: Expected an array, but got ${typeof response}`);
    }
  } catch (error) {
    console.error("Error in getProductByAgeRange:", error);
    throw error;
  }
};
