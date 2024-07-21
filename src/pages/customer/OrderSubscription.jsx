import { fetchRegularDeliveryList } from '../../apis';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, Space, DatePicker, Table, Tag, Button, Input,  Calendar, Badge, Drawer } from 'antd'
import locale from 'antd/locale/ko_KR'; // 한국어 locale 파일 import
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
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


const OrderGeneral = () => {

  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const dataRef = useRef([]);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [filteredData, setFilteredData] = useState(dataRef.current);  //  초기값은 원본 데이터(data)
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 현재 날짜로 초기화
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [panelDate, setPanelDate] = useState(dayjs()); // 현재 패널에 표시되는 날짜 상태 추가
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });

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

  // status별 개수 세기
  // 1. 빈 객체 생성하기 (태그별 개수 저장)
  const statusCounts = {};
  // 2. forEach 사용해서 orderStatusTags 배열 순회하기
  orderStatusTags.forEach((tag) => {
    // 옵셔널 체이닝(?.) 사용해서 item.tags가 존재하는 경우에만 includes(tag) 호출하기
    // 태그가 key, 개수가 value
    statusCounts[tag] = dataRef.current.filter((item) => item.tags?.includes(tag)).length;
  });

  const onHandleChange = (pagination, filters) => {
    setFilteredInfo(filters);  //  필터링 정보 업데이트
  };

  const onClearFilters = () => {  //  모든 필터 초기화 이벤트
    setFilteredInfo({});
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
    (item) => dayjs(item.start_date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD') // selectedDate의 형식을 'YYYY-MM-DD'로 변환하여 비교
  );


  
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
  
    //console.log('Number of orders:', regular_delivery.length);
  
    // 해당 날짜에 일치하는 데이터 필터링
    const matchingOrders = regular_delivery.filter(item => {
      const itemDate = dayjs(item.start_date);
      const isMatch = itemDate.format('YYYY-MM-DD') === formattedDate;
      //console.log('Comparing:', item.start_date, 'with', formattedDate, 'Match:', isMatch);
      return isMatch;
    });
  
    //console.log('Matching orders for', formattedDate, ':', matchingOrders);
  
    // 일치하는 데이터의 member_id 추출 (중복 제거)
    const memberIds = [...new Set(matchingOrders.map(item => item.member_id))];
    const orderList = [...new Set(matchingOrders.map(item => item.product_order_list))];
  
    //console.log('Member IDs:', memberIds);
  
    const isToday = cellDate.isSame(dayjs(), 'day');
    return (
      <ul className="events">
        {matchingOrders.map((order, index) => (
          <li key={index}>
            <Flex gap='small'>
              <div className='eachOrderItem' color="blue">
                {order.member_id}
              </div>
              <div color="geekblue">
                {order.product_order_list}
              </div>
            </Flex>
          </li>
        ))}
      </ul>
    );
  };

  const onSelectDate = (value) => {
    setSelectedDate(value);
    setIsDrawerVisible(value.isSame(panelDate, 'month')); // 선택된 날짜가 현재 패널의 월에 속하는 경우에만 Drawer 열기
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

  const columns = [
    {
      title: 'NO.',
      dataIndex: 'no',  // 해당 데이터가 어떤 필드에 있는지
      key: 'no',
      fixed: 'left'
    },
    {
      title: '정기주문ID',
      dataIndex: 'regular_delivery_application_id',
      key: 'regular_delivery_application_id',
      fixed: 'left',
      filteredValue: filteredInfo.regular_delivery_application_id || null,
      filtered: false,
    },
    {
      title: '회원ID',
      dataIndex: 'member_id',
      key: 'member_id',
      fixed: 'left',
      filteredValue: filteredInfo.member_id || null,
      filtered: false,
    },
    {
      title: '결제수단',
      dataIndex: 'member_payment_card_id',
      key: 'member_payment_card_id',
      fixed: 'left',
      filteredValue: filteredInfo.member_payment_card_id || null,
      filtered: false,
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
    },
    {
      title: '배송주기(주 단위)',
      dataIndex: 'cycle',
      key: 'cycle',
      fixed: 'left',
      filteredValue: filteredInfo.cycle || null,
      filtered: false,
    },
    {
      title: '주문 메모',
      dataIndex: 'order_memo',
      key: 'order_memo',
      fixed: 'left',
      filteredValue: filteredInfo.order_memo || null,
      filtered: false,
    },
    {
      title: '출고상태',
      dataIndex: 'regular_delivery_status',  //  밑에 데이터에서 'tags' 필드를 사용하므로
      key: 'regular_delivery_status',
      render: (_, {regular_delivery_status}) => (
        <>
          {regular_delivery_status.map((tag) => {  //  출고상태정보가 출고상태 필드에 저장되어 있으므로
            let color = tagColors[tag] || 'default';  //  tagColors 객체에 해당 tag의 색상이 없으면 'default' 색상 사용
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
      filters: orderStatusTags.map((tag) => ({ text: tag, value: tag })), // 필터 생성하기
      filteredValue: filteredInfo.regular_delivery_status || null,  //  컬럼의 dataIndex를 키로 사용
      onFilter: (value, record) => record.tags.includes(value),  //  선택된 태그 값(value)이 record.tag 배열에 포함되어 있는지 확인 후 필터링하기
    },
  ];

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>정기주문관리</h2>
        </Flex>
      </Flex>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap="small" wrap>
          <Button onClick={onClearFilters}>Clear Filter</Button>
          {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
        </Flex>
        <Flex gap="small" wrap>
          <Space align="center">출고상태변경</Space>
          <StatusChangeButton 
            title={"주문승인"}
            onClick={() => {
              // onHandleStatusChange('주문승인');
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송준비중"}
            onClick={() => {
              // onHandleStatusChange('배송준비중');
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송중"}
            onClick={() => {
              // onHandleStatusChange('배송중');
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송완료"}
            onClick={() => {
              // onHandleStatusChange('배송완료');
              setSelectedRowKeys([]);
            }}
          />
        </Flex>
      </Flex>
      <br />
      {/* <Table
        columns={columns}
        //rowSelection={{}}  // 체크박스
        rowSelection={rowSelection}
        dataSource={filteredData}
        pagination={tableParams.pagination}
        onChange={onHandleChange}  // 페이지 변경 이벤트
        scroll={{ x: 1300 }}
        onRow={onRow}
        rowKey="key"
      /> */}
      <Calendar 
        cellRender={cellRender} 
        onSelect={onSelectDate}
        value={currentMonth}
        onPanelChange={onPanelChange}
        locale={locale}/> 

      <Drawer
        title={selectedDate.format('YYYY-MM-DD')}
        placement="right"
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        width={1000}
      >
        <Table
          columns={columns.filter((col) => col.key !== '배송시작일')} // 배송시작일 컬럼 제외
          dataSource={filteredOrdersByDate}
          pagination={false}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
          })}
        />
      </Drawer>
    </div>
  );
};

export default OrderGeneral;
