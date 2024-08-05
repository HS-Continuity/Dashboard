import { Tag, DatePicker, Form, Button, Table, Typography, Row, Col, Card, Space } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const OrderGeneralDetail = () => {
  const location = useLocation();
  const { orderDetail } = location.state || {};
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onHandleBackClick = () => {
    navigate(-1);
  };

  console.log('받아온 데이터: ', orderDetail)
  console.log('orderDateTime: ', orderDetail.orderDateTime)
  console.log('orderDetailId: ', orderDetail.orderDetailId)

  const tagColors = {
    PAYMENT_COMPLETED: 'green',
    PREPARING_PRODUCT: 'orange',
    AWAITING_RELEASE: 'cyan',
    CANCELED: 'red'
  };

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
      render: (name) => name || <span style={{ color: 'gray' }}>미정</span>,
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

  useEffect(() => {
    form.setFieldsValue({
      orderDetailId: orderDetail?.orderDetailId,
      memberId: orderDetail?.memberInfo?.memberId,
      orderDateTime: orderDetail?.orderDateTime ? moment(orderDetail.orderDateTime) : null,
      recipient: orderDetail?.recipient?.recipient,
      deliveryAddress: orderDetail?.recipient?.recipientAddress,
      orderMemo: orderDetail?.orderMemo
    });
  }, [orderDetail, form]);

  const productData = orderDetail?.productOrderList?.productOrderList.map((product, index) => ({
    key: index,
    no: index + 1,
    name: product.name,
    quantity: product.quantity,
    discountAmount: product.discountAmount,
    finalPrice: product.finalPrice,
    status: product.status,
  })) || [];

  const textStyle = {
    display: 'block',
    padding: '4px 11px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
    minHeight: '32px',
  };

  const cardStyle = {
    marginBottom: '16px',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  const cardStyles = {
    head: {
      padding: '8px 16px'
    },
    body: {
      padding: '16px'
    }
  };

  const formItemStyle = {
    marginBottom: '6px'
  };

  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <Space style={{ marginBottom: '16px' }}>
        <Button icon={<LeftOutlined />} onClick={onHandleBackClick} style={{ border: 'none', padding: 0 }} />
        <Title level={3}>일반주문 상세</Title>
      </Space>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Card title="주문 정보" style={cardStyle} styles={cardStyles}>
              <Row gutter={70} align="middle" justify="center">
                <Col span={6}>
                  <Form.Item name="orderDetailId" label="주문번호" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('orderDetailId')}</Text>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="memberId" label="회원번호" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('memberId')}</Text>
                  </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="orderStatus" label="주문상태" style={formItemStyle}>
                      <Tag color={tagColors[orderDetail?.orderStatusCode] || 'default'}>
                        {orderDetail?.orderStatusCode}
                      </Tag>
                    </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="orderDateTime" label="주문날짜" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('orderDateTime')?.format('YYYY-MM-DD HH:mm:ss')}</Text>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={60} justify="center">
                <Col span={6}>
                  <Form.Item name="recipient" label="수령인" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('recipient')}</Text>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item name="deliveryAddress" label="배송지" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('deliveryAddress')}</Text>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <Card title="주문 상품" style={cardStyle} styles={cardStyles}>
              <Table 
                dataSource={productData} 
                columns={columns}
                pagination={false}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="배송 메모" style={cardStyle} styles={cardStyles}>
              <Form.Item name="orderMemo">
                <Text style={{...textStyle, minHeight: '120px', whiteSpace: 'pre-wrap'}}>{form.getFieldValue('orderMemo')}</Text>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default OrderGeneralDetail;