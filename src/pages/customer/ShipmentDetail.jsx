import { updateReleaseMemo, updateReleaseHoldReason } from '../../apis/apisShipments';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Flex, Form, Input, Button, Table, Typography, Row, Col, message, Tag } from 'antd';
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
  const [isHoldReasonEnabled, setIsHoldReasonEnabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Received shipment detail:', shipmentDetail);
    console.log('Received product order list:', productOrderList);
  }, [shipmentDetail, productOrderList]);

  useEffect(() => {
    setIsHoldReasonEnabled(shipmentDetail?.orderStatus === 'HOLD_RELEASE');
  }, [shipmentDetail]);

  const columns = [
    { title: '주문번호', dataIndex: 'productId', key: 'productId' },
    // { title: '카테고리', dataIndex: 'name', key: 'name' },
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
        const response = await updateReleaseMemo(shipmentDetail.orderId, newMemo);
        console.log('Memo update response:', response);
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
        const response = await updateReleaseHoldReason(shipmentDetail.orderId, newHoldReason);
        console.log('Hold reason update response:', response);
        setHoldReason(newHoldReason);
        message.success('출고보류사유가 등록되었습니다.');
      } catch (error) {
        console.error('Error updating hold reason:', error);
        message.error('출고보류사유 등록에 실패했습니다.');
      }
    }
  };

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
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

  return (
    <div style={{ padding: '20px' }}>
      <Flex gap="small" justify='flex-start'> 
        <LeftOutlined onClick={onHandleBackClick}/>
        <Title level={3}>출고 상세 정보</Title>
      </Flex>
      <br/>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="주문번호">
              <Input value={shipmentDetail?.orderId} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="회원번호">
              <Input value={shipmentDetail?.memberId} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="출고상태">
              <Tag color={getStatusColor(shipmentDetail?.orderStatus)}>
                {getStatusText(shipmentDetail?.orderStatus)}
              </Tag>
            </Form.Item>
          </Col>
        </Row>
        <br/>
        <Table
          columns={columns}
          dataSource={productOrderList}
          rowKey="productId"
          pagination={false}
          style={{ marginBottom: '20px' }}
        />
        <br/>     
        <Row gutter={16}>
          <Col span={12}>
            {/* <Form.Item label="주문메모">
              <TextArea
                rows={4}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
              <Button onClick={onMemoSubmit} style={{ marginTop: '10px' }}>등록</Button>
            </Form.Item> */}
            <Form.Item label="주문메모">
              {memo ? (
                <TextArea rows={4} value={memo} readOnly />
              ) : (
                <Button onClick={onMemoSubmit}>출고 메모 등록</Button>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* <Form.Item label="보류사유">
              <TextArea
                rows={4}
                value={memo}
                onChange={(e) => setHoldReason(e.target.value)}
                disabled={!isHoldReasonEnabled}
              />
              <Button onClick={onHoldReasonSubmit} style={{ marginTop: '10px' }}>등록</Button>
            </Form.Item> */}
            <Form.Item label="보류사유">
              {shipmentDetail?.orderStatus === "HOLD_RELEASE" ? (
                holdReason ? (
                  <TextArea rows={4} value={holdReason} readOnly />
                ) : (
                  <Button onClick={onHoldReasonSubmit}>출고 보류 사유 등록</Button>
                )
              ) : (
                <div>
                  <TextArea rows={4} value="출고 보류 상태가 아닙니다." readOnly disabled />
                  <Button disabled style={{ marginTop: '10px' }}>출고 보류 사유 등록</Button>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ShipmentDetail;