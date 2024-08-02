import { registerNormalProduct, getAllCategories, getCategoryDetails, registerEcoFriendlyProduct } from '../../apis/apisProducts';
import { Flex, Radio, Upload, message, Breadcrumb, Input, Button, Form, Cascader, Select, Card, Row, Col, InputNumber, Switch, Typography } from 'antd';
import { UploadOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { Title } = Typography;

const ProductCreate = () => {
  const [form] = Form.useForm();
  const [defaultImage, setDefaultImage] = useState(null);
  const [detailImages, setDetailImages] = useState([]);
  const [certificationImage, setCertificationImage] = useState(null);
  const [certificationNumber, setCertificationNumber] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState('일반식품');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      const categoriesWithDetails = await Promise.all(
        categoriesData.map(async (category) => {
          const details = await getCategoryDetails(category.productCategoryId);
          return {
            value: category.productCategoryId,
            label: category.categoryName,
            children: details.productDetailCategoryList.map(detail => ({
              value: detail.productDetailCategoryId,
              label: detail.categoryDetailName
            }))
          };
        })
      );
      setCategories(categoriesWithDetails);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onHandleDefaultImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file instanceof File) {
      setDefaultImage(file);
    } else {
      console.error('Selected default image is not a File object:', file);
    }
  };

  const onHandleDetailImagesUpload = ({ fileList }) => {
    const files = fileList.map(file => file.originFileObj).filter(file => file instanceof File);
    setDetailImages(files);
  };

  const onHandleCertificationImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file instanceof File) {
      setCertificationImage(file);
    } else {
      console.error('Selected certification image is not a File object:', file);
    }
  };

  const onHandleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productData = {
        customerId: values.customerId,
        mainCategoryId: selectedCategory[0],
        subCategoryId: selectedCategory[1],
        productName: values.productName,
        description: values.description,
        price: values.price,
        origin: values.origin,
        baseDiscountRate: values.baseDiscountRate,
        isRegularSale: values.isRegularSale,
        regularDiscountRate: values.regularDiscountRate,
        personalizedDiscountRate: values.personalizedDiscountRate,
        isPageVisibility: values.isPageVisibility,
      };

      if (selectedFoodType === '친환경식품') {
        productData.certification = {
          name: values.certificationName,
          serialNumber: values.certificationNumber
        };
      }

      if (!defaultImage) {
        message.error('기본 이미지를 업로드해주세요.');
        return;
      }

      let response;
      if (selectedFoodType === '일반식품') {
        response = await registerNormalProduct(productData, defaultImage, detailImages);
      } else {
        if (!certificationImage) {
          message.error('인증서 이미지를 업로드해주세요.');
          return;
        }
        response = await registerEcoFriendlyProduct(productData, defaultImage, certificationImage, detailImages);
      }

      if(response === null) {
        message.success('상품이 성공적으로 등록되었습니다.');
        navigate('/product/general');
      }
    } catch (error) {
      message.error('상품 등록에 실패했습니다.');
      console.error(error);
    }
  };

  const handleRadioChange = (e) => {
    setSelectedFoodType(e.target.value);
  };

  const onHandleCategoryChange = (value) => {
    setSelectedCategory(value);
    form.setFieldsValue({
      mainCategoryId: value[0],
      subCategoryId: value[1]
    });
  };

  const cardStyle = {
    marginBottom: '16px',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  const cardStyles = {
    head: { padding: '8px 16px' },
    body: { padding: '16px' }
  };

  const formItemStyle = { marginBottom: '8px' };
  const inputStyle = { fontSize: '13px', width: '90%' };



  const formatCertificationNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 5)}-${numbers.slice(5, 9)}`;
    }
  };

  const handleCertificationNumberChange = (e) => {
    const { value } = e.target;
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 9) {
      setCertificationNumber(formatCertificationNumber(numbers));
      form.setFieldsValue({ certificationNumber: formatCertificationNumber(numbers) });
    }
  };



  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <Flex gap="small" justify="flex-start" align="center">
        <LeftOutlined onClick={() => navigate(-1)} />
        <Title level={3} style={{ margin: 0 }}>
          {selectedFoodType === '일반식품' ? '일반식품 등록' : '친환경식품 등록'}
        </Title>
        <Breadcrumb
          items={[
            { title: 'Main' },
            { title: selectedFoodType === '일반식품' ? <a href="./general">일반식품관리</a> : <a href="./eco">친환경식품관리</a> },
            { title: selectedFoodType === '일반식품' ? '일반식품등록' : '친환경식품등록' },
          ]}
          style={{ marginLeft: '16px', fontSize: '12px' }}
        />
      </Flex>

      <Radio.Group onChange={handleRadioChange} value={selectedFoodType} style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Radio value="일반식품">일반식품</Radio>
        <Radio value="친환경식품">친환경식품</Radio>
      </Radio.Group>

      <Form form={form} layout="vertical" onFinish={onHandleSubmit}>
        <Row gutter={16}>
          <Col span={6}>
            <Card title="이미지 업로드" style={{...cardStyle, height: '95%'}} styles={cardStyles}>
              <Flex vertical justify="space-between" style={{height: '100%'}}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Upload
                    beforeUpload={() => false}
                    onChange={onHandleDefaultImageUpload}
                  >
                    <Button icon={<UploadOutlined />}>식품 이미지 업로드</Button>
                  </Upload>
                  <Upload
                    beforeUpload={() => false}
                    onChange={onHandleDetailImagesUpload}
                    multiple
                    maxCount={5}
                  >
                    <Button icon={<UploadOutlined />}>
                      상세 이미지 업로드 ({detailImages.length}/5)
                    </Button>
                  </Upload>
                  {selectedFoodType === '친환경식품' && (
                    <Upload
                      beforeUpload={() => false}
                      onChange={onHandleCertificationImageUpload}
                    >
                      <Button icon={<UploadOutlined />}>인증서 이미지 업로드</Button>
                    </Upload>
                  )}
                </div>
              </Flex>
            </Card>
          </Col>
          <Col span={18}>
            <Card title="상품 정보" style={cardStyle} styles={cardStyles}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="customerId" label="고객 ID" style={formItemStyle}>
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="productName" label="상품명" rules={[{ required: true, message: '상품명은 필수입니다' }]} style={formItemStyle}>
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="카테고리" rules={[{ required: true }]} style={formItemStyle}>
                    <Cascader
                      options={categories}
                      onChange={onHandleCategoryChange}
                      placeholder="카테고리 선택"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item 
                    name="price" l
                    label="가격" 
                    rules={[
                    { required: true, message: '가격은 필수입니다' },
                    { pattern: /^[0-9]+$/, message: '숫자만 입력해주세요' }
                  ]} 
                    style={formItemStyle}>
                    <Input.Group compact>
                      <InputNumber
                        style={{ ...inputStyle, width: 'calc(100% - 65px)' }}
                        parser={value => value.replace(/\D/g, '')}
                      />
                      <Input
                        style={{ width: '38px', textAlign: 'center', pointerEvents: 'none' }}
                        placeholder="원"
                        disabled
                      />
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    name="baseDiscountRate" 
                    label="기본 할인율" 
                    rules={[
                      { required: true, message: '기본할인율은 필수입니다' },
                      { pattern: /^[0-9]+$/, message: '숫자만 입력해주세요' }
                    ]} 
                    style={formItemStyle}>
                    <Input.Group compact>
                      <InputNumber
                        style={{ ...inputStyle, width: 'calc(100% - 65px)' }}
                        parser={value => value.replace(/\D/g, '')}
                      />
                      <Input
                        style={{ width: '38px', textAlign: 'center', pointerEvents: 'none' }}
                        placeholder="%"
                        disabled
                      />
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.isRegularSale !== currentValues.isRegularSale}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('isRegularSale') ? (
                        <Form.Item 
                          name="regularDiscountRate" 
                          label="정기 배송 할인율" 
                          rules={[
                            { required: true, message: '정기배송할인율은 필수입니다' },
                            { pattern: /^[0-9]+$/, message: '숫자만 입력해주세요' }
                          ]} 
                          style={formItemStyle}>
                          <Input.Group compact>
                            <InputNumber
                              style={{ ...inputStyle, width: 'calc(100% - 65px)' }}
                              parser={value => value.replace(/\D/g, '')}
                            />
                            <Input
                              style={{ width: '38px', textAlign: 'center', pointerEvents: 'none' }}
                              placeholder="%"
                              disabled
                            />
                          </Input.Group>
                        </Form.Item>
                      ) : null
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="origin" label="원산지" rules={[{ required: true,message: '원산지는 필수입니다.' }]} style={formItemStyle}>
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="isRegularSale" label="정기 구매 지원 여부" valuePropName="checked" style={formItemStyle}>
                    <Switch checkedChildren="O" unCheckedChildren="X" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="isPageVisibility" label="페이지 노출 여부" valuePropName="checked" style={formItemStyle}>
                    <Switch checkedChildren="O" unCheckedChildren="X" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={selectedFoodType === '친환경식품' ? 12 : 24}>
            <Card title="추가 정보" style={{...cardStyle, width: '100%'}} styles={cardStyles}>
              <Form.Item name="description" label="상품 설명" style={formItemStyle}>
                <Input.TextArea rows={4} style={{...inputStyle, width: '100%'}} />
              </Form.Item>
            </Card>
          </Col>
          {selectedFoodType === '친환경식품' && (
            <Col span={12}>
              <Card title="인증서 정보" style={{...cardStyle, width: '100%', height: '88.5%'}} styles={cardStyles}>
                <Form.Item name="certificationName" label="인증서명" rules={[{ required: true, message: '인증서명은 필수입니다' }]} style={formItemStyle}>
                  <Input style={inputStyle} />
                </Form.Item>
                <Form.Item 
                  name="certificationNumber" 
                  label="인증서 번호" 
                  rules={[
                    { required: true, message: '인증서 번호는 필수입니다' },
                    { 
                      validator: (_, value) => {
                        const numbers = value.replace(/[^\d]/g, '');
                        if (numbers.length !== 9) {
                          return Promise.reject('인증서 번호는 9자리 숫자여야 합니다');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]} 
                  style={formItemStyle}
                >
                  <Input 
                    style={inputStyle} 
                    value={certificationNumber}
                    onChange={handleCertificationNumberChange}
                    maxLength={11}
                  />
                </Form.Item>
              </Card>
            </Col>
          )}
        </Row>
        <Flex justify="flex-end">
          <Button type="primary" htmlType="submit" size="large">
            등록하기
          </Button>
        </Flex>
      </Form>
    </div>
  );
};

export default ProductCreate;