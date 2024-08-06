import { Tag, message, Form, Table, Typography, Row, Col, Card, Drawer } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const { Text } = Typography;

const EasyOrderGeneralDetail = ({ visible, onClose, orderDetail }) => {
  const [form] = Form.useForm();
  const [isServerUnstable, setIsServerUnstable] = useState(false);

  const tagColors = {
    PAYMENT_COMPLETED: "green",
    PREPARING_PRODUCT: "orange",
    AWAITING_RELEASE: "cyan",
    CANCELED: "red",
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: "60px",
    },
    {
      title: "상품명",
      dataIndex: "name",
      key: "name",
      render: name => name || <span style={{ color: "gray" }}>불러오는 중..</span>,
    },
    { title: "수량", dataIndex: "quantity", key: "quantity" },
    { title: "할인액", dataIndex: "discountAmount", key: "discountAmount" },
    { title: "최종 가격", dataIndex: "finalPrice", key: "finalPrice" },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      render: status => <Tag color={tagColors[status] || "default"}>{status}</Tag>,
    },
  ];

  useEffect(() => {
    if (orderDetail) {
      const isMemberInfoAvailable = orderDetail.availableMemberInformation;
      const isProductInfoAvailable = orderDetail.availableProductInformation;

      setIsServerUnstable(!isMemberInfoAvailable || !isProductInfoAvailable);

      form.setFieldsValue({
        orderDetailId: orderDetail?.orderDetailId,
        memberId: isMemberInfoAvailable ? orderDetail.memberInfo?.memberId : "불러오는 중..",
        orderDateTime: orderDetail?.orderDateTime ? moment(orderDetail.orderDateTime) : null,
        recipient: orderDetail?.recipient?.recipient,
        deliveryAddress: orderDetail?.recipient?.recipientAddress,
        orderMemo: orderDetail?.orderMemo,
      });
    }
  }, [orderDetail, form]);

  useEffect(() => {
    if (isServerUnstable) {
      message.warning("일부 서비스에 연결할 수 없습니다. 데이터가 부분적으로 표시될 수 있습니다.");
    }
  }, [isServerUnstable]);

  const productData = orderDetail?.availableProductInformation
    ? orderDetail?.productOrderList?.productOrderList.map((product, index) => ({
        key: index,
        no: index + 1,
        name: product.name,
        quantity: product.quantity,
        discountAmount: product.discountAmount,
        finalPrice: product.finalPrice,
        status: product.status,
      })) || []
    : [{ key: 0, name: "불러오는 중.." }];

  const textStyle = {
    display: "block",
    padding: "4px 11px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #d9d9d9",
    borderRadius: "2px",
    minHeight: "32px",
  };

  const cardStyle = {
    marginBottom: "16px",
    border: "1px solid #d9d9d9",
    borderRadius: "2px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  };

  const cardStyles = {
    head: {
      padding: "8px 16px",
    },
    body: {
      padding: "16px",
    },
  };

  const formItemStyle = {
    marginBottom: "6px",
  };

  return (
    <Drawer title='일반주문 상세' placement='right' onClose={onClose} visible={visible} width={720}>
      <Form form={form} layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Card title='주문 정보' style={cardStyle} styles={cardStyles}>
              <Row gutter={70} align='middle' justify='center'>
                <Col span={6}>
                  <Form.Item name='orderDetailId' label='주문번호' style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue("orderDetailId")}</Text>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name='memberId' label='회원번호' style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue("memberId")}</Text>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name='orderStatus' label='주문상태' style={formItemStyle}>
                    <Tag color={tagColors[orderDetail?.orderStatusCode] || "default"}>
                      {orderDetail?.orderStatusCode}
                    </Tag>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name='orderDateTime' label='주문날짜' style={formItemStyle}>
                    <Text style={textStyle}>
                      {form.getFieldValue("orderDateTime")?.format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={60} justify='center'>
                <Col span={6}>
                  <Form.Item name='recipient' label='수령인' style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue("recipient")}</Text>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item name='deliveryAddress' label='배송지' style={formItemStyle}>
                    <Text style={textStyle}>{form.getFieldValue("deliveryAddress")}</Text>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card title='주문 상품' style={cardStyle} styles={cardStyles}>
              <Table dataSource={productData} columns={columns} pagination={false} />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card title='배송 메모' style={cardStyle} styles={cardStyles}>
              <Form.Item name='orderMemo'>
                <Text style={{ ...textStyle, minHeight: "120px", whiteSpace: "pre-wrap" }}>
                  {form.getFieldValue("orderMemo")}
                </Text>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EasyOrderGeneralDetail;
