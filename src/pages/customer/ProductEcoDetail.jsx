import { deleteProduct, fetchProductDetail, updateProduct, fetchProductCertification } from '../../apis/apisProducts';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Form, Input, InputNumber, Switch, Card, Row, Col, Typography, Button, Space, message, Upload } from 'antd';
import { LeftOutlined, FileOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

const { Title } = Typography;

const ProductEcoDetail = () => {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [certification, setCertification] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailResponse = await fetchProductDetail(productId);
        setProductDetail(detailResponse);
        form.setFieldsValue({
          ...detailResponse,
          productId: productId,
          isPageVisibility: detailResponse.isPageVisibility === 'T',
          isRegularSale: detailResponse.isRegularSale === 'T'
        });

        const certificationResponse = await fetchProductCertification(productId);
        setCertification(certificationResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchData();
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
  };

  const formItemStyle = {
    marginBottom: '8px'
  };

  const inputStyle = {
    fontSize: '13px'
  };

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
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

  // const onHandleDelete = () => {
  //   Swal.fire({
  //     title: '정말 삭제하시겠습니까?',
  //     text: "이 작업은 되돌릴 수 없습니다!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: '삭제하기',
  //     cancelButtonText: '취소'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteProduct(productId)
  //         .then(() => {
  //           Swal.fire(
  //             '삭제완료!',
  //             '상품이 성공적으로 삭제되었습니다.',
  //             'success'
  //           );
  //           navigate(-1);  // 상품 목록 페이지로 이동
  //         })
  //         .catch((error) => {
  //           console.error('Error deleting product: ', error);
  //           Swal.fire(
  //             '삭제 실패',
  //             '상품 삭제에 실패했습니다.',
  //             'error'
  //           );
  //         });
  //     }
  //   });
  // };

  const onHandleDownload = (file) => {
    window.open(file.url);
  };

  const certificationFile = certification ? [
    {
      uid: certification.productCertificationId,
      name: certification.certificationName,
      status: 'done',
      url: certification.certificationImage,
    }
  ] : [];

  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <Flex gap="small" justify="flex-start">
        <LeftOutlined onClick={onHandleBackClick} />
        <Title level={3} style={{ marginBottom: '16px' }}>친환경 식품 상세 정보</Title>
      </Flex>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Card 
              title="식품 정보" 
              style={cardStyle} 
              styles={cardStyles}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="productId" label="식품 ID" style={formItemStyle}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="productName" label="식품명" style={formItemStyle}>
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
                    <InputNumber 
                        style={{ ...inputStyle, width: '100%' }} 
                        formatter={value => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\₩\s?|(,*)/g, '')}
                      />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="origin" label="원산지" style={formItemStyle}>
                    <Input style={inputStyle} />
                  </Form.Item>
                  <Form.Item name="baseDiscountRate" label="기본 할인율 (%)" style={formItemStyle}>
                    <InputNumber 
                      style={{ ...inputStyle, width: '100%' }}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                    />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.isRegularSale !== currentValues.isRegularSale}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('isRegularSale') ? (
                        <Form.Item name="regularDiscountRate" label="정기 배송 할인율 (%)" style={formItemStyle}>
                          <InputNumber 
                            style={{ ...inputStyle, width: '100%' }}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                          />
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
            <Card 
              title="인증서 정보" 
              style={{...cardStyle, marginTop: '16px'}} 
              styles={cardStyles}
            >
              <Upload
                fileList={certificationFile}
                onDownload={onHandleDownload}
                disabled={true}
              >
                {certification ? (
                  <FileOutlined />
                ) : (
                  <p>인증서가 없습니다.</p>
                )}
              </Upload>
              {certification && (
                <>
                  <p>인증서 이름: {certification.certificationName}</p>
                  <p>인증 번호: {certification.certificationNumber}</p>
                </>
              )}
            </Card>
            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="primary" onClick={onHandleUpdate}>수정하기</Button>
              {/* <Button danger onClick={onHandleDelete}>삭제하기</Button> */}
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductEcoDetail;