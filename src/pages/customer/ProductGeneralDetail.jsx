import { fetchProductItemByItems } from '../../apis'; // fetchProductItems 함수를 가져오기
import { Flex, Tag, DatePicker, Form, Input, Dropdown, message, Breadcrumb, Space } from 'antd';
import { LeftOutlined, DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'antd';
const { TextArea } = Input;

const ProductGeneralDetail = () => {
  const navigate = useNavigate();
  const {productId} = useParams();
  //const [productItem, setProductItem] = useState([]); // 상품 데이터를 저장할 상태 변수

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const onClickDropDown = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  // useEffect(() => {
  // const getProduct = 
  //   fetchProductItemByItems(식품ID)
  //     .then(data => {
  //       const filteredProducts = data.map(product => ({  //  필요한 데이터만 가져오기
  //         식품ID: product.식품ID,
  //         고객ID: product.고객ID,
  //         상품가격: product.상품가격,
  //         상품상세카페고리ID: product.상품상세카페고리ID,
  //         판매타입코드: product.판매타입코드,
  //         가격할인율: product.가격할인율,
  //         맞춤회원정기배송할인율: product.맞춤회원정기배송할인율,
  //         정기구매지원여부: product.정기구매지원여부,
  //         정기배송할인율: product.정기배송할인율,
  //         페이지노출여부: product.페이지노출여부,
  //         원산지: product.원산지,
  //       }));
  //       setProductItem(filteredProducts); 
  //     })
  //     .catch(error => {
  //       console.error('Error fetching products:', error);
  //     });
  // , []);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () => fetchProductItemByItems(productId)
  });
  console.log("detail product:",product)
  console.log("productId:", productId)

  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small" wrap>
          <h2>일반식품상세정보</h2>
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
                title: '일반식품상세정보',
              },
            ]}
          />
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
              <h3>식품ID</h3>
              <Input disabled placeholder={productId}  />
            </Form>
            <Form>
              <h3>고객ID</h3>
              <Input disabled placeholder='123'  />
            </Form>
            <Form>
              <h3>식품상세카테고리</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>판매타입코드</h3>
              <Input disabled placeholder='123456'  />
            </Form>
          </Flex>

          <Flex className='form2' gap="2rem">
            <Form>
              <h3>식품명</h3>
              <Input placeholder={product?.식품명}  />
            </Form>
            <Form>
              <h3>식품설명</h3>
              <TextArea 
              showCount 
              maxLength={100} 
              placeholder="상품설명..."
              // onChange={onTextChange}
              style={{ width: '450px' }}
              />
            </Form>
            <Form>
              <h3>식품가격</h3>
              <Input placeholder='1234'  />
            </Form>
          </Flex>

          <Flex className='form3' gap="2rem">
            <Form>
              <h3>가격할인율</h3>
              <Input placeholder='123456'  />
            </Form>
            <Form>
              <h3>맞춤회원정기배송할인율</h3>
              <Input placeholder='123456'  />
            </Form>
            {/* <Form>
              <h3>정기구매지원여부</h3>
              <Dropdown
                menu={{
                  items,
                  onClickDropDown,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    Hover me, Click menu item
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </Form> */}
            <Form>
              <h3>정기배송할인율</h3>
              <Input placeholder='123456'  />
            </Form>
          </Flex>

          <Flex className='form4' gap="2rem">
            <Form>
              <h3>페이지노출여부</h3>
              <Input disabled placeholder='123456'  />
            </Form>
            <Form>
              <h3>원산지</h3>
              <Input placeholder='123456'  />
            </Form>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}

export default ProductGeneralDetail
