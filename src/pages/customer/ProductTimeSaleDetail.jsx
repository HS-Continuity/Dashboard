// ProductTimeSaleDetail.jsx
import { fetchTimeSaleDetail } from '../../apis/apisProducts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Spin, message } from 'antd';

const ProductTimeSaleDetail = () => {
  const { timesaleId } = useParams();
  const [timesaleDetail, setTimesaleDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetchTimeSaleDetail(timesaleId);
        console.log(response)
        setTimesaleDetail(response);
      } catch (error) {
        console.error('Failed to fetch timesale detail:', error);
        message.error('타임세일 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [timesaleId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!timesaleDetail) {
    return <p>타임세일 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <Flex vertical>
      <h2>타임세일 상세 정보</h2>
      <p>상품 ID: {timesaleDetail.productId}</p>
      <p>상품명: {timesaleDetail.productName}</p>
      <p>할인율: {timesaleDetail.discountRate}%</p>
      <p>시작 시간: {timesaleDetail.startDateTime}</p>
      <p>종료 시간: {timesaleDetail.endDateTime}</p>
      <p>서비스 상태: {timesaleDetail.serviceStatus}</p>
      {/* 추가적인 상세 정보들을 여기에 표시 */}
    </Flex>
  );
};

export default ProductTimeSaleDetail;