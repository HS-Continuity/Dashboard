import { apiGet, apiPatch, ORDER_DB_URL, PRODUCT_DB_URL } from './apisCommon';
import axios from 'axios';

// [ 메인 페이지 ]
// ----------- 고객 상세 정보 조회 ----------- 
export const fetchCustomerDetail = async (customerId) => {
  try {
    const response = await apiGet(PRODUCT_DB_URL, `/customer/${customerId}`);
    return response;
  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error;
  }
};

// ----------- 오늘 들어온 주문 조회 ----------- 
export const fetchTodayOrders = async (customerId) => {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  const endDate = new Date(today.setHours(23,59,59,999)).toISOString(); // 오늘 날짜의 끝
  
  const params = {
    customerId,
    startDate,
    endDate,
    page: 0,
    size: 1 // 실제 데이터는 필요 없고 총 개수만 필요하므로 1로 설정
  };
  
  try {
    const response = await apiGet(ORDER_DB_URL, '/order/customer-service', params);
    return response;
  } catch (error) {
    console.error('Error fetching today\'s orders:', error);
    throw error;
  }
};


// ----------- 고객 출고 상태별 카운팅 조회 ----------- 
export const fetchReleaseStatusCounts = async (customerId) => {
  try {
    const response = await apiGet(ORDER_DB_URL, `/release/status/counts`, { customerId });
    return response;
  } catch (error) {
    console.error('Error fetching release status counts:', error);
    throw error;
  }
};