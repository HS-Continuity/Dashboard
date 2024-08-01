import { apiGet, apiPut, apiPost, ORDER_DB_URL } from './apisCommon';

// ----------- 배송 조회 ----------- 
export const fetchDeliveries = async (params) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  console.log('Query string:', queryString);
  console.log('받는 params: ', params);
  return await apiGet(ORDER_DB_URL, `/delivery/list?${queryString}`);
};

// ----------- 배송 상태별 개수 조회 ----------- 
export const fetchDeliveryStatusCounts = async (customerId) => {
  return await apiGet(ORDER_DB_URL, `/delivery/status/counts?customerId=${customerId}`);
};