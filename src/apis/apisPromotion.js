import { apiGet, PRODUCT_DB_URL } from './apisCommon';

// ----------- 상단 노출 신청 내역 조회 -----------
export const fetchAdvertisements = async (params) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, '/advertisement/list', params);
    console.log('보내는 상단 노출 내역 데이터: ', response)
    return response;
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }
};