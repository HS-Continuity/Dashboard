import { fetchProductItemByItems, updateProduct, deleteProduct } from '../../apis';
import { Flex, Form, Input, Button, Breadcrumb, Select } from 'antd';
import { LeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { Image } from 'antd';
const { TextArea } = Input;

const ProductGeneralDetail = () => {
  const navigate = useNavigate();
  const {productId} = useParams();
  const [productForm, setProductForm] = useState({}); // 각 필드별 상태 관리
  

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 해당 productId 상품 데이터 조회
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductItemByItems(productId),
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

  // 수정 버튼 클릭
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

    //return axios.delete(`http://localhost:3006/users/1`)
  };

  // useEffect(() => {
  //   if (product && product.length > 0) {
  //     setProductForm(product[0]);
  //   }
  // }, [product]); // product 값이 변경될 때마다 실행
  useEffect(() => {
    if (product) { // product가 존재하는지 확인
      setProductForm(product[0]); // product가 배열이 아닐 수 있으므로 바로 설정
    }
  }, [product]);

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
          <h2>일반식품상세정보</h2>
        </Flex>
        <Flex gap="small" align='center' wrap>
          <Breadcrumb
            items={[
              {
                title: 'Main',
              },
              {
                title: <a href="../general">일반식품관리</a>,
              },
              {
                title: '일반식품상세정보',
              },
            ]}
          />
        </Flex>
      </Flex>
      <br/>
      <Flex  className='content' gap="5rem">
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
              <Input 
                disabled 
                placeholder={productId}
                onChange={onHandleInputChange}/>
            </Form>
            <Form>
              <h3>고객ID</h3>
              <Input 
                disabled 
                placeholder={product[0].customerId}
                onChange={onHandleInputChange}/>
            </Form>
            <Form>
              <h3>식품상세카테고리</h3>
              <Input disabled placeholder={product[0].productDetailCategoryId}
              onChange={onHandleInputChange}/>
            </Form>
            <Form>
              <h3>판매타입코드</h3>
              <Input 
                disabled 
                placeholder={product[0].saleTypeCode}
                onChange={onHandleInputChange}/>
            </Form>
          </Flex>

          <Flex className='form2' gap="2rem">
            <Form>
              <h3>식품명</h3>
              <Input 
                placeholder={product[0].productName}  
                value={productForm.productName}
                onChange={(e) => onHandleInputChange('productName', e)} />
            </Form>
            <Form>
              <h3>식품설명</h3>
              <TextArea 
              showCount 
              maxLength={100} 
              placeholder={product[0].productDescription}
              value={productForm.productDescription}
              onChange={(e) => onHandleInputChange('productDescription', e)}
              style={{ width: '450px' }}
              />
            </Form>
            <Form>
              <h3>식품가격</h3>
              <Input 
                placeholder={product[0].productPrice}
                value={productForm.productPrice}
                onChange={(e) => onHandleInputChange('productPrice', e)}/>
            </Form>
          </Flex>

          <Flex className='form3' gap="2rem">
            <Form>
              <h3>페이지노출여부</h3>
              <Select
                value={productForm.pageExposureStatus}
                style={{
                  width: 120,
                }}
                onChange={(value) => onHandleInputChange('pageExposureStatus', { target: { value } })}
                options={[
                  { value: 'O',  label: 'O' },
                  { value: 'X', label: 'X' },
                ]}
              />
            </Form>
            <Form>
              <h3>정기구매지원여부</h3>
              <Select
                value={productForm.regularPurchaseSupportStatus}
                style={{
                  width: 120,
                }}
                onChange={(value) => onHandleInputChange('regularPurchaseSupportStatus', { target: { value } })}
                options={[
                  { value: 'O', label: 'O' },
                  { value: 'X', label: 'X' }
                ]}
              />
            </Form>
            <Form>
              <h3>원산지</h3>
              <Input 
                placeholder={product[0].origin}  
                value={productForm.origin}
                onChange={(e) => onHandleInputChange('origin', e)} />
            </Form>
          </Flex>

          <Flex className='form4' gap="2rem">
            <Form>
              <h3>가격할인율</h3>
              <Input 
                placeholder={product[0].defaultDiscountRate}
                addonAfter="%"  
                value={productForm.defaultDiscountRate}
                onChange={(e) => onHandleInputChange('defaultDiscountRate', e)} />
            </Form>
            <Form>
              <h3>맞춤회원정기배송할인율</h3>
              <Input 
                placeholder={product[0].customizedRegularDeliveryDiscountRate}
                addonAfter="%"  
                value={productForm.customizedRegularDeliveryDiscountRate}
                onChange={(e) => onHandleInputChange('customizedRegularDeliveryDiscountRate', e)} />
            </Form>
            <Form>
              <h3>정기배송할인율</h3>
              <Input 
                placeholder={product[0].regularDeliveryDiscountRate} addonAfter="%"  
                value={productForm.regularDeliveryDiscountRate}
                onChange={(e) => onHandleInputChange('regularDeliveryDiscountRate', e)} />
            </Form>
          </Flex>
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

        </Flex>
        
      </Flex>
    </div>
  );
}

export default ProductGeneralDetail
