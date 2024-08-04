import { fetchCustomerOrders, updateOrderStatus, updateBulkOrderStatus,subscribeToOrderStatusUpdates } from '../../apis/apisOrders';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, DatePicker, Table, Tag, Button, Input, message, Switch } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import Swal from 'sweetalert2';
import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import style from './Order.module.css';
import orderIn from '../../assets/audio/orderIn.mp3';
import styles from './Table.module.css';

import useAuthStore from "../../stores/useAuthStore";

const { RangePicker } = DatePicker;

const OrderGeneral = () => {

  const { username } = useAuthStore();

  const audioRef = useRef(new Audio(orderIn)); // 오디오 객체 생성
  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [joinForm, setJoinForm] = useState({});
  const [fullOrders, setFullOrders] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const [prevStatusCount, setPrevStatusCount] = useState({});
  const [isSoundOn, setIsSoundOn] = useState(false);
  const searchInput = useRef(null);
  const tableRef = useRef();
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);
  const prevStatusCountRef = useRef({});


  const updateStatusCount = useCallback((newData) => {
    
    setStatusCount(prevStatusCount => {
      const updatedStatusCount = { ...prevStatusCount };
      newData.forEach(item => {
        if (['PAYMENT_COMPLETED', 'PREPARING_PRODUCT', 'AWAITING_RELEASE'].includes(item.statusName)) {
          updatedStatusCount[item.statusName] = item.count;
        }
      });
      return updatedStatusCount;
    });
  }, [])

  const checkForNewOrders = useCallback((newStatusCount) => {
    let hasNewOrder = false;
    ['PAYMENT_COMPLETED', 'PREPARING_PRODUCT', 'AWAITING_RELEASE'].forEach(status => {
      if (newStatusCount[status] > (prevStatusCountRef.current[status] || 0)) {
        hasNewOrder = true;
      }
    });
    prevStatusCountRef.current = {...newStatusCount};
    return hasNewOrder;
  }, []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchOrders();
    // const customerId = 1;
    const customerId = String(username);
    eventSourceRef.current = subscribeToOrderStatusUpdates(customerId);

    eventSourceRef.current.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSourceRef.current.onmessage = (event) => {
      console.log('Received SSE message:', event);
      const data = JSON.parse(event.data);
      console.log('Parsed SSE data:', data);

      setStatusCount(prevStatusCount => {
        const newStatusCount = {...prevStatusCount};
        data.forEach(item => {
          if (['PAYMENT_COMPLETED', 'PREPARING_PRODUCT', 'AWAITING_RELEASE'].includes(item.statusName)) {
            newStatusCount[item.statusName] = item.count;
          }
        });

        if (!isInitialMount.current) {
          const hasNewOrder = checkForNewOrders(newStatusCount);

          if (hasNewOrder) {
            if (isSoundOn) {
              audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
            }
            Swal.fire({
              title: 'Notification',
              text: '새로운 주문이 들어왔습니다',
              icon: 'info',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } else {
          isInitialMount.current = false;
        }

        prevStatusCountRef.current = newStatusCount;
        return newStatusCount;
      });
    };
  
    eventSourceRef.current.onerror = (error) => {
      console.error('SSE Error: ', error);
      eventSourceRef.current.close();
    };
  
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  // }, [updateStatusCount]);
  }, [checkForNewOrders, isSoundOn]); 


  useEffect(() => {
    // 사용자 상호작용 후 오디오를 로드합니다.
    const handleUserInteraction = () => {
      audioRef.current.load();
      document.removeEventListener('click', handleUserInteraction);
    };
    document.addEventListener('click', handleUserInteraction);
  
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);


  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: String(username),
        page: pagination.current - 1,
        size: pagination.pageSize,
        ...joinForm
      };

      Object.entries(joinForm).forEach(([key, value]) => {
        if (value != null && value !== '') {
          if (value instanceof Date) {
            params[key] = value.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
          } else if (Array.isArray(value)) {
            params[key] = value.join(','); // 배열을 쉼표로 구분된 문자열로 변환
          } else {
            params[key] = value;
          }
        }
      });

      console.log('Sending params:', params);
      console.log('Fetching with params:', params);
      
      const response = await fetchCustomerOrders(params);
      setFullOrders(response.content);
      console.log('받아온 주문 데이터: ', response);
      
      let isServerUnstable = false;
      
      const transformedOrders = response.content.map(order => {

        const isMemberInfoAvailable = order.availableMemberInformation;
        const isProductInfoAvailable = order.availableProductInformation;

        if (!isMemberInfoAvailable || !isProductInfoAvailable) {
          isServerUnstable = true;
        }


        //   // 서버 연결 상태 확인
        //   isMemberInfoAvailable = productOrderList.every(product => product.availableMemberInformation);  //  모든 상품에 대해...
        //   isProductInfoAvailable = productOrderList.every(product => product.availableProductInformation);
          
        //   if (!isMemberInfoAvailable || !isProductInfoAvailable) {
        //     isServerUnstable = true;
        //   }

        // }
      
      
        return {
          orderDetailId: order.orderDetailId?.toString() || '',
          // memberId: order.memberInfo?.memberId?.toString() || '',
          memberId: isMemberInfoAvailable ? order.memberInfo?.memberId?.toString() || '' : '가져오는 중...',
          orderDateTime: order.orderDateTime?.toString() || '',
          deliveryAddress: order.recipient?.recipientAddress?.toString() || '',
          recipient: order.recipient?.recipient?.toString() || '',
          orderStatusCode: order.orderStatusCode?.toString() || '',
          //productName: order.productOrderList?.length > 0 ? `${order.productOrderList[0].name} ${order.productOrderList.length > 1 ? `외 ${order.productOrderList.length - 1}건` : ''}` : '',
          productName: isProductInfoAvailable 
          ? (order.productOrderList?.length > 0 
              ? `${order.productOrderList[0].name} ${order.productOrderList.length > 1 ? `외 ${order.productOrderList.length - 1}건` : ''}` 
              : '')
          : '가져오는 중...',
        }
      });

      setOrders(transformedOrders);
      setIsServerUnstable(isServerUnstable);
      setPagination({
        ...pagination,
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      })
      
    } catch (error) {
      //console.error('Failed to fetch orders:', error);
      message.error('주문 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setJoinForm(prev => ({
      ...prev,
      [dataIndex]: selectedKeys[0] ? [selectedKeys[0]] : null
    }));
  };

  const onHandleReset = () => {
    setJoinForm({});
    setFilteredInfo({});
    setDateRange([]);
    if (tableRef.current) {
      tableRef.current.clearFilters();
    }
    fetchOrders();
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
          style={{ 
            marginBottom: 8, 
            display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => onHandleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => {
              close();
            }}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      if (record[dataIndex] == null) return false;
      
      const itemValue = record[dataIndex];
      const filterValue = value;
    
      // 날짜 처리
      if (itemValue instanceof Date) {
        const dateValue = itemValue.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        return dateValue.includes(filterValue);
      }
    
      // 그 외의 경우
      const stringItemValue = String(itemValue).toLowerCase();
      const stringFilterValue = String(filterValue).toLowerCase();
    
      return stringItemValue.includes(stringFilterValue);
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onHandleTableChange = (newPagination, filters) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
    setJoinForm(prev => ({
      ...prev,
      orderStatusCode: filters.orderStatusCode ? filters.orderStatusCode[0] : null
    }));
  };

  const onHandleRangePickerChange = (dates) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      setJoinForm(prev => ({
        ...prev,
        startDate: startDate,
        endDate: endDate
      }));
    } else {
      setJoinForm(prev => {
        const newForm = { ...prev };
        delete newForm.startDate;
        delete newForm.endDate;
        return newForm;
      });
    }
  };

  const onHandleStatusChange = async (status) => {
    if (selectedRowKeys.length === 0) {
      message.warning('변경할 항목을 선택해주세요.');
      return;
    }

    // selectedRowKeys 를 orderId로 가지고 있는 데이터를 찾아서 그 데이터의 status 값을 가지고 오면 됨
    // 1. 선택된 주문들의 정보를 가져옵니다.
    const selectedOrders = orders.filter(order => selectedRowKeys.includes(order.orderDetailId));

    // 2. 선택된 주문들의 현재 상태를 가져옵니다.
    const currentStatuses = selectedOrders.map(order => order.orderStatusCode);

    console.log('선택된 주문들:', selectedOrders);
    console.log('현재 상태들:', currentStatuses);

    // console.log('내가 누른 상태 변경 버튼: ', status)
    // console.log('선택한 행의 key값: ', selectedRowKeys)
    // console.log("변경할 status: ", orders.selectedRowKeys.orderId);
   
    
    const isValidStatus = selectedOrders.every(order => {
      console.log('현재 status: ', order.orderStatusCode);
      if (status == 'PREPARING_PRODUCT' && order.orderStatusCode !== 'PAYMENT_COMPLETED') {
        return false;
      }
      if (status == 'AWAITING_RELEASE' && order.orderStatusCode !== 'PREPARING_PRODUCT') {
        return false;
      }
      return true;
    });
  
    if (!isValidStatus) {
      message.error(`해당 주문건의 주문 상태는 ${status} 상태로 변경할 수 없습니다.`);
      return;
    }
  
    try {
      if (selectedRowKeys.length === 1) {
        await updateOrderStatus(selectedRowKeys[0], status);
      } else {
        await updateBulkOrderStatus(selectedRowKeys, status);
      }
      message.success('주문 상태가 성공적으로 변경되었습니다.');
      fetchOrders();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('주문 상태 변경 실패:', error);
      message.error('주문 상태 변경에 실패했습니다.');
    }
  };

  // useEffect(() => {
  //   if (!fetchOrders.length > 0) {
  //     if (isServerUnstable) {
  //       message.warning('일부 주문에서 서버 연결이 불안정합니다.');
  //     } else {
  //       //message.success('주문 데이터를 성공적으로 불러왔습니다.');
  //     }
  //   }
  // }, [isServerUnstable]);
  useEffect(() => {
    if (isServerUnstable) {
      message.warning('일부 서비스에 연결할 수 없습니다. 데이터가 부분적으로 표시될 수 있습니다.');
    }
  }, [isServerUnstable]);

  const onRow = (record) => {
    return {
      onClick: () => {
        const fullOrderData = fullOrders.find(order => order.orderDetailId === record.orderDetailId);
        console.log("Clicked record:", record);
        console.log('상세 페이지로 넘기는 데이터: ', fullOrderData)
        navigate('../general/${orderDetailId}', { 
          state: { 
            orderDetail: fullOrderData,
          } 
        }); 
      },
    };
  };


  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,  //  페이지가 넘어가도 순번 규칙이 이어서 적용됨
      width: '5%',
      fixed: 'left',
      //width: '5%',
      //fixed: 'left'  // 테이블의 왼쪽에 고정
    },
    {
      title: '주문ID',
      dataIndex: 'orderDetailId',
      key: 'orderDetailId',
      fixed: 'left',
      filteredValue: joinForm.orderId ? [joinForm.orderId] : null,
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
      filteredValue: joinForm.memberId ? [joinForm.memberId] : null,
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
      filteredValue: joinForm.orderDateTime ? [joinForm.orderDateTime] : null,
      filtered: false,
      ...getColumnSearchProps('orderDateTime'),
      width: '20%',
      render: (text) => {
        if (text === 'null' || !text) {
          return 'null';
        }  
        return moment(text).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: '배송지',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      filteredValue: joinForm.deliveryAddress ? [joinForm.deliveryAddress] : null,
      filtered: false,
      ...getColumnSearchProps('deliveryAddress'),
      width: '20%',
      render: (text) => text || 'null',
    },
    {
      title: '수령인',
      dataIndex: 'recipient',
      key: 'recipient',
      filteredValue: joinForm.recipient ? [joinForm.recipient] : null,
      filtered: false,
      ...getColumnSearchProps('recipient'),
      width: '10%',
      render: (text) => text || 'null',
    },
    // {
    //   title: '주문상품',
    //   dataIndex: 'productName',
    //   key: 'productName',
    //   fixed: 'left',
    //   filteredValue: filteredInfo.productName || null,
    //   filtered: false,
    //   ...getColumnSearchProps('productName'),
    //   width: '10%',
    //   // render: (text) => text || 'null',
    //   // render: (text) => text === '확인중' ? <span style={{ color: 'orange' }}>확인중</span> : (text || 'null'),
    // },
    {
      title: '주문 상태',
      dataIndex: 'orderStatusCode',
      key: 'orderStatusCode',
      filters: [
        { text: '결제완료', value: 'PAYMENT_COMPLETED' },
        { text: '상품준비중', value: 'PREPARING_PRODUCT' },
        { text: '출고대기중', value: 'AWAITING_RELEASE' },
      ],
      filteredValue: joinForm.orderStatusCode ? [joinForm.orderStatusCode] : null,
      onFilter: (value, record) => record.orderStatusCode === value,
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
      PAYMENT_COMPLETED: '#E2860A',
      // ORDER_APPROVED: 'blue',
      PREPARING_PRODUCT: '#447E7A',
      // IN_DELIVERY: 'purple',
      // DELIVERY_COMPLETED: 'cyan',
      AWAITING_RELEASE: '#D6737A'
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

  //const statusTags = ['결제완료', '상품준비중', '출고대기중'];

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>일반주문관리</h2>
        </Flex>
      </Flex>
      <Flex gap="small" align="center" justify='end'>
        <Flex gap="small" wrap>
          {['PAYMENT_COMPLETED', 'PREPARING_PRODUCT', 'AWAITING_RELEASE'].map((status) => (
          <StatusCard 
            key={status} 
            title={getStatusText(status)} 
            count={statusCount[status] || 0} 
            color={getStatusColor(status)}
          />
        ))}
        </Flex>
      </Flex>
      <br />
      <Flex className={style.fullScreen}>
        <Flex gap='large' align='center' justify='space-between'>
          <Flex gap="small" >
            <Flex gap='small'> 
              <Space align="center">검색기간</Space>
              <RangePicker 
                value={dateRange}
                onChange={onHandleRangePickerChange}
                allowClear
              />
            </Flex>
            <Button onClick={onHandleReset}>초기화</Button>
          </Flex>
          <Flex gap="small" >
            <Flex gap="small" align='center'>
              <Space align="center">음성 알림</Space>
              <Switch
                checkedChildren="ON"
                unCheckedChildren="OFF"
                checked={isSoundOn}
                onChange={(checked) => setIsSoundOn(checked)}
              />
            </Flex>
            <Space align="center">주문상태변경</Space>
            <StatusChangeButton 
              title={"주문승인"}
              onClick={() => onHandleStatusChange('PREPARING_PRODUCT')}
            />
            <StatusChangeButton 
              title={"출고대기"}
              onClick={() => onHandleStatusChange('AWAITING_RELEASE')}
            />
          </Flex>
        </Flex>
      </Flex>
      <br/>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={orders}
        rowKey="orderDetailId"
        pagination={pagination}
        loading={loading}
        onChange={onHandleTableChange}
        rowSelection={rowSelection}
        onRow={onRow}
        style={{ width: '100%', height: '300px' }} // 전체 테이블 크기 조정
        scroll={{ x: '100%', y: 400,}}// 가로 스크롤과 세로 스크롤 설정
      />
      
    </div>
  );
};

export default OrderGeneral;
