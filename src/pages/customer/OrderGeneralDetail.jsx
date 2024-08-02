import { Tag, DatePicker, Form, Input, Button, Table, Typography, Row, Col, Card, Space } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;

const OrderGeneralDetail = () => {
  const location = useLocation();
  const { orderDetail, productOrderList } = location.state || {};
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onHandleBackClick = () => {
    navigate(-1);
  };

  const tagColors = {
    PAYMENT_COMPLETED: 'green',
    PREPARING_PRODUCT: 'orange',
    AWAITING_RELEASE: 'cyan'
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
                    <Input value={orderDetail?.orderDetailId} disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="memberId" label="회원 ID" style={formItemStyle}>
                    <Input value={orderDetail?.memberId} disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="orderStatus" label="주문상태" style={formItemStyle}>
                    <Tag color={tagColors[orderDetail?.orderStatus] || 'default'}>
                      {orderDetail?.orderStatus}
                    </Tag>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="orderDateTime" label="주문날짜" style={formItemStyle}>
                    <DatePicker 
                      value={orderDetail?.orderDateTime ? moment(orderDetail.orderDateTime) : null} 
                      disabled 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={60} justify="center">
                <Col span={6}>
                  <Form.Item name="recipient" label="수령인" style={formItemStyle}>
                    <Input value={orderDetail?.recipient} disabled />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item name="deliveryAddress" label="배송지" style={formItemStyle}>
                    <Input value={orderDetail?.deliveryAddress} disabled />
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
                dataSource={tableData} 
                columns={columns}
                pagination={false}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="배송 메모" style={cardStyle} styles={cardStyles}>
              <TextArea 
                value={orderDetail?.orderMemo} 
                disabled
                rows={9}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default OrderGeneralDetail;
