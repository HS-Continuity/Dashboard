import { deleteProduct, fetchProductDetail, updateProduct } from '../../apis/apisProducts';
import { useState, useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Flex, Form, Input, InputNumber, Switch, Card, Row, Col, Typography, Button, Space, message } from 'antd';

const { Title } = Typography;

const ProductGeneralDetail = () => {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetchProductDetail(productId);
        setProductDetail(response);
        form.setFieldsValue({
          ...response,
          productId: productId,
          isPageVisibility: response.isPageVisibility === 'T',
          isRegularSale: response.isRegularSale === 'T'
        });
      } catch (error) {
        console.error('Error fetching product detail:', error);
      }
    };

    fetchDetail();
  }, [productId, form]);

  if (!productDetail) {
    return <div>Loading...</div>;
  }

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
  }

  const formItemStyle = {
    marginBottom: '8px'
  };

  const inputStyle = {
    fontSize: '13px'
  };

  const onHandleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        ...values,
        isPageVisibility: values.isPageVisibility ? 'T' : 'F',
        isRegularSale: values.isRegularSale ? 'T' : 'F'
      };
      await updateProduct(productId, updatedData);
      message.success('상품 정보가 성공적으로 수정되었습니다.');
      navigate(-1);  // 상품 목록 페이지로 이동
    } catch (error) {
      console.error('Error updating product: ', error);
      message.error('상품 정보 수정에 실패했습니다.');
    }
  };

  const onHandleDelete = async () => {
    try {
      await deleteProduct(productId);
      message.success('상품이 성공적으로 삭제되었습니다.');
      navigate(-1);  // 상품 목록 페이지로 이동
    } catch (error) {
      console.error('Error deleting product: ', error);
      message.error('상품 삭제에 실패했습니다.');
    }
  };

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <Flex gap="small" justify="flex-start" align="center" style={{ width: 'fit-content' }}>
        <LeftOutlined onClick={onHandleBackClick}/>
        <Title level={3}>식품 등록</Title>
        {/* <Breadcrumb style={{ marginBottom: '20px' }}
          items={[
            { title: 'Main' },
            { title: selectedFoodType === '일반식품' ? '일반식품관리' : '친환경식품관리' },
            { title: `${selectedFoodType} 등록` },
          ]}
        /> */}
      </Flex>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Card 
              title="상품 정보" 
              style={cardStyle} 
              styles={cardStyles}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="productId" label="상품 ID" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="productName" label="상품명" style={formItemStyle}>
                    <Input style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="salesType" label="판매 유형" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="categoryName" label="카테고리" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="detailCategoryName" label="상세 카테고리" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="price" label="가격" style={formItemStyle}>
                    <InputNumber style={{ ...inputStyle, width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="origin" label="원산지" style={formItemStyle}>
                    <Input style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="baseDiscountRate" label="기본 할인율 (%)" style={formItemStyle}>
                    <InputNumber style={{ ...inputStyle, width: '100%' }} />
                  </Form.Item>
                  {/* <Form.Item name="regularDiscountRate" label="정기 배송 할인율 (%)" style={formItemStyle}>
                    <InputNumber style={{ ...inputStyle, width: '100%' }} />
                  </Form.Item> */}
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.isRegularSale !== currentValues.isRegularSale}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('isRegularSale') ? (
                        <Form.Item name="regularDiscountRate" label="정기 배송 할인율 (%)" style={formItemStyle}>
                          <InputNumber style={{ ...inputStyle, width: '100%' }} />
                        </Form.Item>
                      ) : null
                    }
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <Card 
              title="추가 정보" 
              style={cardStyle} 
              styles={cardStyles}
            >
              <Form.Item name="description" label="상품 설명" style={formItemStyle}>
                <Input.TextArea rows={4} style={inputStyle} />
              </Form.Item>
            </Card>
          </Col>
          <Col span={8}>
            <Card 
              title="판매 설정" 
              style={cardStyle} 
              styles={cardStyles}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="isPageVisibility" label="페이지 노출 여부" valuePropName="checked" style={formItemStyle}>
                    <Switch checkedChildren="O" unCheckedChildren="X" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="isRegularSale" label="정기 판매 여부" valuePropName="checked" style={formItemStyle}>
                    <Switch checkedChildren="O" unCheckedChildren="X" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="primary" onClick={onHandleUpdate}>수정하기</Button>
              <Button danger onClick={onHandleDelete}>삭제하기</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductGeneralDetail;