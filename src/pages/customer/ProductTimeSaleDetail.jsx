import { fetchTimeSaleProductItemByItems, updateProduct, deleteProduct } from '../../apis';
import { Flex, Breadcrumb, Select, Button, DatePicker, Space, Form, Input } from 'antd';
import { LeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams  } from 'react-router-dom';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Image } from 'antd';
import moment from 'moment';

const ProductTimeSaleDetail = () => {

  const navigate = useNavigate();
  const {productId} = useParams();
  const [productForm, setProductForm] = useState({}); // 각 필드별 상태 관리

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 해당 productId 상품 데이터 조회
  const { data: timeAttack, isLoading, isError, error } = useQuery({
    queryKey: ["timeAttack", productId],
    queryFn: () => fetchTimeSaleProductItemByItems(productId),
    enabled: !!productId,  //  productId가 유효한 경우에만 쿼리 실행
    staleTime: 60 * 1000,  //  1분 동안 캐시 유지
  });
  console.log(productForm)

  // useMutation을 사용하여 상품 정보 업데이트
  const mutation = useMutation({
    mutationFn: (updatedProduct) => updateProduct(productId, updatedProduct),
    onSuccess: () => {
      alert('상품 정보가 성공적으로 수정되었습니다.');
      navigate('/general');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      alert('상품 정보 수정에 실패했습니다. 다시 시도해주세요.');
    }
  });

  //useMutation을 사용하여 상품 삭제
  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      alert('상품이 성공적으로 삭제되었습니다.');
      navigate('/general'); // 삭제 후 상품 목록 페이지로 이동
      console.log("성공productId:", productId)
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      console.log("오류productId:",productId)

      // 에러 처리 세분화 (삭제 API 에러에 맞게 수정)
      if (error.response) {
        switch (error.response.status) {
          case 404:
            alert('해당 상품을 찾을 수 없습니다.');
            break;
          case 403: // 예시: 권한이 없는 경우
            alert('상품 삭제 권한이 없습니다.');
            break;
          default:
            alert('상품 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } else {
        alert('상품 삭제 중 오류가 발생했습니다.');
      }
    },
  });

  // 수정버튼 클릭
  const onHandleUpdateClick = async () => {
    console.log('무슨아이템을가지고있니?:',productId)
    try {
      // productForm 데이터 유효성 검증 로직 추가
      if (!productForm.productName || !productForm.productPrice || isNaN(productForm.productPrice)) {
        alert('필수 항목을 모두 입력하고, 가격은 숫자로 입력해주세요.');
        return;
      }
      
      mutation.mutate({ productId, ...productForm });
    } catch (error) {
      console.error('Error updating product:', error);

      // 에러 처리 세분화
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert('잘못된 요청입니다. 입력 값을 확인해주세요.');
            break;
          case 404:
            alert('해당 상품을 찾을 수 없습니다.');
            break;
          default:
            alert('상품 정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        alert('상품 정보 수정 중 오류가 발생했습니다.');
      }
    }
  };

  // 삭제 버튼 클릭
  const onHandleDeleteClick = () => {
    if (window.confirm("정말로 상품을 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  useEffect(() => {
    if (timeAttack) { // timeAttack이 존재하는지 확인
      setProductForm(timeAttack[0]); // product가 배열이 아닐 수 있으므로 바로 설정
      // const endTime = moment(timeAttack.endTime);
      // const currentTime = moment();

      // 시작 시간 Moment 객체 생성
      const startTime = moment(timeAttack[0].startTime);

      // 시작 시간으로부터 3시간 뒤 계산
      const endTime = startTime.clone().add(3, 'hours');

      // 마감 시간을 시작 시간과 같은 형식으로 포맷팅
      const endTimeFormatted = endTime.format('YYYY-MM-DD HH:mm:ss');

      // 마감 여부 자동 설정
      const currentTime = moment();
      const isClosed = currentTime.isAfter(endTime);
      setProductForm({
        ...timeAttack[0],
        endTime: endTimeFormatted, // 계산된 마감 시간 설정
        timeSaleStatus: isClosed ? '마감' : '진행중'
      });
    }
  }, [timeAttack]);

  const onHandleInputChange = (field, e) => {
    setProductForm(prev => ({ ...prev, [field]: e.target.value }));
  };  //  변경된 필드와 값을 받아 editedProduct 상태 업데이트하는 함수

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;


  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small" wrap>
          <h2>타임세일상세정보</h2>
        </Flex>
        <Flex gap="small" align='center' wrap>
          <Breadcrumb
            items={[
              {
                title: 'Main',
              },
              {
                title: <a href="../timeSale">타임세일식품관리</a>,
              },
              {
                title: '타임세일상세정보',
              },
            ]}
          />
        </Flex>
      </Flex>
      <br/>
      <Flex className='content' gap='15rem'>
        <Flex className='imageSpace' gap='3rem'>
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
        <Flex className='formSpace1' gap='5rem' vertical>
          <Form>
            <h3>타임어택세일ID</h3>
            <Input 
              disabled 
              placeholder={timeAttack[0].timeAttackSaleId}
              onChange={onHandleInputChange}/>
          </Form>
          <Form>
            <h3>상품명</h3>
            <Input 
              placeholder={timeAttack[0].productName}
              onChange={onHandleInputChange}/>
          </Form>
          <Form>
            <h3>시작날짜/시간</h3>
            {/* <Input 
              placeholder={timeAttack[0].startTime}
              onChange={onHandleInputChange}/> */}
            <DatePicker
              placeholder={timeAttack[0].startTime}
              showTime
              size='large'
              onChange={(value, dateString) => {
                console.log('Selected Time: ', value);
                console.log('Formatted Selected Time: ', dateString);
              }}
              // onOk={onOk}
            />
          </Form>
          <Form>
            <h3>가격할인율</h3>
            <Input 
            placeholder={timeAttack[0].discountRate}
            addonAfter="%"  
            onChange={onHandleInputChange}/>
          </Form>
        </Flex>
        <Flex className='formSpace2' gap='5rem' vertical>
          <Form>
            <h3>상품ID</h3>
            <Input 
              disabled 
              placeholder={timeAttack[0].productId}
              onChange={onHandleInputChange}/>
          </Form>
          <Form>
            <h3>상품가격</h3>
            <Input 
              placeholder={timeAttack[0].productPrice}
              onChange={onHandleInputChange}/>
          </Form>
          <Form>
            <h3>마감시간</h3>
            <Input 
              placeholder={productForm.endTime}
              onChange={onHandleInputChange}/>
          </Form>
          <Form>
            <h3>마감여부</h3>
            <Select
              disabled
              value={productForm.timeSaleStatus}
              style={{
                width: 120,
              }}
              onChange={(value) => onHandleInputChange('timeSaleStatus', { target: { value } })}
              options={[
                { value: '마감', label: '마감' },
                { value: '진행중', label: '진행중' }
              ]}
            />
          </Form>
        </Flex>
        
      </Flex>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <Flex className='form5' justify='flex-end' gap="middle">
        <Button 
          type="primary" 
          shape="round" 
          icon={<EditOutlined />}
          onClick={onHandleUpdateClick}>
            수정하기
        </Button>
        <Button 
          type="primary" 
          shape="round" 
          icon={<DeleteOutlined />}
          danger
          onClick={onHandleDeleteClick}>
            삭제하기
        </Button>
      </Flex>
      
        
    </div>
  );
};

export default ProductTimeSaleDetail
