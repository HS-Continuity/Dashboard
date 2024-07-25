import { apiGet, MEMBER_DB_URL } from './apisCommon';

export const fetchMembers = async (memberId) => {
  try {
    const response = await apiGet(MEMBER_DB_URL, `/member`);
    return response;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};
