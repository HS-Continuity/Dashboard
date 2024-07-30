import { fetchRegularOrderCountsBetweenMonth, fetchRegularOrderCountByDate } from '../../apis/apisOrders';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useQuery } from '@tanstack/react-query';
import { Flex, ConfigProvider, Table, Badge,  Calendar, message, Drawer, Pagination } from 'antd'
//import { ExclamationOutlined } from '@ant-design/icons';
import locale from 'antd/locale/ko_KR'; // 한국어 locale 파일 import
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 locale 파일 import
// import updateLocale from 'dayjs/plugin/updateLocale';
// import StatusCard from '../../components/Cards/StatusCard';
// import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import './OrderSubscriptionModule.css';

// const orderStatusTags = ['결제완료', '주문승인', '배송준비중','배송중', '배송완료'];
// const tagColors = {
//   '결제완료': 'green',
//   '주문승인': 'blue',
//   '배송준비중': 'orange',
//   '배송중': 'purple',
//   '배송완료': 'cyan',
// };


const OrderSubscription = () => {

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [monthlyOrderCounts, setMonthlyOrderCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [dailyOrdersPagination, setDailyOrdersPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 현재 날짜로 초기화
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  //const [selectedDateOrders, setSelectedDateOrders] = useState([]);
  const [panelDate, setPanelDate] = useState(dayjs()); // 현재 패널 날짜 상태 추가
  //const [selectedRowKeys, setSelectedRowKeys] = useState();

  const fetchMonthlyOrders = async () => {
    setLoading(true);
    try {
      //const customerId = 1;  // 실제 사용시 로그인한 고객의 ID를 사용해야 함!!
      const response = await fetchRegularOrderCountsBetweenMonth(
        currentMonth.startOf('month'),
        currentMonth.endOf('month'),
      );
      console.log('받아온 데이터: ', response)
      setMonthlyOrderCounts(response);
    } catch (error) {
      console.error('Failed to fetch monthly orders:', error);
      message.error('주문 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyOrders = async (date, size = 10, page = 0) => {
    setLoading(true);
    try {
      const response = await fetchRegularOrderCountByDate(date, size, page);
      console.log('response: ', response)
      setDailyOrders(response.content);
      setDailyOrdersPagination({
        current: page+1,
        pageSize: size,
        total: response.totalElements || 0
      });
    } catch (error) {
        console.error('Failed to fetch daily orders: ', error);
        message.error('일별 주문 데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMonthlyOrders();
  }, [currentMonth]);

  const cellRender = (current) => {
    if (!monthlyOrderCounts) return null;

    const ordersForDate = monthlyOrderCounts.filter(order => 
      // dayjs(order.START_DATE).format('YYYY-MM-DD') === current.format('YYYY-MM-DD')
      dayjs(order.days).format('YYYY-MM-DD') === current.format('YYYY-MM-DD')
    );

    if (ordersForDate.length === 0) return null;

    const firstOrder = ordersForDate[0];
    const content = ordersForDate.length > 1
      ? `${firstOrder.productName} 상품건 외 ${ordersForDate.length - 1}건`
      : firstOrder.productName;

  
    return (
      <ul className="events">
        <li>
          <Badge status="processing" text={content} />
        </li>
      </ul>
    );
  };

  const onPanelChange = (value) => {
    setCurrentMonth(value);
  };

  // const onSelectDate = (selectedDate) => {
  //   // 선택된 날짜가 현재 표시된 달에 속하는지 확인
  //   if (selectedDate.isSame(panelDate, 'month')) {
  //     setSelectedDate(selectedDate);
  //     fetchDailyOrders(selectedDate.format('YYYY-MM-DD'));
      
  //     // const ordersForDate = monthlyOrderCounts.filter(
  //     //   order => dayjs(order.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  //     // );
  //     //setSelectedDateOrders(ordersForDate);
  //     setIsDrawerVisible(true);
  //   } else {
  //     // 다른 달의 날짜를 선택한 경우, 해당 달로 이동만 하고 drawer는 열지 않음
  //     setPanelDate(selectedDate);
  //     setCurrentMonth(selectedDate);
  //   }
  // };

  const onSelectDate = (selectedDate) => {
    if (selectedDate.isSame(panelDate, 'month')) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      console.log('Fetching orders for date:', formattedDate);
      fetchDailyOrders(formattedDate);
      setIsDrawerVisible(true);
    } else {
      setPanelDate(selectedDate);
      setCurrentMonth(selectedDate);
    }
  };

  const handleTableChange = (pagination) => {
    fetchDailyOrders(selectedDate.format('YYYY-MM-DD', pagination.pageSize, pagination.current))
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const onRow = (record) => {
    return {
      onClick: () => {
        console.log("Clicked record:", record);
        navigate(`./${record.regularDelivaryApplicationId}`, {
          state: { 
             regularOrderId: record.regularDelivaryApplicationId,
             record: record
          }
        });
      },
    };
  };

  const columns = [
    {
      title: 'NO.',
      dataIndex: 'no',  // 해당 데이터가 어떤 필드에 있는지
      key: 'no',
      fixed: 'left',
      width: 50,
      // render: (text, record, index) => index + 1,
      render: (text, record, index) => (dailyOrdersPagination.current - 1) * dailyOrdersPagination.pageSize + index + 1,  //  페이지가 넘어가도 순번 규칙이 이어서 적용됨
    },
    {
      title: '정기주문ID',
      dataIndex: 'regularDelivaryApplicationId',
      key: 'regularDelivaryApplicationId',
      fixed: 'left',
      filteredValue: filteredInfo.regularDelivaryApplicationId || null,
      filtered: false,
      width: 135
    },
    {
      title: '주문상품',
      dataIndex: 'productName',
      key: 'productName',
      fixed: 'left',
      filteredValue: filteredInfo.productName || null,
      filtered: false,
      width: 140
    },
  ];

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>정기주문관리</h2>
        </Flex>
      </Flex>
      <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: '#F29325',  // today cell color
          borderRadius: 2,

          // Alias Token
          colorBgContainer: '#F4E2DE', // calendar bg color
          fontSizeSM: 12
          

        },
      }}
      locale={locale}
    >
      <Calendar
        cellRender={cellRender}
        onSelect={onSelectDate}
        value={currentMonth}
        onPanelChange={onPanelChange}
        locale={locale}
        mode="month"
        //style={{ height: '100%' }}
      />
    </ConfigProvider>

      <Drawer
        title={selectedDate.format('YYYY-MM-DD')}
        placement="right"
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        width={1200}
      >
        {dailyOrders.length > 0 ? (
         <>
         <Table
          columns={columns}
          dataSource={dailyOrders}
          rowKey="regularDelivaryApplicationId"
          pagination={{
            ...dailyOrdersPagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          onRow={onRow}
         />
       </>
        ) : (
          <h2>주문건이 없습니다.</h2>
        )}
      </Drawer>
    </div>
  );
};

export default OrderSubscription;
