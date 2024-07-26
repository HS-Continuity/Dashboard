import { fetchCustomerOrders, updateOrderStatus } from '../../apis/apisOrders';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, DatePicker, Table, Tag, Button, Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
//import Highlighter from 'react-highlight-words';
import moment from 'moment';
import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';

const { RangePicker } = DatePicker;

const OrderGeneral = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [dateRange, setDateRange] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});

  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [isServerUnstable, setIsServerUnstable] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  // status별 개수 세기
  // 1. 빈 객체 생성하기 (태그별 개수 저장)
  // const statusCounts = {};
  // // 2. forEach 사용해서 orderStatusTags 배열 순회하기
  // orderStatusTags.forEach((tag) => {
  //   // 옵셔널 체이닝(?.) 사용해서 item.tags가 존재하는 경우에만 includes(tag) 호출하기
  //   // 태그가 key, 개수가 value
  //   // statusCounts[tag] = datasRef.current.filter((item) => item.tags?.includes(tag)).length;
  // });


  const fetchOrders = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const customerId = 1;  // 실제 사용시 로그인한 고객의 ID를 사용해야 함!!
      const response = await fetchCustomerOrders(customerId, null, page - 1, pageSize);

      let isServerUnstable = false;
      
      const transformedOrders = response.content.map(order => {
        const productOrderList = order.productOrderList?.productOrderList || 'null';
        let productName = '';
        let isMemberInfoAvailable = true;
        let isProductInfoAvailable = true;
        
        if (productOrderList && productOrderList.length > 0) {
          productName = `${productOrderList[0].name}`;
          if (productOrderList.length > 1) {
            productName += ` 외 ${productOrderList.length - 1}건`;
          }

          // 서버 연결 상태 확인
          // if (productOrderList.some(product =>   //  상품 목록 중 하나라도...
          //   !product.availableMemberInformation || !product.availableProductInformation
          // )) {
          //   isServerUnstable = true;
          // }
          isMemberInfoAvailable = productOrderList.every(product => product.availableMemberInformation);  //  모든 상품에 대해...
          isProductInfoAvailable = productOrderList.every(product => product.availableProductInformation);
          
          if (!isMemberInfoAvailable || !isProductInfoAvailable) {
            isServerUnstable = true;
          }

        }
      
        return {
          //key: order.orderDetailId?.toString() || '',
          orderDetailId: order.orderDetailId?.toString() || '',
          // memberId: order.memberInfo.memberId?.toString() || '',
          memberId: !isMemberInfoAvailable ? (order.memberInfo?.memberId?.toString() || '') : '로딩중',

          orderDateTime: order.orderDateTime?.toString() || '',
          deliveryAddress: order.recipient.recipientAddress?.toString() || '',
          recipient: order.recipient.recipient?.toString() || '',
          orderStatus: order.orderStatusCode?.toString() || '',
          // productName: productName?.toString() || '',
          productName: !isProductInfoAvailable ? (productName || '') : '확인중',

        };
      });

      setOrders(transformedOrders);
      setIsServerUnstable(isServerUnstable);
      setPagination({
        ...pagination,
        current: page,
        pageSize: pageSize,
        total: response.totalElements,
      });

      // if (isServerUnstable) {
      //   message.warning('일부 주문에서 서버 연결이 불안정합니다');
      // } else {
      //   message.success('주문 데이터를 성공적으로 불러왔습니다.');
      // }

    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('주문 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (!orders.length > 0) {
      if (isServerUnstable) {
        message.warning('일부 주문에서 서버 연결이 불안정합니다.');
      } else {
        message.success('주문 데이터를 성공적으로 불러왔습니다.');
      }
    }
  }, [isServerUnstable]);

  const onHandleTableChange = (pagination, filters, sorter) => {
    fetchOrders(pagination.current, pagination.pageSize);
    setFilteredInfo(filters);
  };

  const onHandleRangePickerChange = (dates) => {
    setSelectedDateRange(dates || []);  //  상태 업데이트
  }

  const onHandleStatusChange = async (newStatus) => {
    try {
      if (selectedRowKeys.length === 0) {
        message.warning('상태를 변경할 주문을 선택해주세요.');
        return;
      }

      let response;
      if (selectedRowKeys.length >= 1) {
        response = await updateOrderStatus(selectedRowKeys, newStatus);
      }

      // if (response.successCode === 'UPDATE_SUCCESS') {
        if (response === '200') {
        message.success('주문 상태가 성공적으로 변경되었습니다.');
        fetchOrders(pagination.current, pagination.pageSize);  //  테이블 새로고침
      } else {
        message.error('주문 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error changing order status.');
      message.error('주문 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const onClickStatusChangeBtn = (title) => {
    let newStatus;
    switch (title) {
      case '주문승인' :
        newStatus = 'PREPARING_PRODUCT';
        break;
      case '출고대기' :
        newStatus = 'AWAITING_RELEASE';
        break;
      default:
        message.error("존재하지 않는 상태 변경 요청입니다.");
        return;
    }
    onHandleStatusChange(newStatus);
  }

  const onClearFilters = () => {  //  모든 필터 초기화 이벤트
    setFilteredInfo({});
  };


  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const onHandleChange = (pagination, filters) => {
    setFilteredInfo(filters);  //  필터링 정보 업데이트
  };

  

  const onHandleReset = (clearFilters) => {  //  컬럼별 리셋
    clearFilters();
    setSearchText('');
  };

  

  // const applyFilters = (data) => {
  //   if (!selectedDateRange || selectedDateRange.length === 0) {
  //     return data;
  //   } else {
  //     const startDate = selectedDateRange[0].startOf('day').format('YYYY-MM-DD');
  //     const endDate = selectedDateRange[1].endOf('day').format('YYYY-MM-DD');
  
  //     return data.filter(item => {
  //       const itemDate = moment(item.배송시작일, 'YYYY-MM-DD').startOf('day');
  //       const isInRange = itemDate.isBetween(startDate, endDate, undefined, '[]');
  
  //       const searchFilter = filteredInfo.주문번호 || filteredInfo.주문날짜 || filteredInfo.수령인 || filteredInfo.배송지;
  //       const isSearchMatch = !searchFilter || Object.keys(searchFilter).every(key => 
  //         searchFilter[key].includes(item[key])
  //       );
  
  //       return isInRange && isSearchMatch;
  //     });
  //   }
  // }
  // const onHandleStatusChange = (newStatus) => {
  //   // 1. 깊은 복사
  //   const updatedData = JSON.parse(JSON.stringify(datasRef.current)); 

  //   // 2. tags 값 변경
  //   updatedData.forEach(item => {
  //     if (selectedRowKeys.includes(item.key)) {
  //       item.tags = [newStatus]; 
  //     }
  //   });

  //   // // 3. 상태 업데이트 및 localStorage 저장
  //   // datasRef.current = updatedData;
  //   // setDatas(updatedData);
  //   // setFilteredData(applyFilters(updatedData));
  //   // localStorage.setItem('OrderGeneralData', JSON.stringify(updatedData)); 
  //   // setSelectedRowKeys([]);
  // }


  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys: ', selectedRowKeys);
      console.log('selectedRows: ', selectedRows)

      setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
    },
  };


  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem('OrderGeneralData')) || data; // localStorage에서 불러오기
  //   datasRef.current = storedData;
  //   setDatas(storedData);
  //   setFilteredData(applyFilters(datas));
  // }, []);

  // useEffect(() => {
  //   setFilteredData(applyFilters(datas)); // datas 변경 시 filteredData 업데이트
  // }, [datas, selectedDateRange]); // datas와 selectedDateRange에 의존하도록 변경

  const onRow = (record, rowIndex) => {
    return {
      onClick: (e) => {
        navigate('../subscriptionDetail', { 
          // state: { 
          //   selectedTags: record.tags,
          //   selectedOrderId: record.주문번호,
          //   selectedOrderDate: record.배송시작일,
          // } 
        }); 
          console.log(e)
        
        setLastClickedRow(rowIndex);
      },
    };
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          //ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ''}  // 빈 문자열도 처리
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}  //  Enter 입력 시 필터링 적용
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            // ???
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && onHandleReset(clearFilters)}
            onClick={() => clearFilters }
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
        key='{orderDateTime}'
      />
    ),
    // onFilter: (value, record) => {
    //   setFilteredData(datasRef.current.filter(item => {
    //     if (dataIndex === "tags") {
    //       return item.tags.includes(value);
    //     } else {
    //       return item[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    //     }
    //   }));
    // },
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',

    // onFilterDropdownOpenChange: (visible) => {
    //   if (visible) {
    //     setTimeout(() => searchInput.current?.select(), 100);
    //   }
    // },

    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
    });


  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,  //  페이지가 넘어가도 순번 규칙이 이어서 적용됨
      width: '5%',
      fixed: 'left',
      width: '5%',
      //fixed: 'left'  // 테이블의 왼쪽에 고정
    },
    {
      title: '주문번호',
      dataIndex: 'orderDetailId',
      key: 'orderDetailId',
      fixed: 'left',
      filteredValue: filteredInfo.orderDetailId || null,
      filtered: false,
      ...getColumnSearchProps('orderDetailId'),
      width: '15%',
      render: (text) => text || 'null',
      //fixed: 'left'  // 테이블의 왼쪽에 고정
    },
    {
      title: '회원ID',
      dataIndex: 'memberId',
      key: 'memberId',
      fixed: 'left',
      filteredValue: filteredInfo.memberId || null,
      filtered: false,
      ...getColumnSearchProps('memberId'),
      width: '15%',
      // render: (text) => text || 'null',
      // render: (text) => text === '로딩중' ? <span style={{ color: 'orange' }}>로딩중</span> : (text || 'null'),
      //fixed: 'left'  // 테이블의 왼쪽에 고정
    },
    {
      title: '주문날짜',
      dataIndex: 'orderDateTime',
      key: 'orderDateTime',
      fixed: 'left',
      filteredValue: filteredInfo.orderDateTime || null,
      filtered: false,
      ...getColumnSearchProps('orderDateTime'),
      width: '20%',
      render: (text) => {
        if (text === 'null' || !text) {
          return 'null';
        }  
        return moment(text).format('YYYY-MM-DD HH-mm')
      },
    },
    {
      title: '배송지',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      fixed: 'left',
      filteredValue: filteredInfo.deliveryAddress || null,
      filtered: false,
      ...getColumnSearchProps('deliveryAddress'),
      width: '20%',
      render: (text) => text || 'null',
    },
    {
      title: '수령인',
      dataIndex: 'recipient',
      key: 'recipient',
      fixed: 'left',
      filteredValue: filteredInfo.recipient || null,
      filtered: false,
      ...getColumnSearchProps('recipient'),
      width: '10%',
      render: (text) => text || 'null',
    },
    {
      title: '주문상품',
      dataIndex: 'productName',
      key: 'productName',
      fixed: 'left',
      filteredValue: filteredInfo.productName || null,
      filtered: false,
      ...getColumnSearchProps('productName'),
      width: '10%',
      // render: (text) => text || 'null',
      // render: (text) => text === '확인중' ? <span style={{ color: 'orange' }}>확인중</span> : (text || 'null'),
    },
    {
      title: '주문 상태',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      filters: [
        { text: '결제완료', value: 'PAYMENT_COMPLETED' },
        // { text: '주문승인', value: 'ORDER_APPROVED' },
        { text: '상품준비중', value: 'PAYMENT_COMPLETED' },
        // { text: '배송중', value: 'IN_DELIVERY' },
        // { text: '배송완료', value: 'DELIVERY_COMPLETED' },
        { text: '출고대기중', value: 'AWAITING_RELEASE' },
      ],
      filteredValue: filteredInfo.orderStatus || null,
      onFilter: (value, record) => record.orderStatus === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      width: '10%',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      PAYMENT_COMPLETED: 'green',
      // ORDER_APPROVED: 'blue',
      PREPARING_PRODUCT: 'orange',
      // IN_DELIVERY: 'purple',
      // DELIVERY_COMPLETED: 'cyan',
      AWAITING_RELEASE: 'cyan'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      PAYMENT_COMPLETED: '결제완료',
      PREPARING_PRODUCT: '상품준비중',
      AWAITING_RELEASE: '출고대기중'
    };
    return texts[status] || status;
  };

  const statusTags = ['결제완료', '상품준비중', '출고대기중'];

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>일반주문관리</h2>
        </Flex>
      </Flex>
      <Flex gap="small" align="center" justify='space-between'>
        <Flex gap="small" wrap>
          <Space align="center">검색기간</Space>
          <RangePicker 
            value={selectedDateRange}
            onChange={onHandleRangePickerChange}
            allowClear />
        </Flex>
        <Flex gap="small" wrap>
          {statusTags.map((tag) => (
            // <StatusCard key={tag} title={tag} count={statusCounts[tag]} />
            <StatusCard key={tag} title={tag}/>
          ))}
        </Flex>
      </Flex>
      <br />
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap="small" wrap>
          <Button onClick={onClearFilters}>Clear Filter</Button>
          {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
        </Flex>
        <Flex gap="small" wrap>
          <Space align="center">출고상태변경</Space>
          <StatusChangeButton 
            title={"주문승인"}
            onClick={() => onClickStatusChangeBtn('주문승인')}
          />
          <StatusChangeButton 
            title={"출고대기"}
            onClick={() => onClickStatusChangeBtn('출고대기')}
          />
        </Flex>
      </Flex>
      <br />
      {orders.length > 0 ? (
      <Table
        columns={columns}
        dataSource={orders}
        pagination={pagination}
        rowSelection={rowSelection}
        loading={loading}
        onChange={onHandleTableChange}
        scroll={{ x: 1300 }}
        rowKey="orderDetailId"
      />
    ) : (
      <div>No orders found</div>
    )}
    </div>
  );
};

export default OrderGeneral;
