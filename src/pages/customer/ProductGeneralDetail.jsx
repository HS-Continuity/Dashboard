import { Flex, Tag, DatePicker, Form, Input, Button, Table } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';
const { TextArea } = Input;

const ProductGeneralDetail = () => {
  const navigate = useNavigate();

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small" wrap>
          <h2>일반식품상세정보</h2>
        </Flex>
      </Flex>
      <br/>
      <Flex  className='content' gap="5rem" >
        <Flex className='imageSpace' gap="3rem">
          <Image.PreviewGroup
            items={[
              'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
              'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
              'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
              ]}
          >
            <Image
              width={250}
              src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
            />
          </Image.PreviewGroup>
        </Flex>
        <Flex className='formSpace' gap="5rem" vertical>
          <Flex className='form1' gap="2rem">
            <Form>
              <h3>상품ID</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>고객ID</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>상품상세카테고리</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>판매타입코드</h3>
              <Input disabled placeholder='123456'  />
            </Form>
          </Flex>

          <Flex className='form2' gap="2rem">
            <Form>
              <h3>상품명</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>상품설명</h3>
              <TextArea 
              showCount 
              maxLength={100} 
              placeholder="상품설명..."
              // onChange={onTextChange}
              style={{ width: '450px' }}
              disabled />
            </Form>
            <Form>
              <h3>상품가격</h3>
              <Input disabled placeholder='123456'  />
            </Form>
          </Flex>

          <Flex className='form3' gap="2rem">
            <Form>
              <h3>가격할인율</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>맞춤회원정기배송할인율</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>정기구매지원여부</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>정기배송할인율</h3>
              <Input disabled placeholder='123456'  />
            </Form>
          </Flex>

          <Flex className='form4' gap="2rem">
            <Form>
              <h3>페이지노출여부</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>원산지</h3>
              <Input disabled placeholder='123456'  />
            </Form>
          </Flex>
          
        </Flex>

      </Flex>
          {/* <Form>
            <h3>상품ID</h3>
            <Input disabled placeholder='123456'  />
          </Form>
          <Form>
            <h3>고객ID</h3>
            <Input disabled placeholder='123456'  />
          </Form>
          <Form>
            <h3>상품상세카테고리</h3>
            <Input disabled placeholder='123456'  />
          </Form>
          <Form>
            <h3>판매타입코드</h3>
            <Input disabled placeholder='123456'  />
          </Form>
        </Flex>
        <Flex gap="3rem">
          <Form>
            <h3>휴대전화번호</h3>
            <Input disabled placeholder='123456'  />
          </Form>
        </Flex>
        <Flex gap="3rem">
          <Form>
            <h3>이메일</h3>
            <Input 
              disabled 
              placeholder='123456'
              style={{ width: 500 }}  />
          </Form>
        </Flex>
        <Flex gap="middle">
          <Form>
            <h3>주소</h3>
            <Form.Item style={{ marginBottom: '1rem'}}>
              <Input 
                disabled 
                placeholder="우편번호" 
                style={{width: 200}}
                />
            </Form.Item>
            <Form.Item style={{ marginBottom: '1rem' }}>
              <Input 
                disabled 
                placeholder="주소" 
                style={{width: 600}}
                />
            </Form.Item>
            <Form.Item>
              <Input 
                disabled 
                placeholder="상세주소" 
                style={{width: 600}}
                />
            </Form.Item>
          </Form>
        </Flex>
      </Flex> */}
        
    </div>
  );
}

export default ProductGeneralDetail
