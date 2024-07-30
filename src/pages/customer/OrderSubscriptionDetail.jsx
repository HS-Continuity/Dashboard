
import { Flex, Typography, DatePicker, Form, Input, ConfigProvider, Row, Col, Button, Table } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
//import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
//import moment from 'moment';
import { useEffect, useState } from 'react';
import './OrderSubscriptionDetailModule.css';

const { Title } = Typography;
//const { TextArea } = Input;

const OrderSubscriptionDetail = () => {

  const [regularOrderId, setRegularOrderId] = useState('');
  const [regularOrderDetails, setRegularOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    if (location.state) {
      console.log('Received member data in detail page:', location.state);
      setRegularOrderDetails(location.state.record);
    }
  }, [location.state]);
 
  console.log('정기 주문 받아온 데이터: ', location.state.record)

  
  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  if (!regularOrderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
    <Flex gap="small" justify='flex-start'> 
      <LeftOutlined onClick={onHandleBackClick}/>
      <Title level={3}>정기주문 상세 정보</Title>
    </Flex>
    <div>
      <p>정기주문 ID: {regularOrderDetails.regularDelivaryApplicationId}</p>
      <p>상품 ID: {regularOrderDetails.productId}</p>
      <p>상품명: {regularOrderDetails.productName}</p>
      <p>주문 날짜: {regularOrderDetails.today}</p>
      {regularOrderDetails.memberInfo && (
        <>
          <p>회원 ID: {regularOrderDetails.memberInfo.memberId}</p>
          <p>회원 이름: {regularOrderDetails.memberInfo.memberName}</p>
          <p>회원 전화번호: {regularOrderDetails.memberInfo.memberPhoneNumber}</p>
        </>
      )}
      <p>서비스 가능 여부: {regularOrderDetails.isAvailableProductService ? '가능' : '불가능'}</p>
    </div>
  </div>
  )
}

export default OrderSubscriptionDetail
