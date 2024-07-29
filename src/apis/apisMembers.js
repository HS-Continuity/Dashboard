import { apiGet, MEMBER_DB_URL } from './apisCommon';

// [ 회원 조회 페이지 ]
// ----------- 회원 목록 조회 ----------- 
export const fetchStoreMembers = async (customerId, startPage = 0, pageSize = 10) => {
  try {
    const params ={
      //customerId,
      startPage,
      pageSize
    };

    const response = await apiGet(MEMBER_DB_URL, `/member-store/list/${customerId}`,params);
  
    console.log('어떤 데이터를 보내나요?: ', response);
    return response;
  } catch (error) {
    console.error('Error fetching customer members:', error);
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