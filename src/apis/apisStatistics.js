import { apiGet, PRODUCT_DB_URL } from "./apisCommon";

// ----------- 남성 선호 상품 TOP 3 조회 -----------
export const getProductByManTop3 = async customerId => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/gender-product?customerId=${customerId}&gender=MALE`
    );
    console.log("API Response:", response); // 응답 로그 추가
    if (Array.isArray(response)) {
      return response; // 직접 배열 반환
    } else {
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error("Error in getProductByManTop3:", error);
    throw error; // 오류를 다시 throw하여 상위 호출자가 처리할 수 있게 함
  }
};

// ----------- 여성 선호 상품 TOP 3 조회 -----------
export const getProductByWomanTop3 = async customerId => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/gender-product?customerId=${customerId}&gender=FEMALE`
    );
    console.log("API Response:", response); // 응답 로그 추가
    if (Array.isArray(response)) {
      return response; // 직접 배열 반환
    } else {
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error("Error in getProductByManTop3:", error);
    throw error; // 오류를 다시 throw하여 상위 호출자가 처리할 수 있게 함
  }
};
