import axios from "axios";
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

export const fetchTimeAttackItems = async () => {
  const response = await axios.get("http://localhost:3001/timeAttack");  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

// ---- 상품 페이지 --------------------------------------------------------

// 상품 상세페이지 조회
export const fetchProductItemByItems = async (productId) => {
  const response = await axios.get(`http://localhost:3001/product`, {
    params : {
      productId : productId
    }
  });  // await: 비동기적으로 응답 기다림
  console.log('response.data라구요:',response.data)
  return response.data; // 모든 데이터 담은 배열
};

// 상품 상세페이지 수정
export const updateProduct = async (productId, updatedProduct) => {
  try {
    const response = await axios.put(`http://localhost:3001/product/${productId}`, updatedProduct);
    console.log('수정용 response.data라구요:',response.data)
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