import { EventSourcePolyfill } from 'event-source-polyfill';
import { apiGet, apiPatch, ORDER_DB_URL } from './apisCommon';
import 'event-source-polyfill';
// [ 일반 주문 페이지 ]
// ----------- 일반 주문 조회 ----------- 
export const fetchCustomerOrders = async (params) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  console.log('Query string:', queryString);
  const response = await apiGet(ORDER_DB_URL, `/order/customer-service?${queryString}`)
  return response;
}

// ----------- 일반 주문 상태 변경 ----------- 
export const updateOrderStatus = async (orderId, orderStatusCode) => {
  return await apiPatch(ORDER_DB_URL, `/order/status`, { orderId, orderStatusCode })
}

// ----------- 일반 주문 상태 일괄 변경 ----------- 
export const updateBulkOrderStatus = async (orderIds, orderStatusCode) => {
  return await apiPatch(ORDER_DB_URL, `/order/bulk-status`, { orderIds, orderStatusCode })
};

// // ----------- 일반 주문 상태별 개수 조회 ----------- 
// export const fetchOrderStatusCounts = async (customerId) => {
//   return await apiGet(ORDER_DB_URL, `/order/counts?customerId=${customerId}`)
// }

// ----------- 일반 주문 상태별 개수 실시간 조회 ----------- 
export const subscribeToOrderStatusUpdates = (customerId) => {
  const url = `${ORDER_DB_URL}/order-notification/${customerId}/subscription`;
  console.log('Connecting to SSE URL:', url);
  return new EventSourcePolyfill(url, {
    withCredentials:true
  });
}



// [ 정기 주문 페이지 ]

// ----------- 정기 주문 월별 조회 ----------- 
export const fetchRegularOrderCountsBetweenMonth = async (startDate, endDate) => {
  try {
    const params = {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
    console.log('Sending params:', params);  // 파라미터 로깅
    const response = await apiGet(ORDER_DB_URL, `/regular-order/monthly`, params);
    console.log('어떤 데이터를 보내나요?: ', response);
    return response;
  } catch (error) {
    console.error('Error fetching regular order counts:', error);
    throw error;
  }
};

// ----------- 정기 주문 상세 조회 ----------- 
export const fetchRegularOrderDetails = async (regularOrderId) => {
  try {
    const response = await apiGet(ORDER_DB_URL, `/regular-order/${regularOrderId}/detail`);
    // return response;
    return response.result;
  } catch (error) {
    console.error('Error fetching regular order details:', error);
    throw error;
  }
};








