import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { Card, Row, Col, Spin, Select } from 'antd';
import { fetchTop5ProductsMonthlySales, fetchMonthlyRevenue, fetchMemberGrowth } from '../apis/apisStatistics';
import useAuthStore from '../stores/useAuthStore';
import BarChart from '../components/Chart/BarChart';
import LineChart from '../components/Chart/LineChart';


const options = [
  { label: '최근 3개월', value: 3 },
  { label: '최근 6개월', value: 6 },
  { label: '최근 12개월', value: 12 },
];

const Home = () => {
  const { username } = useAuthStore();

  const [salesData, setSalesData] = useState([]);
  const [months, setMonths] = useState(3);
  const [revenueData, setRevenueData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesMonths, setSalesMonths] = useState(3);

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username, salesMonths]);

  const fetchData = async () => {
    // setLoading(true);
    try {
      // const customerId = username;
      const customerId = username;
      // const salesResponse = await fetchTop5ProductsMonthlySales(customerId, months);
      // const revenueResponse = await fetchMonthlyRevenue(customerId, months);
      // const memberResponse = await fetchMemberGrowth(customerId, months);

      const [salesResponse, revenueResponse, memberResponse] = await Promise.all([
        fetchTop5ProductsMonthlySales(customerId, salesMonths),
        fetchMonthlyRevenue(customerId, months),
        fetchMemberGrowth(customerId, months)
      ]);

      console.log('Received sales data:', salesResponse);
      console.log('Received revenue data:', revenueResponse);
      console.log('Received member data:', memberResponse);

      setSalesData(formatDataForNivo(salesResponse));
      setRevenueData(formatLineData(revenueResponse, 'revenue'));
      setMemberData(formatLineData(memberResponse, 'members'));

      // const formattedData = formatDataForNivo(response);
      // setSalesData(formattedData(response)); // ?
      // setRevenueData(formatLineData(revenueResponse, 'revenue'));
      // setMemberData(formatLineData(memberResponse, 'members'));

      //console.log('data: ' , memberData)
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDataForNivo = (response) => {
    if (!Array.isArray(response) || response.length === 0) {
      console.warn('No data available or invalid format');
      return [];
    }

    // 모든 제품 ID를 추출
    const allProductIds = [...new Set(response.map(item => item.productId))];

    const monthlyData = {};
    response.forEach(item => {
      if (item.year && item.month && item.productId !== undefined && item.totalSales !== undefined) {
        const monthKey = `${item.year}-${item.month.toString().padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey };
          // 모든 제품에 대해 초기값 0 설정
          allProductIds.forEach(id => {
            monthlyData[monthKey][`Product ${id}`] = 0;
          });
        }
        monthlyData[monthKey][`Product ${item.productId}`] = item.totalSales;
      } else {
        console.warn('Invalid item format:', item);
      }
    });

    // 날짜순으로 정렬
    const sortedData = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([key, value]) => ({ ...value, month: key }));

    return sortedData;
    //return Object.values(monthlyData);
  };

  const formatLineData = (data, key) => {
    return [{
      id: key,
      data: data.map(item => ({
        x: `${item.year}-${item.month.toString().padStart(2, '0')}`,
        y: key === 'revenue' ? item.totalRevenue : item.memberCount
      }))
    }];
  };

  const getKeys = (data) => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]).filter(key => key !== 'month');
    return keys;
  };

  const handleMonthChange = (value) => {
    setMonths(value);
  };

  const handleSalesMonthChange = (value) => {
    setSalesMonths(value);
  };


  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="오늘 할 일" 
            style={{ height: '200px', borderRadius: '0', border: '1px solid #d9d9d9' }}
          >
            {/* 오늘 할 일 내용이 여기에 들어갑니다. */}
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ background: '#f0f2f5', padding: '16px', textAlign: 'center' }}>
                  첫 번째 칸
                </div>
              </Col>
              <Col span={8}>
                <div style={{ background: '#f0f2f5', padding: '16px', textAlign: 'center' }}>
                  두 번째 칸
                </div>
              </Col>
              <Col span={8}>
                <div style={{ background: '#f0f2f5', padding: '16px', textAlign: 'center' }}>
                  세 번째 칸
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '20px' }}></div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>상품별 판매량 비교</span>
                <Select defaultValue={salesMonths} style={{ width: 200 }} onChange={handleSalesMonthChange} options={options} />
              </div>
            }
            style={{ height: '400px',borderRadius: '0', border: '1px solid #d9d9d9' }}
          >
            {loading ? (
              // <Spin size="large" />
              <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
              </div>
            ) : (
              <div style={{ height: '100%', width: '100%' }}>
                <BarChart 
                  data={salesData} 
                  keys={getKeys(salesData)} 
                  indexBy="month" 
                  responsive={true}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '20px' }}></div>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title="월별 수익 비교" 
            style={{ height: '400px', borderRadius: '0', border: '1px solid #d9d9d9' }}
            
          >
            {/* 월별 수익 비교 그래프가 여기에 들어갑니다. */}
            {loading ? (
              <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
              </div>
            ) : (
              <div style={{ height: '350px', width: '100%' }}>
                <LineChart 
                  data={revenueData} 
                />
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="주문 회원 수 추이" 
            style={{ height: '400px', borderRadius: '0', border: '1px solid #d9d9d9' }}
          >
            {/* 회원 수 추이 그래프가 여기에 들어갑니다. */}
            {loading ? (
              <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
              </div>
            ) : (
              <div style={{ height: '350px', width: '100%' }}>
                <LineChart 
                  options={LineChart.options} 
                  //series={memberData} 
                  data={memberData}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: '20px' }}></div>
    </div>
  );
};

export default Home;
