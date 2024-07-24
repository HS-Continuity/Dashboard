import { fetchRegularOrderCountsBetweenMonth } from '../../apis/apisOrders';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, ConfigProvider, DatePicker, Table, Tag, Input,  Calendar, Card, Drawer } from 'antd'
import { Row, Col } from 'antd';
import { ExclamationOutlined } from '@ant-design/icons';
import locale from 'antd/locale/ko_KR'; // 한국어 locale 파일 import
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 locale 파일 import
import updateLocale from 'dayjs/plugin/updateLocale';
import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import './OrderSubscriptionModule.css';

const orderStatusTags = ['결제완료', '주문승인', '배송준비중','배송중', '배송완료'];
const tagColors = {
  '결제완료': 'green',
  '주문승인': 'blue',
  '배송준비중': 'orange',
  '배송중': 'purple',
  '배송완료': 'cyan',
};


const OrderSubscription = () => {

  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 현재 날짜로 초기화
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDateOrders, setSelectedDateOrders] = useState([]);
  const [panelDate, setPanelDate] = useState(dayjs()); // 현재 패널 날짜 상태 추가
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });


  const { data: monthlyOrderCounts, isLoading, error } = useQuery({
    queryKey: ['monthlyOrderCounts', currentMonth.format('YYYY-MM')],
    queryFn: () => fetchRegularOrderCountsBetweenMonth(
      currentMonth.startOf('month').format('YYYY-MM-DD'),
      currentMonth.endOf('month').format('YYYY-MM-DD')
    ),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;



  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      const selectedIds = selectedRows.map(row => row.REGULAR_DELIVERY_APPLICATION_ID);
      setSelectedRowKeys(selectedIds);
    },
  };


  const cellRender = (value) => {
    if (!monthlyOrderCounts) return null;

    const cellDate = value.format('YYYY-MM-DD');
    const ordersForDate = monthlyOrderCounts.filter(order => 
      dayjs(order.START_DATE).format('YYYY-MM-DD') === cellDate
    );
    if (ordersForDate.length === 0) return null;

    return (
      <ul className="events">
        {ordersForDate.map(order => (
          <li key={order.RECIPIENT}>
            {order.RECIPIENT}
          </li>
        ))}
      </ul>
    );
  };






  const onPanelChange = (value) => {
    setCurrentMonth(value);
    setPanelDate(value); // 패널 날짜를 업데이트
  };

  const onSelectDate = (selectedDate) => {
    // 선택된 날짜가 현재 표시된 달에 속하는지 확인
    if (selectedDate.isSame(panelDate, 'month')) {
      setSelectedDate(selectedDate);
      
      const ordersForDate = monthlyOrderCounts.filter(
        order => dayjs(order.START_DATE).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
      );
      setSelectedDateOrders(ordersForDate);
      setIsDrawerVisible(true);
    } else {
      // 다른 달의 날짜를 선택한 경우, 해당 달로 이동만 하고 drawer는 열지 않음
      setPanelDate(selectedDate);
      setCurrentMonth(selectedDate);
    }
  };



  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  // const onRowClick = (record) => {
  //   navigate ('../subscriptionDetail', {
  //     state: {
  //       selectedTags: record.regular_delivery_status,
  //       selectedOrderId: record.regular_delivery_application_id,
  //       selectedOrderStartDate: record.start_date,
  //       selectedOrderEndDate: record.end_date,
  //       selectedOrderCycle: record.cycle,
  //       selectedOrderMemo: record.order_memo
  //     },
  //   });
  // };

  const onRow = (record) => {
    return {
      onClick: () => {
        navigate(`../subscription/${record.REGULAR_DELIVERY_APPLICATION_ID}`);
        //setLastClickedRow(rowIndex);
      },
    };
  };

  const columns = [
    {
      title: 'NO.',
      dataIndex: 'no',  // 해당 데이터가 어떤 필드에 있는지
      key: 'no',
      fixed: 'left',
      width: 100,
      render: (text, record, index) => index + 1,
    },
    {
      title: '정기주문ID',
      dataIndex: 'REGULAR_DELIVERY_APPLICATION_ID',
      key: 'REGULAR_DELIVERY_APPLICATION_ID',
      fixed: 'left',
      filteredValue: filteredInfo.REGULAR_DELIVERY_APPLICATION_ID || null,
      filtered: false,
      width: 135
    },
    {
      title: '대표상품명',
      dataIndex: 'MAIN_PRODUCT_ID',
      key: 'MAIN_PRODUCT_ID',
      fixed: 'left',
      filteredValue: filteredInfo.MAIN_PRODUCT_ID || null,
      filtered: false,
      width: 140
    },
    {
      title: '주문건수',
      dataIndex: 'ORDERED_PRODUCT_COUNT',
      key: 'ORDERED_PRODUCT_COUNT',
      fixed: 'left',
      filteredValue: filteredInfo.ORDERED_PRODUCT_COUNT || null,
      filtered: false,
      width: 140
    }
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
          colorPrimary: '#4F5902',  // today cell color
          borderRadius: 2,

          // Alias Token
          colorBgContainer: '#D9D4CC', // calendar bg color
          fontSizeSM: 12
          

        },
      }}
    >
      <Calendar
        cellRender={cellRender}
        onSelect={onSelectDate}
        value={currentMonth}
        onPanelChange={onPanelChange}
        locale={locale}
        //style={{ height: '100%' }}
      />
    </ConfigProvider>

      <Drawer
        title={selectedDate.format('YYYY-MM-DD')}
        placement="right"
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        width={800}
      >
        {selectedDateOrders.length > 0 ? (
          <Table
            //columns={columns.filter((col) => col.key !== 'start_date')}
            columns={columns}
            dataSource={selectedDateOrders}
            //onChange={onHandleChange}
            rowKey="REGULAR_DELIVERY_APPLICATION_ID"
            pagination={false}
            onRow={onRow}
            rowSelection={rowSelection}
          />
        ) : (
          <h2>주문건이 없습니다.</h2>
        )}
      </Drawer>
    </div>
  );
};

export default OrderSubscription;
