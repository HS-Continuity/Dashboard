import { apiGet, apiPatch, ORDER_DB_URL } from './apisCommon';

// [ 일반 주문 페이지 ]
// ----------- 일반 주문 조회 ----------- 
export const fetchCustomerOrders = async(customerId, orderStatus, page = 0, size = 10) => {
  try {
    const params = {
      customerId,
      orderStatus,
      page,
      size
    };
    const response = await apiGet(ORDER_DB_URL, `/order/customer-service`,  params);
    console.log("어떤 데이터를 보내나요?: ", response)
    return response;
  
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};


// ----------- 일반 주문 - 단건 주문 상태변경 요청 ----------- 
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await apiPatch(ORDER_DB_URL, `/order/status`, {
      orderId: orderId[0],
      orderStatusCode: newStatus
    });
    return response;
  } catch (error) {
    console.log(typeof(orderId));
    console.log('Error updating order status: ', error);
    throw error;
  }
};

// ----------- 일반 주문 - 다건 주문 상태변경 요청 ----------- 
export const updateBulkOrderStatus = async (orderIds, newStatus) => {
  try {
    const response = await apiPatch(ORDER_DB_URL, `/order/bulk-status`, {
      orderIds,
      orderStatusCode: newStatus
    });
    return response;
  } catch (error) {
    console.log(typeof(orderIds));
    console.log('Error updating order status: ', error);
    throw error;
  }
};


// [ 정기 주문 페이지 ]

// ----------- 정기 주문 월별 조회 ----------- 
export const fetchRegularOrderCountsBetweenMonth = async (startDate, endDate) => {
  try {
    const params = {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      //customerId: customerId
    };
    console.log('Sending params:', params);  // 파라미터 로깅
    const response = await apiGet(ORDER_DB_URL, `/regular-order/count`, params);
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

// [get] 정기주문 상세 조회
// export const fetchOrderDetailsById = async (REGULAR_DELIVERY_APPLICATION_ID) => {
//   console.log("Fetching order details for id:", REGULAR_DELIVERY_APPLICATION_ID);
  
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const order = mockOrderData.find(order => order.REGULAR_DELIVERY_APPLICATION_ID === parseInt(REGULAR_DELIVERY_APPLICATION_ID));
      
//       if (!order) {
//         reject(new Error('Order not found'));
//       } else {
//         console.log("Found order:", order);
//         resolve(order);
//       }
//     }, 1000); // 1초 지연
//   });
// };


// [ 출고 페이지 ]
// 1. 고객 출고 조회
export const fetchReleases = async (customerId, releaseStatus, page, size) => {
  const params = { customerId, releaseStatus, page, size };
  return await apiGet(ORDER_DB_URL,`/release/list`, params);
};

// 2. 출고 메모 업데이트
export const updateReleaseMemo = async (releaseId, memo) => {
  const data = { orderId: releaseId, memo };
  return await apiPatch(ORDER_DB_URL,`/release/memo`, data);
}





