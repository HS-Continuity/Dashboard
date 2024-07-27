import { apiGet, apiPost, PRODUCT_DB_URL } from './apisCommon';

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