import axios from "axios";

const DB_URL = "http://localhost:8040/api";
const API_BASE_URL = "http://localhost:5173";

// const API_ENDPOINTS = {
//   PRODUCTS: '/product',
//   TIME_SALE: '/timeSale',
// };

//----상품 목록 조회------------------------------------------------------

// // 일반 상품 목록 조회
// export const fetchProductItems = async () => {
//   const response = await axios.get("http://localhost:3001/product",{
//     params: {
//       saleTypeCode: 1
//     }}
//   );  // await: 비동기적으로 응답 기다림
//   return response.data; // 모든 데이터 담은 배열
// };

// 친환경 상품 목록 조회
export const fetchEcoProductItems = async () => {
  const response = await axios.get("http://localhost:3001/product",{
    params: {
      saleTypeCode: 3
    }}
  );  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

// 타임세일 상품 목록 조회
export const fetchTimeAttackItems = async () => {
  const response = await axios.get("http://localhost:3001/product");  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

// -------------------------------------------------------------------------

// ---- 상품 페이지 --------------------------------------------------------

// 상품 상세페이지 조회
export const fetchProductItemByItems = async (productId) => {
  const response = await axios.get(`http://localhost:3001/product`, {
    params : {
      productId : productId
    }
  });  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

// 상품 상세페이지 수정
export const updateProduct = async (productId, updatedProduct) => {
  try {
    const response = await axios.put(`http://localhost:3001/product/${productId}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error; // 에러를 다시 던져서 호출하는 쪽에서 처리하도록 함
  }
};

// 상품 상세페이지 삭제
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`http://localhost:3001/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// 타임세일상품 상세페이지 조회
export const fetchTimeSaleProductItemByItems = async (productId) => {
  const response = await axios.get(`http://localhost:3001/timeAttack`, {
    params : {
      productId : productId
    }
  });  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

// 타임어택 상품 등록
export const addTimeAttackItems = async (newTimeAttackEntries) => {
  try {
    const response = await axios.post(`http://localhost:3001/timeAttack`, newTimeAttackEntries);
    return response.data;
  } catch (error) {
    console.error('Error adding time attack items:', error);
    throw error; // 에러를 다시 던져서 호출하는 쪽에서 처리하도록 함
  }
};

// 재고 상세페이지 조회
export const fetchProductItemByName = async (productName) => {
  const response = await axios.get(`http://localhost:3001/inventory`, {
    params : {
      productId : productName
    }
  });  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};


//----회원 목록 조회------------------------------------------------------
// 회원 목록 조회
export const fetchCustomerList = async () => {
  const response = await axios.get("http://localhost:3001/member");  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

// 회원 상세정보 조회
export const fetchCustomerListById = async (member_id) => {
  const response = await axios.get(`http://localhost:3001/member`);  // await: 비동기적으로 응답 기다림
  const member = response.data.find(m => m.member_id === member_id);
  return member ? member : null; // 회원 정보가 없으면 null 반환
};

// 회원 주소지정보 조회
export const fetchCustomerAddressListById = async (member_id) => {
  const response = await axios.get(`http://localhost:3001/address`, {
    params : {
      member_id : member_id
    }
  });  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

// 회원 결제수단정보 조회
export const fetchCustomerCardListById = async (member_id) => {
  const response = await axios.get(`http://localhost:3001/card`, {
    params : {
      member_id : member_id
    }
  });  // await: 비동기적으로 응답 기다림
  console.log('카드 정보 response.data라구요:',response.data);
  return response.data; // 모든 데이터 담은 배열
};

// 회원 상세페이지 수정
export const updateMember = async (member_id, updatedMember) => {
  try {
    const response = await axios.put(`http://localhost:3001/member/${member_id}`, updatedMember);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error; // 에러를 다시 던져서 호출하는 쪽에서 처리하도록 함
  }
};

//--------------------------------------------------------------------------------------
// 일반 주문 조회



// 일반 주문 상세 조회



// [ 정기 주문 조회 ]
const mockOrderData = [
  {
    REGULAR_DELIVERY_APPLICATION_ID: 1,
    COMPLETED_ROUNDS: 5,
    CREATED_AT: '2024-07-01',
    CYCLE: 3,
    END_DATE: '2025-01-01',
    ORDERED_PRODUCT_COUNT: 10,
    START_DATE: '2024-07-10',
    TOTAL_DELIVERY_ROUNDS: 12,
    CUSTOMER_ID: 1234567890,
    MAIN_PRODUCT_ID: 9876543210,
    REGULAR_DELIVERY_STATUS_ID: 1,
    ORDER_MEMO: 'This is a sample order memo.',
    ADDRESS: '123 Sample Street, Sample City',
    MEMBER_ID: 'sample_member',
    MEMBER_PAYMENT_CARD_ID: '1234-5678-9012-3456',
    RECIPIENT: 'John Doe',
    RECIPIENT_PHONE_NUMBER: '010-1234-5678'
  },
  {
    REGULAR_DELIVERY_APPLICATION_ID: 2,
    COMPLETED_ROUNDS: 3,
    CREATED_AT: '2024-07-01',
    CYCLE: 1,
    END_DATE: '2024-12-01',
    ORDERED_PRODUCT_COUNT: 5,
    START_DATE: '2024-07-15',
    TOTAL_DELIVERY_ROUNDS: 6,
    CUSTOMER_ID: 1234567891,
    MAIN_PRODUCT_ID: 9876543211,
    REGULAR_DELIVERY_STATUS_ID: 2,
    ORDER_MEMO: 'Another sample order memo.',
    ADDRESS: '456 Example Avenue, Example City',
    MEMBER_ID: 'example_member',
    MEMBER_PAYMENT_CARD_ID: '2345-6789-0123-4567',
    RECIPIENT: 'Jane Smith',
    RECIPIENT_PHONE_NUMBER: '010-2345-6789'
  },
  {
    REGULAR_DELIVERY_APPLICATION_ID: 3,
    COMPLETED_ROUNDS: 8,
    CREATED_AT: '2024-07-01',
    CYCLE: 2,
    END_DATE: '2025-06-01',
    ORDERED_PRODUCT_COUNT: 20,
    START_DATE: '2024-07-20',
    TOTAL_DELIVERY_ROUNDS: 15,
    CUSTOMER_ID: 1234567892,
    MAIN_PRODUCT_ID: 9876543212,
    REGULAR_DELIVERY_STATUS_ID: 3,
    ORDER_MEMO: 'This is yet another sample order memo.',
    ADDRESS: '789 Mock Street, Mock City',
    MEMBER_ID: 'mock_member',
    MEMBER_PAYMENT_CARD_ID: '3456-7890-1234-5678',
    RECIPIENT: 'Alice Johnson',
    RECIPIENT_PHONE_NUMBER: '010-3456-7890'
  }
]

export const fetchRegularOrderCountsBetweenMonth = async (startDate, endDate) => {
  try {
    console.log("Fetching data for:", startDate, "to", endDate);
    const response = await axios.get(`/api/regular-order/count`, {
      params: { 
        startDate: startDate, 
        endDate: endDate 
      },
    });
    // console.log("API response:", response);
    console.log("API response data:", response.data);
    //return response.data.result || [];  // result가 없을 경우 빈 배열 반환
    return mockOrderData.filter(order => 
      new Date(order.START_DATE) >= new Date(startDate) &&
      new Date(order.END_DATE) <= new Date(endDate)
    );
    

  } catch (error) {
    console.error('Error fetching regular order counts: ', error);
    throw error;
  }
  
};



export const fetchRegularOrderCountsBetweenMonth2 = async (thisMonth) => {
  console.log("Sending params:", { thisMonth });
  try {
    const response = await axios.get(`${DB_URL}/regular-order/count`, {
      params: { thisMonth },
    });
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};












// [ 특정 날짜의 정기 주문 조회 ]
export const fetchRegularDeliveryByDate = async (selectedDate) => {
  try {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    const response = await axios.get(`/api/regular-order/by-date/${formattedDate}`);
    return response.data.result;
  } catch (error) {
    console.error('날짜별 정기주문 조회 실패:', error);
    throw error;
  }
};

// export const fetchRegularDeliveryByDate = async (selectedDate) => {
//   const formattedDate = selectedDate.format('YYYY-MM-DD');
//   // const response = await axios.get(`http://localhost:3001/regular_delivery?start_date=${formattedDate}`);
//   // return response.data;
//   try {
//     const response = await axios.get(`http://localhost:3001/regular_delivery?start_date=${formattedDate}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching regular delivery by date:', error);
//     // 오류 메시지 출력 또는 로깅 처리 추가
//     return []; // 오류 발생 시 빈 배열 반환
//   }
// };

// 정기 주문 상세 조회
export const fetchRegularDeliveryById = async (regular_delivery_application_id) => {
  const response = await axios.get(`http://localhost:3001/regular_delivery`);  // await: 비동기적으로 응답 기다림
  const regular_delivery = response.data.find(m => m.regular_delivery_application_id === regular_delivery_application_id);
  return regular_delivery ? regular_delivery : null; // 회원 정보가 없으면 null 반환
};