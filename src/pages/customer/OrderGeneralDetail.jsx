import { Flex, Tag, DatePicker, Form, Input, Button, Table } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { TextArea } = Input;
const onChange = (date, dateString) => {
  console.log(date, dateString);
};
const onTextChange = (e) => {
  console.log('Change:', e.target.value);
};
// const onHandleBackClick = () => {
//   navigate(-1); // 이전 페이지로 이동
// };
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
const tagColors = {
  '결제완료': 'green',
  '주문승인': 'blue',
  '배송준비중': 'orange',
  '배송중': 'purple',
  '배송완료': 'cyan',
};

const OrderGeneralDetail = () => {

  const location = useLocation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState();
  const navigate = useNavigate();
  
  useEffect(() => {
    setSelectedTags(location.state?.selectedTags || []);
    setOrderId(location.state?.selectedOrderId || '');
    setOrderDate(location.state?.selectedOrderDate ? moment(location.state.selectedOrderDate, 'YYYY-MM-DD') : null); 
  }, [location.state]);

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small" wrap>
          <h2>일반주문관리</h2>
        </Flex>
      </Flex>

      <Flex gap="small" justify='flex-start' vertical>
        <Form
          {...formItemLayout}
          variant="outlined"
          style={{
            maxWidth: 800,
            minWidth: 500
          }}
          // initialValues={{ 주문번호: orderId }}
          >
            <h3>주문번호</h3>
          <Form.Item
            //label="주문번호"  // 화면에 띄워지는 이름
            name="주문번호"
            disabled
          >
            <Input disabled placeholder={orderId}  />
          </Form.Item>
          {selectedTags && selectedTags.length > 0 && ( // selectedTags가 비어있지 않은 경우에만 렌더링
            <div>
              <h3>주문상태</h3>
              {selectedTags.map((tag) => (
                <Tag color={tagColors[tag] || 'default'} key={tag} style={{ fontSize: '20px', padding: '8px 16px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </Form>
        <Form
            {...formItemLayout}
            variant="outlined"
            style={{
              maxWidth: 800,
              minWidth: 500
            }}
            >
              <h3>주문유형</h3>
            <Form.Item
              //label="주문번호"  // 화면에 띄워지는 이름
              name="주문번호"
              disabled
            >
              <Input disabled placeholder="일반주문"  />
            </Form.Item>
          </Form>
          <Flex vertical gap="small" align="start"> 
            <h3>상품</h3>
            <Table/>
          </Flex>


          <Flex vertical gap="small" align="start"> 
            <h3>배송시작일</h3>
            <DatePicker value={orderDate} disabled />
            <h3>배송메모</h3>
            <TextArea 
              showCount 
              maxLength={100} 
              placeholder="배송메모..."
              onChange={onTextChange}
              style={{ width: '600px' }}
              disabled />
          </Flex>

          
      </Flex>
    </div>
  )

  
}

export default OrderGeneralDetail
