import { fetchProductItemByName } from '../../apis'; // fetchProductItems 함수를 가져오기
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, Space, Table, Tag, Button, Input, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const InventoryDetail = () => {
  const navigate = useNavigate();
  const {productName} = useParams();
  const [productForm, setProductForm] = useState({}); // 각 필드별 상태 관리

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 해당 productId 상품 데이터 조회
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", productName],
    queryFn: () => fetchProductItemByItems(productName),
    enabled: !!productName,  //  productId가 유효한 경우에만 쿼리 실행
    staleTime: 60 * 1000,  //  1분 동안 캐시 유지
  });

  useEffect(() => {
    if (product) { // product가 존재하는지 확인
      setProductForm(product[0]); // product가 배열이 아닐 수 있으므로 바로 설정
    }
  }, [product]);

  const columns = [
    { title: 'Index', dataIndex: 'index', key: 'index' },
    { title: '상품명', dataIndex: 'productName', key: 'productName' },
    { title: '입고날짜', dataIndex: 'count', key: 'count' },
    { title: '재고수량', dataIndex: 'count', key: 'count' },
  ];

  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small" wrap>
          <h2>입고날짜별 재고현황</h2>
        </Flex>
      </Flex>
      <Table
      columns={columns}/>
    </div>
  )
}

export default InventoryDetail
