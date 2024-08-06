import { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  message,
  Spin,
} from "antd";
import { fetchTimeSaleDetail, cancelTimeSale } from "../../../apis/apisProducts";
import moment from "moment";
import Swal from "sweetalert2";

const { Title } = Typography;

const EasyProductTimesaleDetail = ({ visible, onClose, timesaleId }) => {
  const [timesaleDetail, setTimesaleDetail] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible && timesaleId) {
      fetchDetail();
    }
  }, [visible, timesaleId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await fetchTimeSaleDetail(timesaleId);
      setTimesaleDetail(response);
      form.setFieldsValue({
        ...response,
        startDateTime: moment(response.startDateTime).format("YYYY-MM-DD HH:mm:ss"),
        endDateTime: moment(response.endDateTime).format("YYYY-MM-DD HH:mm:ss"),
      });
    } catch (error) {
      console.error("Error fetching timesale detail:", error);
      message.error("타임세일 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onHandleCancel = async () => {
    const result = await Swal.fire({
      title: "정말 취소하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "취소하기",
      cancelButtonText: "돌아가기",
    });

    if (result.isConfirmed) {
      try {
        await cancelTimeSale(timesaleId);
        message.success("타임세일이 성공적으로 취소되었습니다.");
        onClose();
      } catch (error) {
        console.error("Error canceling timesale:", error);
        message.error("타임세일 취소에 실패했습니다.");
      }
    }
  };

  const cardStyle = {
    marginBottom: "16px",
    border: "1px solid #d9d9d9",
    borderRadius: "2px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  };

  const formItemStyle = {
    marginBottom: "8px",
  };

  const inputStyle = {
    fontSize: "13px",
  };

  const disabledInputStyle = {
    ...inputStyle,
    color: "rgba(0, 0, 0, 0.85)",
    backgroundColor: "#f5f5f5",
  };

  return (
    <Drawer
      title={<Title level={4}>타임세일 상세 정보</Title>}
      placement='right'
      onClose={onClose}
      visible={visible}
      width={720}>
      {loading ? (
        <Spin size='large' />
      ) : timesaleDetail ? (
        <Form form={form} layout='vertical'>
          <Card title='타임세일 정보' style={cardStyle} size='small'>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name='productId' label='상품 ID' style={formItemStyle}>
                  <Input disabled style={disabledInputStyle} />
                </Form.Item>
                <Form.Item name='productName' label='상품명' style={formItemStyle}>
                  <Input disabled style={disabledInputStyle} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='discountRate' label='할인율 (%)' style={formItemStyle}>
                  <Input disabled style={disabledInputStyle} suffix='%' />
                </Form.Item>
                <Form.Item name='serviceStatus' label='서비스 상태' style={formItemStyle}>
                  <Input disabled style={disabledInputStyle} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name='startDateTime' label='시작 시간' style={formItemStyle}>
                  <Input disabled style={disabledInputStyle} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='endDateTime' label='종료 시간' style={formItemStyle}>
                  <Input disabled style={disabledInputStyle} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Space style={{ width: "100%", justifyContent: "flex-end", marginTop: "16px" }}>
            <Button type='primary' danger onClick={onHandleCancel}>
              취소하기
            </Button>
          </Space>
        </Form>
      ) : (
        <p>타임세일 정보를 찾을 수 없습니다.</p>
      )}
    </Drawer>
  );
};

export default EasyProductTimesaleDetail;
