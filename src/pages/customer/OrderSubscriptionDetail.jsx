import { fetchOrderDetailsById } from '../../apis/apisOrders';
import { Flex, Card, DatePicker, Form, Input, ConfigProvider, Divider, Button, Table } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useState } from 'react';
import './OrderSubscriptionDetailModule.css';
const { TextArea } = Input;

// const onTextChange = (e) => {
// };

// const formItemLayout = {
//   labelCol: {
//     xs: {
//       span: 24,
//     },
//     sm: {
//       span: 6,
//     },
//   },
//   wrapperCol: {
//     xs: {
//       span: 24,
//     },
//     sm: {
//       span: 14,
//     },
//   },
// };

// const tagColors = {
//   '결제완료': 'green',
//   '주문승인': 'blue',
//   '배송준비중': 'orange',
//   '배송중': 'purple',
//   '배송완료': 'cyan',
// };

const OrderSubscriptionDetail = () => {

  // const location = useLocation();
  // const [selectedTags, setSelectedTags] = useState([]);
  // const [orderId, setOrderId] = useState('');
  // const [orderDate, setOrderDate] = useState();
  // const [orderEndDate, setOrderEndDate] = useState();
  // const [orderCycle, setOrderCycle] = useState();
  // const [orderDay, setOrderDay] = useState();
  const navigate = useNavigate();

  const { id } = useParams();

  console.log("Received ID from params:", id);

  const { data: orderDetails, isLoading, isError, error } = useQuery({
    queryKey: ['orderDetails', id],
    queryFn: () => fetchOrderDetailsById(id),
    enabled: !!id, // id가 존재할 때만 쿼리 실행
  });

  //console.log("Query result:", { orderDetails, isLoading, isError, error });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // 데이터가 없는 경우
  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

  console.log("Order details:", orderDetails);

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };


  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small">
          <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small">
          <h3>정기주문상세</h3>
        </Flex>
      </Flex>
      <Flex>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              //colorPrimary: '#4F5902',  // today cell color
              borderRadius: 5,

              // Alias Token
              //colorBgContainer: '#D9D4CC', // calendar bg color
              fontSize: 15,
              colorText: 'rgba(0, 0, 0, 0.88)',
              
            },
            Card: {
              headerHeight: 5
            }
          }}
        >
          <Card 
            className='mainCard'
            title=
              <Flex justify='space-between'>
                <Form.Item label="주문번호" className='cardTitle' colon={false}>
                  <Input value={orderDetails.REGULAR_DELIVERY_APPLICATION_ID} className='orderId' disabled />
                </Form.Item>
                <Form.Item label="등록일시" className='cardTitle' colon={false}>
                  <Input value={orderDetails.CREATED_AT} className='registerDate' disabled />
                </Form.Item>
              </Flex>
          >
            <div className='bodyOfCard'>
              <div className='description'>회원정보</div>
              <div className='content'>
                <Form.Item label="회원번호" colon={false}>
                  <Input value={orderDetails.MEMBER_ID} className='inputTags' size='medium' disabled />
                </Form.Item>
                <Form.Item label="회원명" colon={false}>
                  <Input value={orderDetails.RECIPIENT} className='inputTags' size='medium' disabled />
                </Form.Item>
                <Form.Item label="회원 휴대전화" colon={false}>
                  <Input value={orderDetails.RECIPIENT_PHONE_NUMBER} className='inputTags' size='medium' disabled />
                </Form.Item>
              </div>
              {/* <Divider/> */}
              <div className='description'>주문정보</div>
              <div className='content'>
                <Form.Item label="주문번호" colon={false}>
                  <Input value={orderDetails.REGULAR_DELIVERY_APPLICATION_ID} className='inputTags' size='medium' disabled />
                </Form.Item>
                <Form.Item label="주문상태" colon={false}>
                  <Input value={orderDetails.REGULAR_DELIVERY_STATUS_ID} className='inputTags' size='medium' disabled />
                </Form.Item>
              </div>
              <div className='content' gap='large'>
                <Form.Item label="배송시작일" colon={false}>
                  <DatePicker value={moment(orderDetails.START_DATE)} className='inputTags' size='medium' disabled/>
                </Form.Item>
                <p1>~</p1>
                <Form.Item label="배송종료일" colon={false}>
                  <DatePicker value={moment(orderDetails.END_DATE)} className='inputTags' size='medium' disabled />
                </Form.Item>
              </div>
              <div className='content'>
                <Form.Item label="배송주기" colon={false}>
                  <Input value={`${orderDetails.CYCLE}주마다`} className='inputTags' size='medium'  />
                </Form.Item>
                <Form.Item label="배송메모" colon={false}>
                  <TextArea value={orderDetails.ORDER_MEMO} className='inputTags' size='medium'  />
                </Form.Item>
              </div>
              {/* <Divider/> */}
              <div className='description'>상품정보</div>
              <div className='content'>
                <Table></Table>
              </div>
              <div className='btn'>
                <Button>수정하기</Button>
                <Button>삭제하기</Button>
              </div>
            </div>
            
          </Card>
        </ConfigProvider>
        
      </Flex>

      
    </div>

    // <div>
    //   <h2>정기주문상세</h2>
    //   <Form layout="vertical">
    //     <Form.Item label="주문번호">
    //       <Input value={orderDetails.REGULAR_DELIVERY_APPLICATION_ID} disabled />
    //     </Form.Item>
    //     <Form.Item label="주문상태">
    //       <Input value={orderDetails.REGULAR_DELIVERY_STATUS_ID} disabled />
    //     </Form.Item>
    //     <Form.Item label="주문자">
    //       <Input value={orderDetails.RECIPIENT} disabled />
    //     </Form.Item>
    //     <Form.Item label="배송시작일">
    //       <DatePicker value={moment(orderDetails.START_DATE)} disabled />
    //     </Form.Item>
    //     <Form.Item label="배송종료일">
    //       <DatePicker value={moment(orderDetails.END_DATE)} disabled />
    //     </Form.Item>
    //     <Form.Item label="배송주기">
    //       <Input value={`${orderDetails.CYCLE}주마다`} disabled />
    //     </Form.Item>
    //     <Form.Item label="배송메모">
    //       <TextArea value={orderDetails.ORDER_MEMO} disabled />
    //     </Form.Item>
    //   </Form>
    // </div>
  )
}

export default OrderSubscriptionDetail
