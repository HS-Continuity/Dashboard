import { apiGet, apiPost, apiPut, apiDelete, apiPatch, PRODUCT_DB_URL } from './apisCommon';

// ----------- 일반 식품 등록 ----------- 
export const registerNormalProduct = async (normalProduct, defaultImage, detailImageList) => {
  const formData = new FormData();

  // 상품 데이터를 JSON 문자열로 변환 후 추가
  // formData.append('product', JSON.stringify(normalProduct));
  formData.append('normalProduct', new Blob([JSON.stringify(normalProduct)], {
    type: 'application/json'
  }));

  // 기본 이미지 추가 (File 객체인 경우에만)
  if (defaultImage instanceof File) {
    formData.append('image', defaultImage);
  } else {
    console.error('defaultImage is not a File object');
  }
  
  // 상세 이미지 리스트 추가 (각 항목이 File 객체인 경우에만)
  detailImageList.forEach((image, index) => {
    if (image instanceof File) {
      formData.append('detailImageList', image);
    } else {
      console.error(`detailImageList[${index}] is not a File object`);
    }
  });

  for (let [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      console.log(key, 'Blob:', value.type, value.size);
    } else {
      console.log(key, value);
    }
  }

  console.log('AAA: ',Array.from(formData.entries()));

  try {
    const response = await apiPost(PRODUCT_DB_URL, '/management/product/normal', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Server response:', response);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};


// ----------- 식품 대분류 카테고리 조회 ----------- 
export const getAllCategories = async () => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/category`);
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// ----------- 특정 대분류 카테고리의 소분류 카테고리 조회 ----------- 
export const getCategoryDetails = async (categoryId) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/category/${categoryId}/detail`);
    return response;
  } catch (error) {
    console.error('Error fetching category details:', error);
    throw error;
  }
};

// ----------- 친환경 식품 등록 ----------- 
export const registerEcoFriendlyProduct = async (product, defaultImage, certificationImage, detailImageList) => {
  const formData = new FormData();

  // 상품 데이터를 JSON 문자열로 변환 후 추가
  formData.append('product', new Blob([JSON.stringify(product)], {
    type: 'application/json'
  }));

  // 기본 이미지 추가 (File 객체인 경우에만)
  if (defaultImage instanceof File) {
    formData.append('defaultImage', defaultImage);
  } else {
    console.error('defaultImage is not a File object');
  }

  // 인증서 이미지 추가
  if (certificationImage instanceof File) {
    formData.append('certificationImage', certificationImage);
  } else {
    console.error('certificationImage is not a File object');
  }

  // 상세 이미지 리스트 추가 (각 항목이 File 객체인 경우에만)
  detailImageList.forEach((image, index) => {
    if (image instanceof File) {
      formData.append('detailImageList', image);
    } else {
      console.error(`detailImageList[${index}] is not a File object`);
    }
  });

  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      console.log(key, 'Blob:', value.type, value.size);
    } else {
      console.log(key, value);
    }
  }

  console.log(Array.from(formData.entries()));

  try {
    const response = await apiPost(PRODUCT_DB_URL, '/management/product/eco-friend', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Server response:', response);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}


// ----------- 일반 식품 조회 ----------- 
export const fetchProductItems = async (params) => {
  const queryString = Object.entries({...params, isEcoFriend: 'INACTIVE' })
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  // console.log('Query string:', queryString);
  // console.log('params: ', params)
  const response = await apiGet(PRODUCT_DB_URL, `/management/product/list?${queryString}`)
  return response;
}

// ----------- 친환경 식품 조회 ----------- 
export const fetchEcoProductItems = async (params) => {
  const queryString = Object.entries({ ...params, isEcoFriend: 'ACTIVE' })
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  //console.log('Query string:', queryString);
  const response = await apiGet(PRODUCT_DB_URL, `/management/product/list?${queryString}`);
  return response;
}

// ----------- 타임세일 식품 조회 ----------- 
export const fetchTimeSaleList = async () => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/time-sale/list`);
    console.log('타임세일 보내는 데이터: ', response)
    return response;
  } catch (error) {
    console.error('Error fetching timesale list:', error);
    throw error;
  }
};

// ----------- 식품 상세 조회 ----------- 
export const fetchProductDetail = async (productId) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/management/product/${productId}/details`);
    console.log('보내는 식품 상세 데이터: ', response)
    return response;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

// ----------- 식품 상세 수정 -----------  
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiPut(PRODUCT_DB_URL, `/management/product/${productId}`, productData);
    console.log('상품 수정 응답:', response);
    return response;
  } catch (error) {
    console.error('상품 수정 중 오류 발생:', error);
    throw error;
  }
};

// ----------- 식품 상세 삭제 ----------- 
export const deleteProduct = async (productId) => {
  try {
    const response = await apiDelete(PRODUCT_DB_URL, `/management/product/${productId}`);
    console.log('상품 삭제 응답:', response);
    return response;
  } catch (error) {
    console.error('상품 삭제 중 오류 발생:', error);
    throw error;
  }
};


// ----------- 타임세일 식품 상세 조회 ----------- 
export const fetchTimeSaleDetail = async (timesaleId) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/time-sale/${timesaleId}`);
    console.log('타임세일 보내는 데이터: ', response)
    return response;
  } catch (error) {
    console.error('Error fetching timesale detail:', error);
    throw error;
  }
};


// ----------- 타임세일 식품 취소 ----------- 
export const cancelTimeSale = async (timesaleId) => {
  try {
    const response = await apiPatch(PRODUCT_DB_URL, `/time-sale/${timesaleId}/cancel`);
    console.log('타임세일 취소 응답:', response);
    return response;
  } catch (error) {
    console.error('타임세일 취소 중 오류 발생:', error);
    throw error;
  }
};


// ----------- 친환경 식품 인증서 조회 ----------- 
export const fetchProductCertification = async (productId) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/product-image/certification/${productId}`);
    console.log('인증서 보내기: ', response)
    return response;
  } catch (error) {
    console.error('Error fetching product certification:', error);
    throw error;
  }
};


// ----------- 타임세일 신청 ----------- 
export const registerTimesale = async (timesaleData) => {
  try {
    const response = await apiPost(PRODUCT_DB_URL, `/time-sale`, timesaleData);
    console.log('타임세일 신청 응답:', response);
    return response;
  } catch (error) {
    console.error('타임세일 신청 중 오류 발생:', error);
    throw error;
  }
};


// ----------- 상단 노출 신청 ----------- 
export const registerAdvertisement = async (advertisementData) => {
  try {
    const response = await apiPost(PRODUCT_DB_URL, `/advertisement/product`, advertisementData);
    console.log('상단 노출 신청 응답:', response);
    return response;
  } catch (error) {
    console.error('상단 노출 신청 중 오류 발생:', error);
    throw error;
  }
};