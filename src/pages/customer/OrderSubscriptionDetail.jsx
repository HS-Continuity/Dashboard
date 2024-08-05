import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, Form, Row, Col, Space, Button, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './OrderSubscriptionDetailModule.css';

const { Title, Text } = Typography;

const OrderSubscriptionDetail = () => {
  const location = useLocation();
  const { regularOrderDetail } = location.state || {};
  const [form] = Form.useForm();
  const navigate = useNavigate();

  console.log('상세 받아온 데이터: ', regularOrderDetail)

  useEffect(() => {
    if (regularOrderDetail && regularOrderDetail[0]) {
      const data = regularOrderDetail[0];
      form.setFieldsValue({
        availableMemberService: data.availableMemberService,
        availableProductService: data.availableProductService,
        deliveryCycle: data.deliveryCycle,
        deliveryDayOfWeeks: data.deliveryDayOfWeeks,
        deliveryPeriod: data.deliveryPeriod,
        endDate: data.endDate,
        memberId: data.memberId,
        nextDeliveryDate: data.nextDeliveryDate,
        productId: data.productId,
        productName: data.productName,
        regularDelivaryApplicationId: data.regularDelivaryApplicationId,
        reservationCount: data.reservationCount,
        startDate: data.startDate,
        today: data.today,
        totalDeliveryRounds: data.totalDeliveryRounds
      });
    }
  }, [regularOrderDetail, form]);

  const onHandleBackClick = () => {
    navigate(-1);
  };

  const cardStyle = { 
    marginBottom: '16px',
    borderColor: '#d3d3d3'
  };
  const formItemStyle = { marginBottom: '8px' };

  const textStyle = {
    display: 'block',
    padding: '4px 11px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
    minHeight: '32px',
  };

  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <Space style={{ marginBottom: '16px' }}>
        <Button icon={<LeftOutlined />} onClick={onHandleBackClick} style={{ border: 'none', padding: 0 }} />
        <Title level={3}>정기주문 상세 정보</Title>
      </Space>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Card title="회원 정보" style={cardStyle}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="memberId" label="회원 ID" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('memberId')}</Text>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="주문 정보" style={cardStyle}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="regularDelivaryApplicationId" label="정기주문 ID" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('regularDelivaryApplicationId')}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="productName" label="상품명" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('productName')}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="today" label="주문 날짜" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('today')}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="reservationCount" label="예약 수" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('reservationCount')}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="startDate" label="시작 날짜" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('startDate')}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="endDate" label="종료 날짜" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('endDate')}</Text>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="배송 정보" style={{ ...cardStyle, width: '100%' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="nextDeliveryDate" label="다음 배송일" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('nextDeliveryDate')}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="deliveryCycle" label="배송 주기" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('deliveryCycle')}</Text>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="totalDeliveryRounds" label="총 배송 회차" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('totalDeliveryRounds')}</Text>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="deliveryNotes" label="배송 메모" style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue('deliveryNotes')}</Text>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default OrderSubscriptionDetail;