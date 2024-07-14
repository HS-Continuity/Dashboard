import { Flex, Radio, Upload , message, Breadcrumb, Input, Button, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const props = {
  beforeUpload: (file) => {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error(`${file.name} is not a png file`);
    }
    return isPNG || Upload.LIST_IGNORE;
  },
  onChange: (info) => {
    console.log(info.fileList);
  },
};

const ProductCreate = () => {

  const navigate = useNavigate();
  const [selectedFoodType, setSelectedFoodType] = useState('일반식품'); // 초기값 설정
  const handleRadioChange = (e) => {
    setSelectedFoodType(e.target.value);
  };


  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        {/* <Flex gap="small" wrap>
          <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small" wrap>
          <h2>식품 등록</h2>
        </Flex> */}
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
          <Flex className='content' gap='5rem'>
          <Flex className='imageSpace' gap='3rem' vertical>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>식품이미지업로드</Button>
            </Upload>
            <Upload {...props} maxCount={5}>
              <Button icon={<UploadOutlined />}>식품상세이미지업로드(1/5)</Button>
            </Upload>
          </Flex>

          <Flex className='inputSpace' gap='5rem' vertical>
            <Flex className='inputSpace1' gap='3rem'>
              <Form>
                <h3>고객ID</h3>
                <Input 
                  disabled 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>식품대분류카테고리</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>식품소분류카테고리</h3>
                <Input 
                  placeholder='111'/>
              </Form>
            </Flex>

            <Flex className='inputSpace2' gap='3rem'>
              <Form>
                <h3>상품명</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>상품설명</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>상품가격</h3>
                <Input 
                  placeholder='111'/>
              </Form>
            </Flex>

            <Flex className='inputSpace3' gap='3rem'>
              <Form>
                <h3>원산지</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>가격할인율</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>정기구매지원여부</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>정기배송할인율</h3>
                <Input 
                  placeholder='111'/>
              </Form>
            </Flex>

            <Flex className='inputSpace4' gap='3rem'>
              <Form>
                <h3>맞춤회원정기배송할인율</h3>
                <Input 
                  disabled 
                  placeholder='111'/>
              </Form>
            </Flex>
            <Flex className='inputSpace5' gap='3rem' justify='flex-end'>
              <Button size='large' danger>등록하기</Button>
            </Flex>
          </Flex>
        </Flex>
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
          <Flex className='content' gap='5rem'>
          <Flex className='imageSpace' gap='3rem' vertical>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>식품이미지업로드</Button>
            </Upload>
            <Upload {...props} maxCount={5}>
              <Button icon={<UploadOutlined />}>식품상세이미지업로드(1/5)</Button>
            </Upload>
          </Flex>

          <Flex className='inputSpace' gap='5rem' vertical>
            <Flex className='inputSpace1' gap='3rem'>
              <Form>
                <h3>고객ID</h3>
                <Input 
                  disabled 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>식품대분류카테고리</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>식품소분류카테고리</h3>
                <Input 
                  placeholder='111'/>
              </Form>
            </Flex>

            <Flex className='inputSpace2' gap='3rem'>
              <Form>
                <h3>상품명</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>상품설명</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>상품가격</h3>
                <Input 
                  placeholder='111'/>
              </Form>
            </Flex>

            <Flex className='inputSpace3' gap='3rem'>
              <Form>
                <h3>원산지</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>가격할인율</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>정기구매지원여부</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>정기배송할인율</h3>
                <Input 
                  placeholder='111'/>
              </Form>
            </Flex>

            <Flex className='inputSpace4' gap='3rem'>
              <Form>
                <h3>맞춤회원정기배송할인율</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>인증서명</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>인증서번호</h3>
                <Input 
                  placeholder='111'/>
              </Form>
              <Form>
                <h3>인증서번호</h3>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>인증서 파일 업로드</Button>
                </Upload>
              </Form>
              
            </Flex>
            <Flex className='inputSpace5' gap='3rem' justify='flex-end'>
              <Button size='large' danger>등록하기</Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )}


    </div>
  )
}

export default ProductCreate
