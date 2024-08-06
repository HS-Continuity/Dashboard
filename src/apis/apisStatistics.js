import { apiGet, PRODUCT_DB_URL, ORDER_DB_URL } from "./apisCommon";
// ----------- 남성 선호 상품 TOP 3 조회 -----------
export const getProductByManTop3 = async (customerId, month) => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&gender=MALE&month=${month}`
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
export const getProductByWomanTop3 = async (customerId, month) => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&gender=FEMALE&month=${month}`
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
export const getProductByAgeRange = async (customerId, ageRange, month) => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&ageRange=${ageRange}&month=${month}`
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
export const getProductByGeneral = async (customerId, month) => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&orderType=General&month=${month}`
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
export const getProductByRegular = async (customerId, month) => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/ranking/statistics-product?customerId=${customerId}&orderType=Regular&month=${month}`
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



// --------------------------------------------------------------------------

// ----------- Top 5 상품의 월별 판매량 데이터 조회 ----------- 
export const fetchTop5ProductsMonthlySales = async (customerId, months) => {
  try {
    const response = await apiGet(ORDER_DB_URL, `/order/top5-products-monthly-sales`, { customerId, months });
    return response;
  } catch (error) {
    console.error('Error fetching top 5 products monthly sales:', error);
    throw error;
  }
};


// ----------- 월별 수익 비교 ----------- 
export const fetchMonthlyRevenue = async (customerId, months) => {
  try {
    const response = await apiGet(ORDER_DB_URL, `/order/monthly-revenue`, { customerId, months });
    return response;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw error;
  }
};


// ----------- 회원 수 추이 ----------- 
export const fetchMemberGrowth = async (customerId, months) => {
  try {
    const response = await apiGet(ORDER_DB_URL, `/order/member-growth`, { customerId, months });
    return response;
  } catch (error) {
    console.error('Error fetching member growth:', error);
    throw error;
  }
};

// ----------- 상품ID로 상품명 조회 ----------- 
export const getProductNameById = async (productId) => {
  try {
    const response = await apiGet(
      PRODUCT_DB_URL,
      `/management/product/${productId}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching product name:', error);
    throw error;
  }
};