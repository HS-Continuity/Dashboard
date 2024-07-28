import { apiGet, apiPatch, ORDER_DB_URL } from './apisCommon';

// // ----------- 출고 조회 ----------- 
// export const fetchReleases = async(joinForm) => {
//   try {
//     const params = {
//       customerId,
//       page,
//       size
//     };
//     const response = await apiGet(ORDER_DB_URL, `/release/list`, params);
//     console.log("어떤 데이터를 보내나요?: ", response)

//     return response;
  
//   } catch (error) {
//     console.error('Error fetching customer orders:', error);
//     throw error;
//   }
// };

// export const fetchCustomerTargetStatusShipments = async(customerId, releaseStatus, page = 0, size = 10) => {
//   try {
//     const params = {
//       customerId,
//       releaseStatus,
//       page,
//       size
//     };
//     const response = await apiGet(ORDER_DB_URL, `/release/list`, params);
//     console.log("어떤 데이터를 보내나요?: ", response)

//     return response;
  
//   } catch (error) {
//     console.error('Error fetching customer orders:', error);
//     throw error;
//   }
// };

// // 2. 출고 메모 업데이트
// export const updateReleaseMemo = async (releaseId, memo) => {
//   const data = { orderId: releaseId, memo };
//   return await apiPatch(ORDER_DB_URL,`/release/memo`, data);
// }

// // 3. 보류 메모 업데이트
// export const updateReleaseHoldReason = async (releaseId, holdReason) => {
//   const data = { orderId: releaseId, memo: holdReason };
//   return await apiPatch(ORDER_DB_URL, `/release/hold-memo`, data);
// }



// 고객 출고 조회
export const fetchReleases = async (params) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return await apiGet(ORDER_DB_URL, `/release/list?${queryString}`);
};

// 배송시작일 설정
export const updateDeliveryDate = async (orderId, startDeliveryDate) => {
  return await apiPatch(ORDER_DB_URL, `/release/deliveryDate`, { orderId, startDeliveryDate });
};

// 출고 메모 작성
export const updateReleaseMemo = async (orderId, memo) => {
  return await apiPatch(ORDER_DB_URL, `/release/memo`, { orderId, memo });
};

// 출고 보류 사유 작성
export const updateReleaseHoldReason = async (orderId, holdReason) => {
  return await apiPatch(ORDER_DB_URL, `/release/hold-memo`, { orderId, holdReason });
};

// 출고 상태 변경
export const updateReleaseStatus = async (orderId, releaseStatus) => {
  return await apiPatch(ORDER_DB_URL, `/release/status`, { orderId, releaseStatusCode: releaseStatus });
};

// 출고 상태 일괄 변경
export const updateBulkReleaseStatus = async (orderIds, releaseStatus) => {
  return await apiPatch(ORDER_DB_URL, `/release/bulk-status`, { orderIds, releaseStatusCode: releaseStatus });
};

// 합포장 요청
export const requestCombinedPackaging = async (orderIds) => {
  return await apiPatch(ORDER_DB_URL, `/release/combined-packaging`, { orderIds, releaseStatusCode: 'COMBINED_PACKAGING_COMPLETED' });
};