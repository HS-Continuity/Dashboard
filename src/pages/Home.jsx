import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { Card, Row, Col, Spin, Select, Avatar, Space, Typography  } from 'antd';
import { UserOutlined, ShopOutlined, PhoneOutlined,TruckOutlined } from '@ant-design/icons';
import { fetchTop5ProductsMonthlySales, fetchMonthlyRevenue, fetchMemberGrowth, getProductNameById } from '../apis/apisStatistics';
import { fetchCustomerDetail, fetchReleaseStatusCounts, fetchTodayOrders } from '../apis/apisMain';
import useAuthStore from '../stores/useAuthStore';
import BarChart from '../components/Chart/BarChart';
import LineChart from '../components/Chart/LineChart';
import StatusCard from '../components/Cards/StatusCard';


const options = [
  { label: '최근 4개월', value: 3 },
  { label: '최근 7개월', value: 6 },
  { label: '최근 12개월', value: 12 },
];

const { Title, Text } = Typography;

const Home = () => {
  const { username } = useAuthStore();

  const [salesData, setSalesData] = useState([]);
  const [months, setMonths] = useState(3);
  const [revenueData, setRevenueData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesMonths, setSalesMonths] = useState(3);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [releaseStatusCounts, setReleaseStatusCounts] = useState([]);
  const [releaseStatusLoading, setReleaseStatusLoading] = useState(true);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [loadingTodayOrders, setLoadingTodayOrders] = useState(true);


  useEffect(() => {
    setSalesData([])
    if (username) {
      fetchData();
    }
  }, [username, salesMonths]);

  const fetchData = async () => {
    
    try {
      const customerId = username;

      const [salesResponse, revenueResponse, memberResponse] = await Promise.all([
        fetchTop5ProductsMonthlySales(customerId, salesMonths),
        fetchMonthlyRevenue(customerId, months),
        fetchMemberGrowth(customerId, months)
      ]);
      const formattedSalesData = await formatDataForNivo(salesResponse);
      setSalesData(formattedSalesData);
      setRevenueData(formatLineData(revenueResponse, 'revenue'));
      setMemberData(formatLineData(memberResponse, 'members'));

    } catch (error) {+
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDataForNivo = async(response) => {
    if (!Array.isArray(response) || response.length === 0) {
      console.warn('No data available or invalid format');
      return [];
    }

    // 모든 제품 ID를 추출
    const allProductIds = [...new Set(response.map(item => item.productId))];
    const productNames = await Promise.all(
      allProductIds.map(async id => ({
        id,
        name: await getProductNameById(id)
      }))
    );

    const productNameMap = Object.fromEntries(productNames.map(item => [item.id, item.name]));

    const monthlyData = {};
    response.forEach(item => {
      if (item.year && item.month && item.productId !== undefined && item.totalSales !== undefined) {
        const monthKey = `${item.year}-${item.month.toString().padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey };
          allProductIds.forEach(id => {
            monthlyData[monthKey][`Product ${id}`] = 0;
          });
        }
        monthlyData[monthKey][productNameMap[item.productId]] = item.totalSales;
      } else {
        console.warn('Invalid item format:', item);
      }
    });

    // 날짜순으로 정렬
    const sortedData = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([key, value]) => ({ ...value, month: key }));

    return sortedData;
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
    return Object.keys(data[0]).filter(key => key !== 'month' && !key.startsWith('Product '));
  };

  const handleMonthChange = (value) => {
    setMonths(value);
  };

  const handleSalesMonthChange = (value) => {
    setSalesMonths(value);
  };

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (username) {
        try {
          const data = await fetchCustomerDetail(username);
          setCustomerInfo(data);
        } catch (error) {
          console.error('Failed to fetch customer info:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerInfo();
  }, [username]);

  useEffect(() => {
    const fetchReleaseStatus = async () => {
      if (username) {
        try {
          const response = await fetchReleaseStatusCounts(username);
          setReleaseStatusCounts(response);
          console.log("상태값: ", releaseStatusCounts)
        } catch (error) {
          console.error('Failed to fetch release status counts:', error);
        } finally {
          setReleaseStatusLoading(false);
        }
      }
    };

    fetchReleaseStatus();
  }, [username]);

  useEffect(() => {
    const fetchTodayOrdersData = async () => {
      if (username) {
        try {
          setLoadingTodayOrders(true);
          const response = await fetchTodayOrders(username);
          setTodayOrderCount(response.totalElements);
        } catch (error) {
          console.error('Failed to fetch today\'s orders:', error);
          setTodayOrderCount(0);
        } finally {
          setLoadingTodayOrders(false);
        }
      }
    };

    fetchTodayOrdersData();
  }, [username]);

  const getStatusText = (status) => {
    const statusTexts = {
      AWAITING_RELEASE: '출고대기',
      HOLD_RELEASE: '출고보류',
      RELEASE_COMPLETED: '출고완료',
      COMBINED_PACKAGING_COMPLETED: '합포장완료'
    };
    return statusTexts[status] || status;
  };
  
  const getStatusColor = (status) => {
    const colors = {
      AWAITING_RELEASE: '#1890ff',
      HOLD_RELEASE: '#faad14',
      RELEASE_COMPLETED: '#52c41a',
      COMBINED_PACKAGING_COMPLETED: '#722ed1'
    };
    return colors[status] || '#000000';
  };


  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
  <Col span={24}>
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card style={{ height: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : customerInfo ? (
            <Row align="middle" justify="space-between">
              <Col span={12}>
                <Avatar size={70} src={customerInfo.avatar || null} icon={<UserOutlined />} style={{ margin: '5px 22px 0' }}/>
                <Title level={4} style={{ margin: '12px 12px 0' }}>{customerInfo.customerName} 사장님</Title>
              </Col>
              <Col span={12}>
                <Space direction="vertical" size="small">
                  <Text><ShopOutlined /> {customerInfo.storeName}</Text>
                  <Text><PhoneOutlined /> {customerInfo.storePhoneNumber}</Text>
                  <Text><PhoneOutlined /> {customerInfo.customerPhoneNumber}</Text>
                </Space>
              </Col>
            </Row>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Text type="danger">고객 정보를 불러올 수 없습니다.</Text>
            </div>
          )}
        </Card>
      </Col>

      <Col span={4}>
        <Card style={{ height: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          {loadingTodayOrders ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: '10px 0px 0' }}>⭐오늘 들어온 주문</Title>
              <Title level={2} style={{ margin: '35px 10px 0' }}>{todayOrderCount} 건</Title>
            </div>
          )}
        </Card>
      </Col>

      <Col span={12}>
        <Card 
          title={<Title level={4} style={{ margin: 0 }}><TruckOutlined /> 오늘의 출고 상태</Title>}
          style={{ height: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        >
          {releaseStatusLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : (
            <Row gutter={[8, 8]}>
              {['AWAITING_RELEASE', 'RELEASE_COMPLETED', 'HOLD_RELEASE', 'COMBINED_PACKAGING_COMPLETED'].map((status) => (
                <Col span={6} key={status}>
                  <StatusCard 
                    title={getStatusText(status)} 
                    count={releaseStatusCounts[status] || 0} 
                    color={getStatusColor(status)}
                    style={{ height: '100%' }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </Col>
    </Row>
  </Col>
</Row>

      <div style={{ marginTop: '20px' }}></div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: "18px" }}>
                <div>
                  <span style={{ color: "green", fontSize: "25px" }}>상품별</span>
                  <span style={{ fontSize: "20px" }}> 판매량 비교</span>
                </div>
                <div>
                  <Select defaultValue={salesMonths} style={{ width: 200 }} onChange={handleSalesMonthChange} options={options} />
                </div>
                
                
              </div>
            }
            style={{ height: '400px',borderRadius: '0', border: '1px solid #d9d9d9' }}
          >
            {loading ? (
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
            title={
              <div>
                <span style={{ color: "green", fontSize: "25px" }}>월별</span>
                <span style={{ fontSize: "20px" }}> 수익 비교 (단위: 1000원)</span>
              </div>
            }
            style={{ height: '400px', borderRadius: '0', border: '1px solid #d9d9d9', fontSize: "20px" }}
            
          >
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
            title={
              <div>
                  <span style={{ color: "green", fontSize: "25px" }}>주문 회원 수</span>
                  <span style={{ fontSize: "20px" }}> 추이 (단위: 명)</span>
              </div>
            }
            style={{ height: '400px', borderRadius: '0', border: '1px solid #d9d9d9' }}
          >
            {loading ? (
              <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
              </div>
            ) : (
              <div style={{ height: '350px', width: '100%' }}>
                <LineChart 
                  options={LineChart.options} 
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
