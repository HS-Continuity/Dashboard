import { fetchDeliveries, fetchDeliveryStatusCounts } from '../../apis/apisDelivery';
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Flex, Space, DatePicker, Button, message, Tag, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
const { RangePicker } = DatePicker;

const Delivery = () => {
  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  const [joinForm, setJoinForm] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const searchInput = useRef(null);
  const tableRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveryData();
    fetchStatusCounts();
  }, [pagination.current, pagination.pageSize, joinForm])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: 1,
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
      
      const response = await fetchDeliveries(params);

      console.log('받아오는 배송 데이터: ', response)

      const transformedDeliveries = response.content.map(delivery => ({
       //const productOrderListEntityLists = delivery.productOrderListEntityLists?.productOrderListEntityLists || null;

        additionalOrderCount: delivery.additionalOrderCount.toString() || '',
        deliveryId: delivery.deliveryId || '',
        deliveryStatusCode: delivery.deliveryStatusCode || '',
        memberId: delivery.memberId || '',
        representativeOrderId: delivery.representativeOrderId || '',
        shipmentNumber: delivery.shipmentNumber || '',
        startDeliveryDate: delivery.startDeliveryDate || ''
      }));

      setDeliveries(transformedDeliveries);
      setIsServerUnstable(false);
      setPagination({
        ...pagination,
        total: response.totalElements,
      })
      
    } catch (error) {
      message.error('배송 데이터를 불러오는데 실패했습니다.');
      setIsServerUnstable(true);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStatusCounts = async () => {
    try {
      const customerId = 1;
      const response = await fetchDeliveryStatusCounts(customerId);
      if (response) {
        console.log('Status counts response:', response);
        const counts = {};
        response.forEach(item => {
          counts[item.statusName] = item.count;
        });
        setStatusCount(counts);
      } else {
        console.error('No response received for status counts.');
      }
    } catch (error) {
      console.error('Failed to fetch status counts:', error);
      message.error('상태별 개수를 불러오는데 실패했습니다.');
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
    fetchDeliveryData();
  }

  const onHandleTableChange = (newPagination, filters) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
    setJoinForm(prev => ({
      ...prev,
      deliveryStatusCode: filters.deliveryStatusCode ? filters.deliveryStatusCode[0] : null
    }));
  };

  // const onHandleStatusChange = async (status) => {
  //   if (selectedRowKeys.length === 0) {
  //     message.warning('변경할 항목을 선택해주세요.');
  //     return;
  //   }
  
  //   const selectedDelivery = deliveries.filter(delivery => selectedRowKeys.includes(delivery.deliveryId));
    
  //   const isValidStatus = selectedDelivery.every(delivery => {
  //     console.log('현재 status: ', delivery.deliveryStatusCode);
  //     if (status === 'IN_DELIVERY' && delivery.deliveryStatusCode !== 'SHIPPED') {
  //       return false;
  //     }
  //     if (status === 'DELIVERED' && delivery.deliveryStatusCode !== 'IN_DELIVERY') {
  //       return false;
  //     }
  //     return true;
  //   });
  
  //   if (!isValidStatus) {
  //     message.error(`해당 주문건의 출고 상태는 ${status} 상태로 변경할 수 없습니다.`);
  //     return;
  //   }
  
  //   try {
  //     if (selectedRowKeys.length === 1) {
  //       await fetchDeliveryStatusCounts(selectedRowKeys[0], status);
  //     } else {
  //       await fetchDeliveryStatusCounts(selectedRowKeys, status);
  //     }
  //     message.success('배송 상태가 성공적으로 변경되었습니다.');
  //     fetchDeliveryData();
  //     setSelectedRowKeys([]);
  //   } catch (error) {
  //     console.error('배송 상태 변경 실패:', error);
  //     message.error('배송 상태 변경에 실패했습니다.');
  //   }
  // };

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
    // onFilter: (value, record) =>
    //   record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
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
      title: '배송ID',
      dataIndex: 'deliveryId',
      key: 'deliveryId',
      filteredValue: joinForm.deliveryId ? [joinForm.deliveryId] : null,
      ...getColumnSearchProps('deliveryId'),
    },
    {
      title: '배송시작일',
      dataIndex: 'startDeliveryDate',
      key: 'startDeliveryDate',
      filteredValue: joinForm.startDeliveryDate ? [joinForm.startDeliveryDate] : null,
      // ...getColumnSearchProps('startDeliveryDate'),
    },
    {
      title: '회원ID',
      dataIndex: 'memberId',
      key: 'memberId',
      filteredValue: joinForm.memberId ? [joinForm.memberId] : null,
      ...getColumnSearchProps('memberId'),
    },
    {
      title: 'representativeOrderId',
      dataIndex: 'representativeOrderId',
      key: 'representativeOrderId',
      filteredValue: joinForm.representativeOrderId ? [joinForm.representativeOrderId] : null,
      ...getColumnSearchProps('representativeOrderId'),
    },
    {
      title: '출고번호',
      dataIndex: 'shipmentNumber',
      key: 'shipmentNumber',
      filteredValue: joinForm.shipmentNumber ? [joinForm.shipmentNumber] : null,
      ...getColumnSearchProps('shipmentNumber'),
    },
    {
      title: '배송상태',
      dataIndex: 'deliveryStatusCode',
      key: 'deliveryStatusCode',
      filters: [
        { text: '출고완료', value: 'SHIPPED' },
        { text: '배송중', value: 'IN_DELIVERY' },
        { text: '배송완료', value: 'DELIVERED' },
      ],
      filteredValue: joinForm.deliveryStatusCode ? [joinForm.deliveryStatusCode] : null,
      onFilter: (value, record) => record.deliveryStatusCode === value,
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
      SHIPPED: 'green',
      IN_DELIVERY: 'orange',
      DELIVERED: 'cyan'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      SHIPPED: '출고완료',
      IN_DELIVERY: '배송중',
      DELIVERED: '배송완료'
    };
    return texts[status] || status;
  };

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>배송관리</h2>
        </Flex>
      </Flex>
      <Flex gap="small" align="center" justify='space-between'>
        <Flex gap="small" wrap>
          <Space align="center">검색기간</Space>
          <RangePicker 
            value={dateRange}
            // onChange={onHandleRangePickerChange}
            allowClear
          />
        </Flex>
        <Flex gap="small" wrap>
        {['SHIPPED', 'IN_DELIVERY', 'DELIVERED'].map((status) => (
          <StatusCard 
            key={status} 
            title={getStatusText(status)} 
            count={statusCount[status] || 0} 
          />
        ))}
        </Flex>
      </Flex>
      <br />
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap="small" wrap>
          {/* <Button >Clear Filter</Button> */}
          {/* <Button onClick={onClearFilters}>Clear Filter</Button> */}
          <Button onClick={onHandleReset}>Clear Filter</Button>
        </Flex>
        {/* <Flex gap="small" wrap>
          <Space align="center">출고상태변경</Space>
          <StatusChangeButton 
            title={"출고완료"}
            onClick={() => onHandleStatusChange('SHIPPED')}
          />
          <StatusChangeButton 
            title={"배송중"}
            onClick={() => onHandleStatusChange('IN_DELIVERY')}
          />
          <StatusChangeButton 
            title={"배송완료"}
            onClick={() => onHandleStatusChange('DELIVERED')}
          />
        </Flex> */}
        <br/>
      </Flex>
      <br/>
      <Table
        columns={columns}
        dataSource={deliveries}
        rowKey="deliveryId"
        pagination={pagination}
        loading={loading}
        onChange={onHandleTableChange}
        rowSelection={rowSelection}
      />
    </div>
  )
}

export default Delivery;