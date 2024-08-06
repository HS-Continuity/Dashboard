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
// export const fetchTop5ProductsMonthlySales = async (customerId, months) => {
//   try {
//     const params = {
//       customerId,
//       months,
//     };
//     const response = await apiGet(ORDER_DB_URL, `/order/top5-products-monthly-sales`, params);

//     // 응답이 JSON 객체인지 확인
//     const data = typeof response === 'object' ? response : await response.json();
//     console.log('서버에서 보내는 통계 데이터:', data);

//     if (!Array.isArray(data)) {
//       throw new Error('Unexpected response format');
//     }
//     return data;
//   } catch (error) {
//     console.error('Error fetching top 5 products monthly sales:', error);
//     throw error;
//   }
// };

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
// export const fetchMonthlyRevenue = async (customerId, months) => {
//   try {
//     const params = { customerId, months };
//     const response = await apiGet(ORDER_DB_URL, `/order/statistics/monthly-revenue`, params);

//     // // 응답이 JSON 객체인지 확인
//     // const data = typeof response === 'object' ? response : await response.json();
//     // console.log('서버에서 보내는 수익 데이터:', data);

//     //console.log('Monthly Revenue Data:', response);
//     return response;
//   } catch (error) {
//     console.error('Error fetching monthly revenue:', error);
//     throw error;
//   }
// };

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
// export const fetchMemberGrowth = async (customerId, months) => {
//   try {
//     const params = { customerId, months };
//     const response = await apiGet(ORDER_DB_URL, `/order/statistics/member-growth`, params);

//     // // 응답이 JSON 객체인지 확인
//     // const data = typeof response === 'object' ? response : await response.json();
//     // console.log('서버에서 보내는 회원수 데이터:', data);

//     //console.log('Member Growth Data:', response);
//     return response;
//   } catch (error) {
//     console.error('Error fetching member growth:', error);
//     throw error;
//   }
// };

export const fetchMemberGrowth = async (customerId, months) => {
  try {
    const response = await apiGet(ORDER_DB_URL, `/order/member-growth`, { customerId, months });
    return response;
  } catch (error) {
    console.error('Error fetching member growth:', error);
    throw error;
  }
};