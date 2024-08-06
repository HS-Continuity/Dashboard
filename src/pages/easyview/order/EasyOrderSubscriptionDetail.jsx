import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Space,
  Button,
  Typography,
  message,
  Skeleton,
  Descriptions,
  Slider,
} from "antd";
import { LeftOutlined, UserOutlined, ShoppingCartOutlined, TruckOutlined } from "@ant-design/icons";
import "../../customer/OrderSubscriptionDetailModule.css";
import { useFontSizeStore } from "../../../stores/fontSizeStore";

const { Title, Text } = Typography;

const EasyOrderSubscriptionDetail = () => {
  const location = useLocation();
  const { regularOrderId } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const [regularOrderDetail, setRegularOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tableFontSize, setTableFontSize } = useFontSizeStore();

  const getValueStyle = () => ({
    fontSize: `${tableFontSize}px`,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let data;
      if (location.state?.regularOrderDetail) {
        data = location.state.regularOrderDetail[0];
      }

      setRegularOrderDetail(data);
      const isMemberInfoAvailable = data.availableMemberService;
      const isProductInfoAvailable = data.availableProductService;

      setIsServerUnstable(!isMemberInfoAvailable || !isProductInfoAvailable);

      form.setFieldsValue(data);
      setLoading(false);
    };

    fetchData();
  }, [regularOrderId, location.state, form]);

  useEffect(() => {
    if (isServerUnstable) {
      message.warning("일부 서비스에 연결할 수 없습니다. 데이터가 부분적으로 표시될 수 있습니다.");
    }
  }, [isServerUnstable]);

  const onHandleBackClick = () => {
    navigate(-1);
  };

  const cardStyle = {
    marginBottom: "16px",
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Space direction='vertical' size='middle' style={{ width: "100%", marginBottom: "24px" }}>
        <Space>
          <Button icon={<LeftOutlined />} onClick={onHandleBackClick} type='link' />
          <Title level={2}>정기주문 상세 정보</Title>
          <Space direction='horizontal' size='small' style={{ width: "100%", marginLeft: "180px" }}>
            <Text strong style={{ textAlign: "center", display: "block" }}>
              글꼴 크기 :
            </Text>
            <Slider
              min={12}
              max={30}
              value={tableFontSize}
              onChange={setTableFontSize}
              style={{ width: "200px" }}
            />
          </Space>
        </Space>
      </Space>

      {loading ? (
        <Skeleton active />
      ) : (
        <Form form={form} layout='vertical'>
          <Row gutter={24}>
            <Col xs={24} lg={8}>
              <Card
                title={
                  <>
                    <UserOutlined /> 회원 정보
                  </>
                }
                style={cardStyle}>
                <Descriptions column={1}>
                  <Descriptions.Item label='회원 ID'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.memberId}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='회원 이름'>
                    <Text style={getValueStyle()}>
                      {regularOrderDetail?.memberInfo?.memberName || "정보 없음"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='연락처'>
                    <Text style={getValueStyle()}>
                      {regularOrderDetail?.memberInfo?.memberPhoneNumber || "정보 없음"}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <>
                    <ShoppingCartOutlined /> 주문 정보
                  </>
                }
                style={cardStyle}>
                <Descriptions column={2}>
                  <Descriptions.Item label='정기주문 ID'>
                    <Text style={getValueStyle()}>
                      {regularOrderDetail?.regularDelivaryApplicationId}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='상품명'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.productName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='주문 날짜'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.today}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='예약 수'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.reservationCount}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='시작 날짜'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.startDate}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='종료 날짜'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.endDate}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card
                title={
                  <>
                    <TruckOutlined /> 배송 정보
                  </>
                }
                style={cardStyle}>
                <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
                  <Descriptions.Item label='다음 배송일'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.nextDeliveryDate}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='배송 주기'>
                    <Text style={getValueStyle()}>{regularOrderDetail?.deliveryCycle}주</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='총 배송 회차'>
                    <Text style={getValueStyle()}>
                      {regularOrderDetail?.totalDeliveryRounds}회차
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='배송 메모'>
                    <Text style={getValueStyle()}>
                      {regularOrderDetail?.deliveryNotes || "없음"}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default EasyOrderSubscriptionDetail;
