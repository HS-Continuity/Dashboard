import { apiGet, apiPatch, ORDER_DB_URL } from './apisCommon';

// 고객 출고 조회
export const fetchReleases = async (params) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  console.log('Query string:', queryString);
  return await apiGet(ORDER_DB_URL, `/release/list?${queryString}`);
};

// 배송시작일 설정
export const updateDeliveryDate = async (orderId, startDeliveryDate) => {
  return await apiPatch(ORDER_DB_URL, `/release/deliveryDate`, { orderId, startDeliveryDate });
};

// 출고 메모 작성
export const updateReleaseMemo = async (orderId, memo) => {
  console.log('sending memo data: ', {orderId, memo});
  return await apiPatch(ORDER_DB_URL, `/release/memo`, { orderId, memo });
};

// 출고 보류 사유 작성
export const updateReleaseHoldReason = async (orderId, memo) => {
  return await apiPatch(ORDER_DB_URL, `/release/hold-memo`, { orderId, memo });
};

// 출고 상태 변경
export const updateReleaseStatus = async (orderId, releaseStatusCode) => {
  return await apiPatch(ORDER_DB_URL, `/release/status`, { orderId, releaseStatusCode });
};

// 출고 상태 일괄 변경
export const updateBulkReleaseStatus = async (orderIds, releaseStatusCode) => {
  return await apiPatch(ORDER_DB_URL, `/release/bulk-status`, { orderIds, releaseStatusCode });
};

// 합포장 요청
export const requestCombinedPackaging = async (orderIds) => {
  return await apiPatch(ORDER_DB_URL, `/release/combined-packaging`, { orderIds, releaseStatusCode: 'COMBINED_PACKAGING_COMPLETED' });
};