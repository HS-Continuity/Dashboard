// ProductTimeSaleDetail.jsx
import { fetchTimeSaleDetail, cancelTimeSale } from '../../apis/apisProducts';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Form, Input, Card, Row, Col, Typography, Button, Space, message, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import Swal from 'sweetalert2';

const { Title } = Typography;

const ProductTimeSaleDetail = () => {
  const { timesaleId } = useParams();
  const [timesaleDetail, setTimesaleDetail] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetchTimeSaleDetail(timesaleId);
        setTimesaleDetail(response);
        form.setFieldsValue({
          ...response,
          startDateTime: moment(response.startDateTime).format('YYYY-MM-DD HH:mm:ss'),
          endDateTime: moment(response.endDateTime).format('YYYY-MM-DD HH:mm:ss'),
        });
      } catch (error) {
        console.error('Error fetching timesale detail:', error);
        message.error('타임세일 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [timesaleId, form]);

  const onHandleBackClick = () => {
    navigate(-1);
  };

  const onHandleCancel = async () => {
    const result = await Swal.fire({
      title: '정말 취소하시겠습니까?',
      text: "이 작업은 되돌릴 수 없습니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '취소하기',
      cancelButtonText: '돌아가기'
    });

    if (result.isConfirmed) {
      try {
        await cancelTimeSale(timesaleId);
        console.log('삭제할 아이템번호: ', timesaleId)
        message.success('타임세일이 성공적으로 취소되었습니다.');
        navigate(-1);
      } catch (error) {
        console.error('Error canceling timesale:', error);
        message.error('타임세일 취소에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!timesaleDetail) {
    return <p>타임세일 정보를 찾을 수 없습니다.</p>;
  }

  const cardStyle = {
    marginTop: '20px',
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
    fontSize: '13px'
  };

  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <Flex gap="small" justify="flex-start" align="center" style={{ width: 'fit-content' }}>
        <LeftOutlined onClick={onHandleBackClick}/>
        <Title level={3}>타임세일 상세 정보</Title>
      </Flex>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Card 
              title="타임세일 정보" 
              style={cardStyle} 
              styles={cardStyles}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="productId" label="상품 ID" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="productName" label="상품명" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="discountRate" label="할인율 (%)" style={formItemStyle}>
                    <Input disabled style={inputStyle}  suffix= '%'/>
                  </Form.Item>
                  <Form.Item name="serviceStatus" label="서비스 상태" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="startDateTime" label="시작 시간" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="endDateTime" label="종료 시간" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="primary" danger onClick={onHandleCancel}>취소하기</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductTimeSaleDetail;