import axios from "axios";

export const fetchProductItems = async () => {
  const response = await axios.get("http://localhost:3001/product");  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};

export const fetchTimeAttackItems = async () => {
  const response = await axios.get("http://localhost:3001/timeAttack");  // await: 비동기적으로 응답 기다림
  return response.data; // 모든 데이터 담은 배열
};



// export const updateProductItem = async ({ id, quantity }) => {
//   const { data: currentItem } = await axios.get(`http://localhost:3001/cart/${id}`);  // 특정 아이템 데이터 가져오기 (id: 업데이트할 데이터의 고유 식별자)
//   const updatedItem = { ...currentItem, quantity };
//   const response = await axios.put(`http://localhost:3001/cart/${id}`, updatedItem);

//   return response.data; 
// };
