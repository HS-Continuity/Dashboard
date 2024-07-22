import { fetchRegularDeliveryList, fetchRegularDeliveryByDate } from '../../apis';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, Space, DatePicker, Table, Tag, Input,  Calendar, Badge, Drawer } from 'antd'
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
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const dataRef = useRef([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [filteredData, setFilteredData] = useState(dataRef.current);  //  초기값은 원본 데이터(data)
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 현재 날짜로 초기화
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [panelDate, setPanelDate] = useState(dayjs()); // 현재 패널에 표시되는 날짜 상태 추가
  const [drawerFilteredOrders , setDrawerFilteredOrders ] = useState([]);
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });

  // 전체 정기주문 데이터 조회
  const { data: regular_delivery, isLoading, error } = useQuery({
    queryKey: ["regular_delivery"],
    queryFn: () => fetchRegularDeliveryList(),
    onSuccess: (data) => {
      console.log('Data fetched successfully:', data);
    },
    onError: (error) => {
      console.error('Error fetching data:', error);
    }
  });
  
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!regular_delivery) return <div>데이터가 없습니다.</div>;

  const onHandleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };


  const applyFilters = (data) => {
    if (!selectedDateRange || selectedDateRange.length === 0) {
      return data;
    } else {
      const startDate = dayjs(selectedDateRange[0]).startOf('day').format('YYYY-MM-DD');
      const endDate = dayjs(selectedDateRange[1]).endOf('day').format('YYYY-MM-DD');
  
      return data.filter(item => {
        const itemDate = dayjs(item.배송시작일, 'YYYY-MM-DD').startOf('day');
        const isInRange = itemDate.isBetween(startDate, endDate, undefined, '[]');
  
        // 검색어 필터링 로직 추가
        const searchFilter = filteredInfo.주문번호 || filteredInfo.회원ID || filteredInfo.회원명 || filteredInfo.휴대전화번호 || filteredInfo.상품;
        const isSearchMatch = !searchFilter || Object.keys(searchFilter).every(key => 
          searchFilter[key].includes(item[key])
        );
  
        return isInRange && isSearchMatch;
      });
    }
  }

  const onPanelChange = (value, mode) => {
    if (mode === 'month') {
      setCurrentMonth(value);
      setPanelDate(value.clone().date(1)); // 패널 날짜 업데이트 (1일로 설정)
    } else if (mode === 'year') {
      setCurrentMonth(value.clone().month(currentMonth.month()));
      setPanelDate(value.clone().month(currentMonth.month()).date(1)); // 패널 날짜 업데이트 (1일로 설정)
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
    },
  };

  const filteredOrdersByDate = filteredData.filter(
    (item) => dayjs(item.start_date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  ).map((item) => ({ ...item, key: item.regular_delivery_application_id })); // 각 항목에 key 추가


  
  const cellRender = (value) => {
    // value가 Dayjs 객체가 아닌 경우 Dayjs 객체로 변환
    const cellDate = dayjs.isDayjs(value) ? value : dayjs(value);
  
    if (!cellDate.isValid()) {
      //console.error('Invalid date value:', value);
      return null;
    }
  
    const formattedDate = cellDate.format('YYYY-MM-DD');
    //console.log('Rendering cell for date:', formattedDate);
  
    if (!regular_delivery) {
      //console.log('regular_delivery is not loaded yet');
      return null;
    }
  
    // 해당 날짜에 일치하는 데이터 필터링
    const matchingOrders = regular_delivery.filter(item => {
      const itemDate = dayjs(item.start_date);
      const isMatch = itemDate.format('YYYY-MM-DD') === formattedDate;
      //console.log('Comparing:', item.start_date, 'with', formattedDate, 'Match:', isMatch);
      return isMatch;
    });

    const getSummaryData = (matchingOrders) => {
      const memberIds = [...new Set(matchingOrders.map((item) => item.member_id))];
      const productList = [...new Set(matchingOrders.map((item) => item.product_order_list))];
    
      return {
        memberCount: memberIds.length,
        productCount: productList.length,
        moreCount: matchingOrders.length - 1,
      };
    };

    // 날짜별 데이터 요약 정보 추출
    const summaryData = getSummaryData(matchingOrders);

    // '외 n건' 문자열 생성
    const moreCountText = summaryData.moreCount > 0 ? `외 ${summaryData.moreCount}건` : '';

    


    // 일치하는 데이터의 member_id 추출 (중복 제거)
    // const memberIds = [...new Set(matchingOrders.map(item => item.member_id))];
    // const orderList = [...new Set(matchingOrders.map(item => item.product_order_list))];
  
    
    const isToday = cellDate.isSame(dayjs(), 'day');
    return (
      <ul className="events">
      {matchingOrders.length > 0 && matchingOrders[0] !== null ? (
        <li key={matchingOrders[0].regular_delivery_application_id}>
          <Flex gap="small">
            <div className="eachOrderItem">
              {matchingOrders[0].regular_delivery_application_id}
            </div>
            <div className="eachOrderItem2">{moreCountText}</div>
          </Flex>
        </li>
      ) : null}
    </ul>
    );
  };

  const onSelectDate = async(selectedDate) => {
    setSelectedDate(selectedDate);
    setIsDrawerVisible(selectedDate.isSame(panelDate, 'month')); // 선택된 날짜가 현재 패널의 월에 속하는 경우에만 Drawer 열기

    try {
      const data = await fetchRegularDeliveryByDate(selectedDate);
      const filteredData = applyFilters(data);
      const keyValueData = filteredData.map(item => ({
        ...item,
        key: item.regular_delivery_application_id // 고유 key 추가
      }));
      setDrawerFilteredOrders(keyValueData)
      console.log('Key values:', keyValueData.map((item) => item.key));
      console.log('regular_delivery_status:', keyValueData.regular_delivery_status);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const onRowClick = (record) => {
    navigate ('../subscriptionDetail', {
      state: {
        selectedTags: record.regular_delivery_status,
        selectedOrderId: record.regular_delivery_application_id,
        selectedOrderStartDate: record.start_date,
        selectedOrderEndDate: record.end_date,
        selectedOrderCycle: record.cycle,
        selectedOrderMemo: record.order_memo
      },
    });
  };

  const onRow = (record, rowIndex) => {
    return {
      onClick: () => {
        navigate(`../subscription/${record.regular_delivery_application_id}`);
        setLastClickedRow(rowIndex);
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
      dataIndex: 'regular_delivery_application_id',
      key: 'regular_delivery_application_id',
      fixed: 'left',
      filteredValue: filteredInfo.regular_delivery_application_id || null,
      filtered: false,
      width: 135
    },
    {
      title: '회원ID',
      dataIndex: 'member_id',
      key: 'member_id',
      fixed: 'left',
      filteredValue: filteredInfo.member_id || null,
      filtered: false,
      width: 140
    },
    {
      title: '결제수단',
      dataIndex: 'member_payment_card_id',
      key: 'member_payment_card_id',
      fixed: 'left',
      filteredValue: filteredInfo.member_payment_card_id || null,
      filtered: false,
      width: 140
    },
    {
      title: '상품목록',
      dataIndex: 'product_order_list',
      key: 'product_order_list',
      fixed: 'left',
      filteredValue: filteredInfo.product_order_list || null,
      filtered: false,
    },
    {
      title: '배송시작일',
      dataIndex: 'start_date',
      key: 'start_date',
      fixed: 'left',
      filteredValue: filteredInfo.start_date || null,
      filtered: false,
    },
    {
      title: '배송종료일',
      dataIndex: 'end_date',
      key: 'end_date',
      fixed: 'left',
      filteredValue: filteredInfo.end_date || null,
      filtered: false,
      width: 140
    },
    {
      title: '배송주기(주 단위)',
      dataIndex: 'cycle',
      key: 'cycle',
      fixed: 'left',
      filteredValue: filteredInfo.cycle || null,
      filtered: false,
      width: 135
    },
    {
      title: '주문 메모',
      dataIndex: 'order_memo',
      key: 'order_memo',
      fixed: 'left',
      filteredValue: filteredInfo.order_memo || null,
      filtered: false,
    },
  ];

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>정기주문관리</h2>
        </Flex>
      </Flex>
      {/* <Flex gap='small' align='center' justify='space-between'>
        
        <Flex gap="small" wrap>
          <Space align="center">출고상태변경</Space>
          <StatusChangeButton 
            title={"주문승인"}
            onClick={() => {
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송준비중"}
            onClick={() => {
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송중"}
            onClick={() => {
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송완료"}
            onClick={() => {
              setSelectedRowKeys([]);
            }}
          />
        </Flex>
      </Flex> */}
      <br />
      <Calendar
        cellRender={cellRender} 
        onSelect={onSelectDate}
        value={currentMonth}
        onPanelChange={onPanelChange}
        locale={locale}
        panelOptions={{
          showMonthNav: false,
          showYearNav: false
        }}
      /> 

      <Drawer
        title={selectedDate.format('YYYY-MM-DD')}
        placement="right"
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        width={1500}
      >
        {drawerFilteredOrders && drawerFilteredOrders.length > 0 ? (
          <Table
            columns={columns.filter((col) => col.key !== 'start_date')}
            dataSource={drawerFilteredOrders}
            onChange={onHandleChange}  // 페이지 변경 이벤트
            rowKey="regular_delivery_application_id"
            pagination={false}
            onRow={onRow}
          />
        ) : (
          // <ExclamationOutlined />
          <h2>주문건이 없습니다.</h2>
        )}
      </Drawer>
    </div>
  );
};

export default OrderSubscription;
