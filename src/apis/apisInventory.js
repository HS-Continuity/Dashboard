import { apiGet, apiPut, apiPost, PRODUCT_DB_URL } from './apisCommon';

// ----------- 상품별 재고 수량 합계 조회 ----------- 
export const fetchInventorySummary = async (customerId, page=0, size=10) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/inventory/summary`, {
      customerId,
      startPage: page,
      pageSize: size
    })
    console.log('보내는 상품별 재고 합계 데이터: ', response)
    return response
  } catch (error) {
    console.error('Error fetching inventory summary: ', error)
    throw error
  }
}

// ----------- 특정 상품 재고 리스트 조회 ----------- 
export const fetchProductInventories = async (productId, page=0, size=10) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL,  `/inventory/${productId}`, {
      startPage: page,
      pageSize: size
    })
    console.log('보내는 특정 상품 재고 데이터: ', response)
    return response
  } catch (error) {
    console.error('Error fetching product inventories: ', error)
    throw error;
  }
}

// ----------- 상품 재고 수량 변경 ----------- 
export const modifyProductInventory = async (productInventoryId, modifyData) => {
  try {
    const response = await apiPut(PRODUCT_DB_URL, `/inventory/${productInventoryId}`, modifyData);
    console.log('상품 재고 수량 변경 응답:', response);
    return response;
  } catch (error) {
    console.error('상품 재고 수량 변경 오류:', error);
    throw error;
  }
};

// ----------- 상품 재고 등록 ----------- 
export const registerProductInventory = async (registerData) => {
  try {
    const response = await apiPost(PRODUCT_DB_URL, `/inventory`, registerData);
    console.log('상품 재고 등록 응답:', response);
    return response;
  } catch (error) {
    console.error('상품 재고 등록 오류:', error);
    throw error;
  }
};