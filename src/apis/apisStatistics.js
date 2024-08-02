import { apiGet, PRODUCT_DB_URL } from "./apisCommon";

// ----------- 남성 선호 상품 TOP 3 조회 -----------
export const getProductByManTop3 = async customerId => {
  return await apiGet(
    PRODUCT_DB_URL,
    `/management/ranking/gender-product?customerId=${customerId}&gender=MALE`
  );
};

// ----------- 여성 선호 상품 TOP 3 조회 -----------
export const getProductByWomanTop3 = async customerId => {
  return await apiGet(
    PRODUCT_DB_URL,
    `/management/ranking/gender-product?customerId=${customerId}&gender=FEMALE`
  );
};
