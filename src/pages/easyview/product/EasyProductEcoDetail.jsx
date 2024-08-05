import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Switch,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  message,
  Upload,
} from "antd";
import { FileOutlined } from "@ant-design/icons";
import {
  fetchProductDetail,
  updateProduct,
  fetchProductCertification,
} from "../../../apis/apisProducts";

const { Title } = Typography;

const EasyProductEcoDetail = ({ visible, onClose, productId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [certification, setCertification] = useState(null);

  useEffect(() => {
    if (productId && visible) {
      fetchProductData();
    }
  }, [productId, visible]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await fetchProductDetail(productId);
      form.setFieldsValue({
        ...response,
        productId: productId,
        isPageVisibility: response.isPageVisibility === "T",
        isRegularSale: response.isRegularSale === "T",
      });

      // const certificationResponse = await fetchProductCertification(productId);
      // setCertification(certificationResponse);
    } catch (error) {
      console.error("Error fetching product detail:", error);
      message.error("상품 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
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

  const onHandleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        ...values,
        isPageVisibility: values.isPageVisibility ? "T" : "F",
        isRegularSale: values.isRegularSale ? "T" : "F",
      };
      await updateProduct(productId, updatedData);
      message.success("상품 정보가 성공적으로 수정되었습니다.");
      onClose();
    } catch (error) {
      console.error("Error updating product: ", error);
      message.error("상품 정보 수정에 실패했습니다.");
    }
  };

  const onHandleDownload = file => {
    window.open(file.url);
  };

  const certificationFile = certification
    ? [
        {
          uid: certification.productCertificationId,
          name: certification.certificationName,
          status: "done",
          url: certification.certificationImage,
        },
      ]
    : [];

  return (
    <Drawer
      title={<Title level={3}>친환경 식품 상세 정보</Title>}
      width={720}
      onClose={onClose}
      open={visible}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={onHandleUpdate} type='primary'>
            수정하기
          </Button>
        </Space>
      }>
      <Form form={form} layout='vertical' disabled={loading}>
        <Card title='상품 정보' size='small' style={cardStyle} styles={cardStyles}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name='productId' label='상품 ID' style={formItemStyle}>
                <Input disabled style={disabledInputStyle} />
              </Form.Item>
              <Form.Item name='productName' label='상품명' style={formItemStyle}>
                <Input style={inputStyle} />
              </Form.Item>
              <Form.Item name='salesType' label='판매 유형' style={formItemStyle}>
                <Input disabled style={disabledInputStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='categoryName' label='카테고리' style={formItemStyle}>
                <Input disabled style={disabledInputStyle} />
              </Form.Item>
              <Form.Item name='detailCategoryName' label='상세 카테고리' style={formItemStyle}>
                <Input disabled style={disabledInputStyle} />
              </Form.Item>
              <Form.Item name='price' label='가격' style={formItemStyle}>
                <InputNumber
                  style={{ ...inputStyle, width: "100%" }}
                  formatter={value => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={value => value.replace(/\₩\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='origin' label='원산지' style={formItemStyle}>
                <Input style={inputStyle} />
              </Form.Item>
              <Form.Item name='baseDiscountRate' label='기본 할인율 (%)' style={formItemStyle}>
                <InputNumber
                  style={{ ...inputStyle, width: "100%" }}
                  formatter={value => `${value}%`}
                  parser={value => value.replace("%", "")}
                />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.isRegularSale !== currentValues.isRegularSale
                }>
                {({ getFieldValue }) =>
                  getFieldValue("isRegularSale") ? (
                    <Form.Item
                      name='regularDiscountRate'
                      label='정기 배송 할인율 (%)'
                      style={formItemStyle}>
                      <InputNumber
                        style={{ ...inputStyle, width: "100%" }}
                        formatter={value => `${value}%`}
                        parser={value => value.replace("%", "")}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title='상품 설명' size='small' style={cardStyle} styles={cardStyles}>
          <Form.Item name='description' style={formItemStyle}>
            <Input.TextArea rows={4} style={inputStyle} />
          </Form.Item>
        </Card>
        <Card title='판매 설정' size='small' style={cardStyle} styles={cardStyles}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='isRegularSale'
                label='정기 판매 여부'
                valuePropName='checked'
                style={formItemStyle}>
                <Switch checkedChildren='O' unCheckedChildren='X' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='isPageVisibility'
                label='페이지 노출 여부'
                valuePropName='checked'
                style={formItemStyle}>
                <Switch checkedChildren='O' unCheckedChildren='X' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title='인증서 정보' size='small' style={cardStyle} styles={cardStyles}>
          <Upload fileList={certificationFile} onDownload={onHandleDownload} disabled={true}>
            {certification ? <FileOutlined /> : <p>인증서가 없습니다.</p>}
          </Upload>
          {certification && (
            <>
              <p>인증서 이름: {certification.certificationName}</p>
              <p>인증 번호: {certification.certificationNumber}</p>
            </>
          )}
        </Card>
      </Form>
    </Drawer>
  );
};

export default EasyProductEcoDetail;
