import { fetchProductDetail, fetchProductCertification } from '../../apis/apisProducts'; 
import { Upload } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductEcoDetail = () => {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [certification, setCertification] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailResponse = await fetchProductDetail(productId);
        setProductDetail(detailResponse);

        const certificationResponse = await fetchProductCertification(productId);
        setCertification(certificationResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        // message.error('데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchData();
  }, [productId]);

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  const certificationFile = certification ? [
    {
      id: certification.productCertificationId,
      name: certification.certificationName,
      number: certification.certificationNumber,
      url: certification.certificationImage,
    }
  ] : [];

  const onHandleDownload = (file) => {
    window.open(file.url);
  };

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

      <h3>인증서 정보</h3>
      <Upload
        fileList={certificationFile}
        onDownload={onHandleDownload}
        disabled={true}
      >
        {certification ? (
          <FileOutlined/>
        ) : (
          <p>인증서가 없습니다.</p>
        )}
      </Upload>
      {certification && (
        <>
          <p>인증서 이름: {certification.certificationName}</p>
          <p>인증 번호: {certification.certificationNumber}</p>
        </>
      )}
    </div>
  );
};

export default ProductEcoDetail
