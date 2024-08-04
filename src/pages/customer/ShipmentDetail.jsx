import { updateDeliveryDate, updateReleaseMemo, updateReleaseHoldReason } from '../../apis/apisShipments';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Table, Typography, Row, Col, message, Tag, DatePicker, Card, Space } from 'antd';
import Swal from 'sweetalert2';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const ShipmentDetail = () => {
  const location = useLocation();
  const { shipmentDetail, productOrderList } = location.state || {};
  const [memo, setMemo] = useState(shipmentDetail?.memo || '');
  const [holdReason, setHoldReason] = useState(shipmentDetail?.holdReason || '');
  const [startDeliveryDate, setStartDeliveryDate] = useState(shipmentDetail?.startDeliveryDate ? moment(shipmentDetail.startDeliveryDate) : null);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (shipmentDetail) {
      form.setFieldsValue({
        ...shipmentDetail,
        startDeliveryDate: startDeliveryDate,
      });
    }
  }, [shipmentDetail, form, startDeliveryDate]);

  const columns = [
    { title: '주문번호', dataIndex: 'productId', key: 'productId' },
    { title: '상품명', dataIndex: 'name', key: 'name' },
    { title: '수량', dataIndex: 'quantity', key: 'quantity' },
    { title: '원가', dataIndex: 'originPrice', key: 'originPrice' },
    { title: '할인금액', dataIndex: 'discountAmount', key: 'discountAmount' },
  ];

  const onMemoSubmit = async () => {
    const { value: newMemo } = await Swal.fire({
      title: '출고메모',
      input: 'textarea',
      inputLabel: '출고메모를 입력하세요',
      inputPlaceholder: '출고메모를 입력하세요...',
      inputAttributes: {
        'aria-label': '출고메모를 입력하세요'
      },
      showCancelButton: true,
      confirmButtonText: '등록하기',
      cancelButtonText: '취소'
    });

    if (newMemo) {
      try {
        await updateReleaseMemo(shipmentDetail.orderId, newMemo);
        setMemo(newMemo);
        message.success('출고메모가 등록되었습니다.');
      } catch (error) {
        console.error('Error updating memo:', error);
        message.error('출고메모 등록에 실패했습니다.');
      }
    }
  };

  const onHoldReasonSubmit = async () => {
    const { value: newHoldReason } = await Swal.fire({
      title: '출고보류',
      input: 'textarea',
      inputLabel: '출고 보류 사유를 입력하세요',
      inputPlaceholder: '출고 보류 사유를 입력하세요...',
      inputAttributes: {
        'aria-label': '출고 보류 사유를 입력하세요'
      },
      showCancelButton: true,
      confirmButtonText: '등록하기',
      cancelButtonText: '취소'
    });

    if (newHoldReason) {
      try {
        await updateReleaseHoldReason(shipmentDetail.orderId, newHoldReason);
        setHoldReason(newHoldReason);
        message.success('출고보류사유가 등록되었습니다.');
      } catch (error) {
        console.error('Error updating hold reason:', error);
        message.error('출고보류사유 등록에 실패했습니다.');
      }
    }
  };

  const onHandleBackClick = () => {
    navigate(-1);
  };

  const onHandleDateChange = async (date, dateString) => {
    if (!shipmentDetail?.orderId) {
      message.error('주문 정보가 없습니다.');
      return;
    }

    try {
      await updateDeliveryDate(shipmentDetail.orderId, dateString);
      setStartDeliveryDate(date);
      message.success('배송시작일이 설정되었습니다.');
    } catch (error) {
      console.error('Error updating delivery date:', error);
      message.error('배송시작일 설정에 실패했습니다.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      AWAITING_RELEASE: 'green',
      HOLD_RELEASE: 'orange',
      RELEASE_COMPLETED: 'cyan',
      COMBINED_PACKAGING_COMPLETED: 'pink'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      AWAITING_RELEASE: '출고대기',
      HOLD_RELEASE: '출고보류',
      RELEASE_COMPLETED: '출고완료',
      COMBINED_PACKAGING_COMPLETED: '합포장완료'
    };
    return texts[status] || status;
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
    marginBottom: '8px'
  };

  const inputStyle = {
    fontSize: '13px',
    width: '80%'
  };

  const greenButtonStyle = {
    backgroundColor: '#006400',
    borderColor: '#006400',
  };

  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <Space style={{ marginBottom: '16px' }}>
        {/* <Button icon={<LeftOutlined />} onClick={onHandleBackClick} /> */}
        <Button icon={<LeftOutlined />} onClick={onHandleBackClick} style={{ border: 'none', padding: 0 }} />
        <Title level={3}>출고 상세 정보</Title>
      </Space>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Card title="출고 정보" style={cardStyle} styles={cardStyles}>
              <Row gutter={70} align="middle">
                <Col span={5}>
                  <Form.Item name="orderId" label="주문번호" style={formItemStyle}>
                    <Input disabled style={{width: '100%'}} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="recipient" label="회원명" style={formItemStyle}>
                    <Input disabled style={{width: '100%'}} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="releaseStatus" label="출고상태" style={formItemStyle}>
                    <Tag color={getStatusColor(shipmentDetail?.releaseStatus)}>
                      {getStatusText(shipmentDetail?.releaseStatus)}
                    </Tag>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="startDeliveryDate" label="배송시작일" style={formItemStyle}>
                    <DatePicker 
                      value={startDeliveryDate}
                      onChange={onHandleDateChange}
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item name="recipientAddress" label="배송지" style={formItemStyle}>
                    <Input disabled style={{width: '100%'}} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {/* ... (나머지 카드들은 그대로 유지) */}
        <Row gutter={16}>
          <Col span={12}>
            <Card title="출고 메모" style={cardStyle} styles={cardStyles}>
              <TextArea
                rows={4}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <Button type="primary" onClick={onMemoSubmit} style={greenButtonStyle}>
                {memo ? '수정' : '등록'}
              </Button>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="출고 보류 사유" style={cardStyle} styles={cardStyles}>
              <TextArea
                rows={4}
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                disabled={shipmentDetail?.orderStatus !== "HOLD_RELEASE"}
                style={{ marginBottom: '8px' }}
              />
              <Button
                type="primary"
                onClick={onHoldReasonSubmit}
                disabled={shipmentDetail?.orderStatus !== "HOLD_RELEASE"}
                style={greenButtonStyle}
              >
                {holdReason ? '수정' : '등록'}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ShipmentDetail;