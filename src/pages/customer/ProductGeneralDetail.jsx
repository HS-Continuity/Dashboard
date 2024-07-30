import { fetchProductDetail } from '../../apis/apisProducts'; 
import{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductGeneralDetail = () => {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetchProductDetail(productId);
        //console.log('식품 상세 받아온 productId: ', productId)
        console.log('식품 상세 받아온 response: ', response)
        setProductDetail(response);
      } catch (error) {
        console.error('Error fetching product detail:', error);
      }
    };

    fetchDetail();
  }, [productId]);

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>상품 상세 정보</h2>
      <p>상품 ID: {productId}</p>
      <p>상품명: {productDetail.productName}</p>
      <p>카테고리: {productDetail.categoryName}</p>
      <p>상세 카테고리: {productDetail.detailCategoryName}</p>
      <p>판매 유형: {productDetail.salesType}</p>
      <p>상품 설명: {productDetail.description}</p>
      <p>가격: {productDetail.price}</p>
      <p>원산지: {productDetail.origin}</p>
      <p>기본 할인율: {productDetail.baseDiscountRate}%</p>
      <p>정기 배송 할인율: {productDetail.regularDiscountRate}%</p>
      <p>개인화 할인율: {productDetail.personalizedDiscountRate}%</p>
      <p>페이지 노출 여부: {productDetail.isPageVisibility}</p>
      <p>정기 판매 여부: {productDetail.isRegularSale}</p>
    </div>
  );
};

export default ProductGeneralDetail;