import { registerNormalProduct, getAllCategories, getCategoryDetails, registerEcoFriendlyProduct } from '../../apis/apisProducts';
import { Flex, Radio, Upload , message, Breadcrumb, Input, Button, Form, Cascader, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { Dragger } = Upload;

const props = {
  beforeUpload: (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(`You can only upload JPG/PNG file!`);
    }
    
    return isJpgOrPng || Upload.LIST_IGNORE;
  },
  
  onChange: (info) => {
    console.log(info.fileList);
  },
};


const ProductCreate = () => {

  const [form] = Form.useForm();
  const [defaultImage, setDefaultImage] = useState(null);
  const [detailImages, setDetailImages] = useState([]);
  const [certificationImage, setCertificationImage] = useState(null)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const navigate = useNavigate();
  const [selectedFoodType, setSelectedFoodType] = useState('일반식품'); // 초기값 설정

  // const onClickSubmit = () => {
  //   navigate(-1); // 이전 페이지로 이동
  // };

  // 이미지 단건 파일 업로드
  const onHandleDefaultImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file instanceof File) {
      setDefaultImage(file);
      console.log('Default image set:', file);
    } else {
      console.error('Selected default image is not a File object:', file);
    }
  };

  // 이미지 다건 파일 리스트 업로드
  const onHandleDetailImagesUpload = ({ fileList }) => {
    const files = fileList.map(file => file.originFileObj).filter(file => file instanceof File);
    setDetailImages(files);
    console.log('Detail images uploaded:', files);
  };

  // 인증서 파일 업로드
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
      const normalProduct = {
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
        response = await registerNormalProduct(normalProduct, defaultImage, detailImages);
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
        // navigate(-1);
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

  // const onHandleBackClick = () => {
  //   navigate(-1); // 이전 페이지로 이동
  // };

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
    // Form의 해당 필드 값을 수동으로 설정
    form.setFieldsValue({
      mainCategoryId: value[0],
      subCategoryId: value[1]
    });
  };


  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Radio.Group onChange={handleRadioChange} value={selectedFoodType}>
          <Radio value="일반식품">일반식품</Radio>
          <Radio value="친환경식품">친환경식품</Radio>
        </Radio.Group>
      </Flex>

      {selectedFoodType === '일반식품' && (
        <Flex vertical>
          <Flex gap="small" justify='flex-start'>
            <Flex gap="small" wrap>
              <h2>일반식품 등록</h2>
            </Flex>
            <Flex gap="small" align='center' wrap>
              <Breadcrumb
                items={[
                  {
                    title: 'Main',
                  },
                  {
                    title: <a href="./general">일반식품관리</a>,
                  },
                  {
                    title: '일반식품등록',
                  },
                ]}
              />
            </Flex>
          </Flex>

          <br/>
          <br/>

          
          <Form form={form} onFinish={onHandleSubmit}>
            <Flex gap='10rem'>
              <Flex className='imageSpace' gap='3rem' vertical>
                <Upload  
                  beforeUpload={() => false} 
                  onChange={onHandleDefaultImageUpload}
                >
                  <Button icon={<UploadOutlined />}>식품이미지업로드</Button>
                </Upload>
                <Upload  
                  beforeUpload={() => false} 
                  maxCount={5} 
                  multiple
                  onChange={onHandleDetailImagesUpload}>
                  <Button icon={<UploadOutlined />}>식품상세이미지업로드(1/5)</Button>
                </Upload>
              </Flex>

              <Flex className='inputSpace' gap='5rem' vertical>
                <Flex className='inputSpace1' gap='3rem'>
                  <Form.Item name="customerId" label="고객ID" rules={[{ required: true, message: '고객 ID를 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Cascader
                    style={{ width: 180, height: 40 }}
                    options={categories}
                    onChange={onHandleCategoryChange}
                    placeholder="카테고리 선택"
                  />
                </Flex>

                <Flex className='inputSpace2' gap='3rem'>
                  <Form.Item name="productName" label="상품명" rules={[{ required: true, message: '상품명을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="description" label="상품설명" rules={[{ required: true, message: '상품설명을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="price" label="가격" rules={[{ required: true, message: '가격을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                </Flex>

                <Flex className='inputSpace3' gap='3rem'>
                  <Form.Item name="origin" label="원산지" rules={[{ required: true, message: '원산지를 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="baseDiscountRate" label="가격할인율" rules={[{ required: true, message: '가격할인율을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="regularDiscountRate" label="정기배송할인율" rules={[{ required: true, message: '정기배송할인율을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="personalizedDiscountRate" label="맞춤회원정기배송할인율" rules={[{ required: true, message: '맞춤회원정기배송할인율을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                </Flex>

                <Flex className='inputSpace4' gap='3rem'>
                  <Form.Item name="isRegularSale" label="정기구매지원여부" rules={[{ required: true, message: '정기구매지원여부를 선택해주세요' }]}>
                    <Select style={{ width: 120 }}>
                      <Select.Option value="T">O</Select.Option>
                      <Select.Option value="F">X</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="isPageVisibility" label="페이지노출여부" rules={[{ required: true, message: '페이지노출여부를 선택해주세요' }]}>
                    <Select style={{ width: 120 }}>
                      <Select.Option value="T">O</Select.Option>
                      <Select.Option value="F">X</Select.Option>
                    </Select>
                  </Form.Item>
                </Flex>

                <Flex className='inputSpace5' gap='3rem' justify='flex-end'>
                  <Button 
                    size='large' 
                    type='primary' 
                    htmlType='submit'>등록하기</Button>
                </Flex>
      
              </Flex>
            </Flex>
          </Form>
          
         
        </Flex>
      )}

      {selectedFoodType === '친환경식품' && (
        <Flex vertical>
          <Flex gap="small" justify='flex-start'>
            <Flex gap="small" wrap>
              <h2>친환경식품 등록</h2>
            </Flex>
            <Flex gap="small" align='center' wrap>
              <Breadcrumb
                items={[
                  {
                    title: 'Main',
                  },
                  {
                    title: <a href="./eco">친환경식품관리</a>,
                  },
                  {
                    title: '친환경식품등록',
                  },
                ]}
              />
            </Flex>
          </Flex>
          <br/>
          <br/>
          <Form form={form} onFinish={onHandleSubmit}>
            <Flex gap='10rem'>
              <Flex className='imageSpace' gap='3rem' vertical>
                <Upload  
                  beforeUpload={() => false} 
                  // {...props} 
                  onChange={onHandleDefaultImageUpload}
                >
                  <Button icon={<UploadOutlined />}>식품이미지업로드</Button>
                </Upload>
                <Upload  
                  beforeUpload={() => false} 
                  // {...props} 
                  maxCount={5} 
                  multiple
                  onChange={onHandleDetailImagesUpload}>
                  <Button icon={<UploadOutlined />}>식품상세이미지업로드(1/5)</Button>
                </Upload>
              </Flex>

              <Flex className='inputSpace' gap='5rem' vertical>
                <Flex className='inputSpace1' gap='3rem'>
                  {/* <p>고객ID</p> */}
                  <Form.Item name="customerId" label="고객ID" rules={[{ required: true, message: '고객 ID를 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Cascader
                    style={{ width: 180, height: 40 }}
                    options={categories}
                    onChange={onHandleCategoryChange}
                    placeholder="카테고리 선택"
                  />
                </Flex>

                <Flex className='inputSpace2' gap='3rem'>
                  <Form.Item name="productName" label="상품명" rules={[{ required: true, message: '상품명을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="description" label="상품설명" rules={[{ required: true, message: '상품설명을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="price" label="가격" rules={[{ required: true, message: '가격을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                </Flex>

                <Flex className='inputSpace3' gap='3rem'>
                  <Form.Item name="origin" label="원산지" rules={[{ required: true, message: '원산지를 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="baseDiscountRate" label="가격할인율" rules={[{ required: true, message: '가격할인율을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="regularDiscountRate" label="정기배송할인율" rules={[{ required: true, message: '정기배송할인율을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="personalizedDiscountRate" label="맞춤회원정기배송할인율" rules={[{ required: true, message: '맞춤회원정기배송할인율을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                </Flex>

                <Flex className='inputSpace4' gap='3rem'>
                  <Form.Item name="isRegularSale" label="정기구매지원여부" rules={[{ required: true, message: '정기구매지원여부를 선택해주세요' }]}>
                    <Select style={{ width: 120 }}>
                      <Select.Option value="T">O</Select.Option>
                      <Select.Option value="F">X</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="isPageVisibility" label="페이지노출여부" rules={[{ required: true, message: '페이지노출여부를 선택해주세요' }]}>
                    <Select style={{ width: 120 }}>
                      <Select.Option value="T">O</Select.Option>
                      <Select.Option value="F">X</Select.Option>
                    </Select>
                  </Form.Item>
                </Flex>

                <Flex className='inputSpace5' gap='3rem'>
                  <Form.Item name="certificationName" label="인증서명" rules={[{ required: true, message: '인증서명을 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="certificationNumber" label="인증서번호" rules={[{ required: true, message: '인증서 번호를 입력해주세요' }]} style={{ width: 280, height: 40 }}>
                    <Input />
                  </Form.Item>
                  <Upload  
                    beforeUpload={() => false} 
                    // {...props} 
                    maxCount={5} 
                    multiple
                    onChange={onHandleCertificationImageUpload}>
                  <Button icon={<UploadOutlined />}>인증서업로드</Button>
                </Upload>
                </Flex>

                <Flex className='inputSpace5' gap='3rem' justify='flex-end'>
                  <Button 
                    size='large' 
                    type='primary' 
                    htmlType='submit'>등록하기</Button>
                </Flex>
      
                </Flex>
            </Flex>
          </Form>
        </Flex>
      )}


    </div>
  )
}

export default ProductCreate
