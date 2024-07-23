import { apiGet } from './apisCommon';
import axios from "axios";

const DB_URL = "http://localhost:8040/api";

// [ 정기 주문 조회 ]
const mockOrderData = [
  {
    REGULAR_DELIVERY_APPLICATION_ID: 1000,
    COMPLETED_ROUNDS: 5,
    CREATED_AT: '2024-07-01',
    CYCLE: 3,
    END_DATE: '2025-01-01',
    ORDERED_PRODUCT_COUNT: 10,
    START_DATE: '2024-07-10',
    TOTAL_DELIVERY_ROUNDS: 12,
    CUSTOMER_ID: 1234567890,
    MAIN_PRODUCT_ID: 9876543210,
    REGULAR_DELIVERY_STATUS_ID: 1,
    ORDER_MEMO: 'This is a sample order memo.',
    ADDRESS: '123 Sample Street, Sample City',
    MEMBER_ID: 'sample_member',
    MEMBER_PAYMENT_CARD_ID: '1234-5678-9012-3456',
    RECIPIENT: 'John Doe',
    RECIPIENT_PHONE_NUMBER: '010-1234-5678'
  },
  {
    REGULAR_DELIVERY_APPLICATION_ID: 2000,
    COMPLETED_ROUNDS: 3,
    CREATED_AT: '2024-07-01',
    CYCLE: 1,
    END_DATE: '2024-12-01',
    ORDERED_PRODUCT_COUNT: 5,
    START_DATE: '2024-07-15',
    TOTAL_DELIVERY_ROUNDS: 6,
    CUSTOMER_ID: 1234567891,
    MAIN_PRODUCT_ID: 9876543211,
    REGULAR_DELIVERY_STATUS_ID: 2,
    ORDER_MEMO: 'Another sample order memo.',
    ADDRESS: '456 Example Avenue, Example City',
    MEMBER_ID: 'example_member',
    MEMBER_PAYMENT_CARD_ID: '2345-6789-0123-4567',
    RECIPIENT: 'Jane Smith',
    RECIPIENT_PHONE_NUMBER: '010-2345-6789'
  },
  {
    REGULAR_DELIVERY_APPLICATION_ID: 3000,
    COMPLETED_ROUNDS: 8,
    CREATED_AT: '2024-07-01',
    CYCLE: 2,
    END_DATE: '2025-06-01',
    ORDERED_PRODUCT_COUNT: 20,
    START_DATE: '2024-07-20',
    TOTAL_DELIVERY_ROUNDS: 15,
    CUSTOMER_ID: 1234567892,
    MAIN_PRODUCT_ID: 9876543212,
    REGULAR_DELIVERY_STATUS_ID: 3,
    ORDER_MEMO: 'This is yet another sample order memo.',
    ADDRESS: '789 Mock Street, Mock City',
    MEMBER_ID: 'mock_member',
    MEMBER_PAYMENT_CARD_ID: '3456-7890-1234-5678',
    RECIPIENT: 'Alice Johnson',
    RECIPIENT_PHONE_NUMBER: '010-3456-7890'
  },
  {
    REGULAR_DELIVERY_APPLICATION_ID: 4000,
    COMPLETED_ROUNDS: 5,
    CREATED_AT: '2024-07-02',
    CYCLE: 2,
    END_DATE: '2024-12-01',
    ORDERED_PRODUCT_COUNT: 8,
    START_DATE: '2024-07-15',
    TOTAL_DELIVERY_ROUNDS: 6,
    CUSTOMER_ID: 1234567888,
    MAIN_PRODUCT_ID: 9876543155,
    REGULAR_DELIVERY_STATUS_ID: 4,
    ORDER_MEMO: 'Another sample order memo2.',
    ADDRESS: '486 Example Avenue, Example City',
    MEMBER_ID: 'example_member_2',
    MEMBER_PAYMENT_CARD_ID: '2345-7777-0123-4567',
    RECIPIENT: 'Julia Kane',
    RECIPIENT_PHONE_NUMBER: '010-7777-6789'
  },
]
// [get] 정기주문 월별 조회
export const fetchRegularOrderCountsBetweenMonth = async (startDate, endDate) => {
  try {
    // 이후에 apiGet 여기서 쓰기
    // 지금은 mockData 사용
    const filteredData = mockOrderData.filter(order => {
      const orderDate = new Date(order.START_DATE);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    return filteredData;
  } catch (error) {
    console.error('Error fetching regular order counts:', error);
    throw error;
  }
};

// [get] 주문ID로 특정 주문 조회
// export const fetchOrderDetailsById = async (REGULAR_DELIVERY_APPLICATION_ID) => {
//   console.log("Fetching order details for id:", REGULAR_DELIVERY_APPLICATION_ID);
//   // 이후에 apiGet 여기서 쓰기
//   // 지금은 mockData 사용
//   // const response = await axios(`/api/orders/subscription/${REGULAR_DELIVERY_APPLICATION_ID}`);`);
//   const order = mockOrderData.find(order => order.REGULAR_DELIVERY_APPLICATION_ID === REGULAR_DELIVERY_APPLICATION_ID);
//   //console.log("Found order:", order)
//   if (!order) {
//     throw new Error('Order not found');
//   }
//   return order;
// };

export const fetchOrderDetailsById = async (REGULAR_DELIVERY_APPLICATION_ID) => {
  console.log("Fetching order details for id:", REGULAR_DELIVERY_APPLICATION_ID);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockOrderData.find(order => order.REGULAR_DELIVERY_APPLICATION_ID === parseInt(REGULAR_DELIVERY_APPLICATION_ID));
      
      if (!order) {
        reject(new Error('Order not found'));
      } else {
        console.log("Found order:", order);
        resolve(order);
      }
    }, 1000); // 1초 지연을 추가하여 비동기 동작을 시뮬레이션합니다.
  });
};
