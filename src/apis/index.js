import axios from "axios";

// const API_ENDPOINTS = {
//   PRODUCTS: '/product',
//   TIME_SALE: '/timeSale',
// };

//----상품 목록 조회------------------------------------------------------

// 일반 상품 목록 조회
export const fetchProductItems = async () => {
  const response = await axios.get("http://localhost:3001/product",{
    params: {
      saleTypeCode: 1
    }}
  );  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

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


//----주소지 목록 조회------------------------------------------------------
