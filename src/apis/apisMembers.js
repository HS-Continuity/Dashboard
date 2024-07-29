import { apiGet, MEMBER_DB_URL } from './apisCommon';

// [ 회원 조회 페이지 ]
// ----------- 회원 목록 조회 ----------- 

export const fetchStoreMembers = async (params) => {
  if (!params.customerId) {
    throw new Error('customerId is required');
  }

  const { customerId, ...queryParams } = params;

  const queryString = Object.entries(queryParams)
    .filter(([key, value]) => 
      value !== undefined && 
      value !== null && 
      value !== '' && 
      typeof value !== 'object'
    )
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  console.log('Query string:', queryString);

  try {
    const response = await apiGet(MEMBER_DB_URL, `/member-store/list/${customerId}?${queryString}`);
    console.log('Server response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching store members:', error);
    throw error;
  }
};


// ----------- 회원 배송지 목록 조회 -----------
export const fetchMemberAddresses = async (memberId, isDefault = false) => {
  console.log('서버가 받은 데이터: ', memberId)
  try {
    const response = await apiGet(MEMBER_DB_URL, `/member-address/list`, {
      memberId,
      isDefault
    });
    console.log('보내는 데이터: ', response)
    return response;
  } catch (error) {
    console.error('Error fetching member addresses:', error);
    throw error;
  }
};

// ----------- 회원 결제수단 목록 조회 -----------
export const fetchMemberPaymentCards = async (memberId, isDefault = false) => {
  try {
    const response = await apiGet(MEMBER_DB_URL, `/member-payment/list`, {
      memberId,
      isDefault
    });
    return response;
  } catch (error) {
    console.error('Error fetching member payment cards:', error);
    throw error;
  }
};