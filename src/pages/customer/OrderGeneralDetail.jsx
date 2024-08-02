import { Flex, Tag, DatePicker, Form, Input, Button, Table } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

// const onChange = (date, dateString) => {
// };
// const onTextChange = (e) => {
// };

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const tagColors = {
  PAYMENT_COMPLETED: 'green',
  PREPARING_PRODUCT: 'orange',
  AWAITING_RELEASE: 'cyan'
};

const OrderGeneralDetail = () => {

  const location = useLocation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState();
  const navigate = useNavigate();
  const { orderDetail, productOrderList } = location.state || {};

  console.log("OrderDetail:", orderDetail);
  console.log("ProductOrderList:", productOrderList);
  
  // useEffect(() => {
  //   setSelectedTags(location.state?.selectedTags || []);
  //   setOrderId(location.state?.selectedOrderId || '');
  //   setOrderDate(location.state?.selectedOrderDate ? moment(location.state.selectedOrderDate, 'YYYY-MM-DD') : null); 
  // }, [location.state]);

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const productColumns = [
    { title: '상품명', dataIndex: 'name', key: 'name' },
    { title: '수량', dataIndex: 'quantity', key: 'quantity' },
    { title: '가격', dataIndex: 'finalPrice', key: 'finalPrice' },
    { title: '상태', dataIndex: 'status', key: 'status',
      render: (status) => (
        <Tag color={tagColors[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
  ];


  // return (
  //   <div>
  //     <Flex gap="small" justify='flex-start'> 
  //       <Flex gap="small" wrap>
  //       <LeftOutlined  onClick={onHandleBackClick}/>
  //       </Flex>
  //       <Flex gap="small" wrap>
  //         <h2>일반주문관리</h2>
  //       </Flex>
  //     </Flex>

  //     <Flex gap="small" justify='flex-start' vertical>
  //       <Form
  //         {...formItemLayout}
  //         variant="outlined"
  //         style={{
  //           maxWidth: 800,
  //           minWidth: 500
  //         }}
  //         // initialValues={{ 주문번호: orderId }}
  //         >
  //           <h3>주문번호</h3>
  //         <Form.Item
  //           //label="주문번호"  // 화면에 띄워지는 이름
  //           name="주문번호"
  //           disabled
  //         >
  //           <Input disabled placeholder={orderId}  />
  //         </Form.Item>
  //         {selectedTags && selectedTags.length > 0 && ( // selectedTags가 비어있지 않은 경우에만 렌더링
  //           <div>
  //             <h3>주문상태</h3>
  //             {selectedTags.map((tag) => (
  //               <Tag color={tagColors[tag] || 'default'} key={tag} style={{ fontSize: '20px', padding: '8px 16px' }}>
  //                 {tag}
  //               </Tag>
  //             ))}
  //           </div>
  //         )}
  //       </Form>
  //       <Form
  //           {...formItemLayout}
  //           variant="outlined"
  //           style={{
  //             maxWidth: 800,
  //             minWidth: 500
  //           }}
  //           >
  //             <h3>주문유형</h3>
  //           <Form.Item
  //             //label="주문번호"  // 화면에 띄워지는 이름
  //             name="주문번호"
  //             disabled
  //           >
  //             <Input disabled placeholder="일반주문"  />
  //           </Form.Item>
  //         </Form>
  //         <Flex vertical gap="small" align="start"> 
  //           <h3>상품</h3>
  //           <Table/>
  //         </Flex>


  //         <Flex vertical gap="small" align="start"> 
  //           <h3>배송시작일</h3>
  //           <DatePicker value={orderDate} disabled />
  //           <h3>배송메모</h3>
  //           <TextArea 
  //             showCount 
  //             maxLength={100} 
  //             placeholder="배송메모..."
  //             onChange={onTextChange}
  //             style={{ width: '600px' }}
  //             disabled />
  //         </Flex>

          
  //     </Flex>
  //   </div>
  // )

  // productOrderList.productOrderList를 테이블 데이터로 변환
  const tableData = productOrderList?.productOrderList?.map((product, index) => ({
    key: index,
    no: index + 1,
    productId: product.productId,
    name: product.name || '미정',
    quantity: product.quantity,
    discountAmount: product.discountAmount,
    finalPrice: product.finalPrice,
    status: product.status,
  })) || [];
  console.log("TableData:", tableData)

  const columns = [
    { 
      title: 'No.', 
      dataIndex: 'no', 
      key: 'no',
      width: '60px',
    },
    { 
      title: '상품명', 
      dataIndex: 'name', 
      key: 'name',
      render: (name) => name === '미정' ? <span style={{ color: 'gray' }}>미정</span> : name,
    },
    { title: '수량', dataIndex: 'quantity', key: 'quantity' },
    { title: '할인액', dataIndex: 'discountAmount', key: 'discountAmount' },
    { title: '최종 가격', dataIndex: 'finalPrice', key: 'finalPrice' },
    { 
      title: '상태', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={tagColors[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <LeftOutlined onClick={onHandleBackClick}/>
        <h2>일반주문 상세</h2>
      </Flex>

      <Form {...formItemLayout}>
        <Form.Item label="주문번호">
          <Input value={orderDetail?.orderDetailId} disabled />
        </Form.Item>
        <Form.Item label="주문상태">
          <Tag color={tagColors[orderDetail?.orderStatus] || 'default'}>
            {orderDetail?.orderStatus}
          </Tag>
        </Form.Item>
        <Form.Item label="회원 ID">
          <Input value={orderDetail?.memberId} disabled />
        </Form.Item>
        <Form.Item label="주문날짜">
          <DatePicker 
            value={orderDetail?.orderDateTime ? moment(orderDetail.orderDateTime) : null} 
            disabled 
          />
        </Form.Item>
        <Form.Item label="배송지">
          <Input value={orderDetail?.deliveryAddress} disabled />
        </Form.Item>
        <Form.Item label="수령인">
          <Input value={orderDetail?.recipient} disabled />
        </Form.Item>

        <Form.Item label="주문 상품">
          <Table 
            dataSource={tableData} 
            columns={columns}
            pagination={false}
          />
        </Form.Item>

        {/* <Form.Item label="배송 메모">
          <TextArea 
            value={orderDetail?.orderMemo} 
            disabled
          />
        </Form.Item> */}
      </Form>
    </div>
  );

  
}

export default OrderGeneralDetail
