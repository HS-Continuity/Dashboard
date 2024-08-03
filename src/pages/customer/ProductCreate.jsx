import { registerNormalProduct, getAllCategories, getCategoryDetails, registerEcoFriendlyProduct } from '../../apis/apisProducts';
import { Flex, Radio, Upload, message, Breadcrumb, Input, Button, Form, Cascader, Select, Typography } from 'antd';
import { UploadOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from "../../stores/useAuthStore";

const { Title } = Typography;
const { TextArea } = Input;

const ProductCreate = () => {
  const [form] = Form.useForm();
  const [defaultImage, setDefaultImage] = useState(null);
  const [detailImages, setDetailImages] = useState([]);
  const [certificationImage, setCertificationImage] = useState(null)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [certificationNumber, setCertificationNumber] = useState('');

  const { username } = useAuthStore();

  const navigate = useNavigate();
  const [selectedFoodType, setSelectedFoodType] = useState('일반식품');

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const onHandleDefaultImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file instanceof File) {
      setDefaultImage(file);
      console.log('Default image set:', file);
    } else {
      console.error('Selected default image is not a File object:', file);
    }
  };

  const onHandleDetailImagesUpload = ({ fileList }) => {
    const files = fileList.map(file => file.originFileObj).filter(file => file instanceof File);
    setDetailImages(files);
    console.log('Detail images uploaded:', files);
  };

  const onHandleCertificationImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file instanceof File) {
      setCertificationImage(file);
      console.log('Certification image set:', file);
    } else {
      console.error('Selected certification image is not a File object:', file);
    }
  };

  const onHandleSubmit = async () => {
    console.log("onHandleSubmit 함수가 호출되었습니다.");
    try {
      const values = await form.validateFields();
      const product = {
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
        product.certification = {
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
        response = await registerNormalProduct(product, defaultImage, detailImages);
      } else {
        if (!certificationImage) {
          message.error('인증서 이미지를 업로드해주세요.');
          return;
        }
        response = await registerEcoFriendlyProduct(product, defaultImage, certificationImage, detailImages);
      }
  
      console.log(response);
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

  const onHandleCategoryChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setSelectedCategory(value);
    form.setFieldsValue({
      mainCategoryId: value[0],
      subCategoryId: value[1]
    });
  };

  const inputStyle = {
    // fontSize: '14px',
    // height: '32px',
    backgroundColor: 'white', // 비활성화된 입력 필드의 배경색 변경
    color: 'black', // 비활성화된 입력 필드의 텍스트 색상 변경
    opacity: 1, // 비활성화된 입력 필드의 투명도 설정
    border: '1px solid #d9d9d9', // 비활성화된 입력 필드의 테두리 설정
  };

   // 인증번호 포맷팅 함수
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
    const formattedNumber = formatCertificationNumber(e.target.value);
    setCertificationNumber(formattedNumber);
    form.setFieldsValue({ certificationNumber: formattedNumber });
  };

  return (
    <div style={{ padding: '20px' }}>
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
      {/* <Breadcrumb style={{ marginBottom: '20px' }}
        items={[
          { title: 'Main' },
          { title: selectedFoodType === '일반식품' ? '일반식품관리' : '친환경식품관리' },
          { title: `${selectedFoodType} 등록` },
        ]}
      /> */}

      <Radio.Group onChange={handleRadioChange} value={selectedFoodType} style={{ marginBottom: '20px' }}>
        <Radio value="일반식품">일반식품</Radio>
        <Radio value="친환경식품">친환경식품</Radio>
      </Radio.Group>

      <Form form={form} onFinish={onHandleSubmit} layout="vertical" initialValues={{ customerId: username }}>
        <Flex gap="large">
          <Flex vertical gap="middle" style={{ width: '30%' }}>
            <Form.Item label="상품 이미지">
              <Upload beforeUpload={() => false} onChange={onHandleDefaultImageUpload}>
                <Button icon={<UploadOutlined />}>식품이미지업로드</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="상세 이미지">
              <Upload beforeUpload={() => false} maxCount={5} multiple onChange={onHandleDetailImagesUpload}>
                <Button icon={<UploadOutlined />}>식품상세이미지업로드({detailImages.length}/5)</Button>
              </Upload>
            </Form.Item>
            {selectedFoodType === '친환경식품' && (
              <Form.Item label="인증서">
                <Upload beforeUpload={() => false} onChange={onHandleCertificationImageUpload}>
                  <Button icon={<UploadOutlined />}>인증서업로드</Button>
                </Upload>
              </Form.Item>
            )}
          </Flex>

          <Flex vertical gap="middle" style={{ width: '70%' }}>
            <Flex gap="middle">
              <Form.Item 
                name="customerId" 
                label="고객ID" 
                rules={[{ required: true }]} 
                style={{ width: '30%' }}>
                <Input disabled style={inputStyle} />
              </Form.Item>
              <Form.Item label="카테고리" style={{ width: '30%' }}>
                <Cascader options={categories} onChange={onHandleCategoryChange} placeholder="카테고리 선택" />
              </Form.Item>
            </Flex>

            <Flex gap="middle">
              <Form.Item name="productName" label="상품명" rules={[{ required: true, message: '상품명을 입력하세요' }]} style={{ width: '30%' }}>
                <Input />
              </Form.Item>
              <Form.Item 
                name="price" 
                label="가격" 
                rules={[
                  { required: true, message: '가격을 입력하세요' },
                  { pattern: /^[0-9]*$/, message: '숫자를 입력하세요' }
                ]} 
                style={{ width: '30%' }}>
                <Input suffix= '원'/>
              </Form.Item>
              <Form.Item name="origin" label="원산지" rules={[{ required: true, message: '원산지를 입력하세요' }]} style={{ width: '30%' }}>
                <Input />
              </Form.Item>
            </Flex>

            <Form.Item name="description" label="상품 설명" rules={[{ required: true, message: '상품설명을 입력하세요' }]}>
              <TextArea rows={4} />
            </Form.Item>

            <Flex gap="middle">
            <Form.Item name="isRegularSale" label="정기구매지원여부" rules={[{ required: true }]} style={{ width: '30%' }}>
                <Select>
                  <Select.Option value="T">O</Select.Option>
                  <Select.Option value="F">X</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="isPageVisibility" label="페이지노출여부" rules={[{ required: true }]} style={{ width: '30%' }}>
                <Select>
                  <Select.Option value="T">O</Select.Option>
                  <Select.Option value="F">X</Select.Option>
                </Select>
              </Form.Item>
            </Flex>

            <Flex gap="middle">
              <Form.Item 
                name="baseDiscountRate" 
                label="가격할인율" 
                rules={[
                  { required: true, message: '가격할인율을 입력하세요' },
                  { pattern: /^[0-9]*$/, message: '숫자를 입력하세요' }
                ]} 
                style={{ width: '30%' }}>
                <Input suffix= '%'/>
              </Form.Item>
              <Form.Item 
                noStyle 
                shouldUpdate={(prevValues, currentValues) => prevValues.isRegularSale !== currentValues.isRegularSale}
              >
                {({ getFieldValue }) => 
                  getFieldValue('isRegularSale') === 'T' ? (
                  <Form.Item 
                  name="regularDiscountRate" 
                  label="정기배송할인율" 
                  rules={[
                    { required: true, message: '정기배송할인율을 입력하세요' },
                    { pattern: /^[0-9]*$/, message: '숫자를 입력하세요' }
                  ]} 
                  style={{ width: '30%' }}>
                    <Input suffix= '%'/>
                </Form.Item>

                  ) : null
                }
              </Form.Item>
            </Flex>
            
            {selectedFoodType === '친환경식품' && (
              <Flex gap="middle">
                <Form.Item name="certificationName" label="인증서명" rules={[{ required: true, message: '인증서명을 입력하세요' }]} style={{ width: '30%' }}>
                  <Input />
                </Form.Item>
                <Form.Item 
                  name="certificationNumber" 
                  label="인증서번호" 
                  rules={[
                    { 
                      required: true, 
                      message: '인증서 번호를 입력하세요' 
                    },
                    { 
                      pattern: /^\d{4}-\d-\d{4}$/, 
                      message: '올바른 형식으로 입력해주세요 (0000-0-0000)' 
                    }
                  ]} 
                  style={{ width: '30%' }}>
                  <Input value={certificationNumber} onChange={handleCertificationNumberChange} />
                  </Form.Item>
              </Flex>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                등록하기
              </Button>
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </div>
  );
}

export default ProductCreate;