import { fetchAdvertisements} from '../../apis/apisPromotion';
import { useEffect, useRef, useState} from 'react';
import { Flex, Table, Tag, Button, Input, Space, message, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import StatusCard from '../../components/Cards/StatusCard';
import styles from './Table.module.css';
const { RangePicker } = DatePicker;


const Promotion = () => {
  // ***************
  const [dateRange, setDateRange] = useState([]);
  //**************** 
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [joinForm, setJoinForm] = useState({});
  const searchInput = useRef(null);
  const tableRef = useRef(null);


  useEffect(() => {
    fetchAdvertisementData();
  }, [pagination.current, pagination.pageSize, dateRange, joinForm]);

  const fetchAdvertisementData = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: 1, // 실제 사용시 로그인한 고객의 ID를 사용해야 함
        startPage: pagination.current - 1,
        pageSize: pagination.pageSize,
        ...joinForm
      };
      // ******************************
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      // ******************************

      const response = await fetchAdvertisements(params);

      let transformedPromoData = response.map(promo => {

        return {
          discountRate: promo.discountRate,
          endDate: promo.endDate,
          price: promo.price,
          productId: promo.productId,
          productImage: promo.productImage,
          productName: promo.productName,
          serviceStatus: promo.serviceStatus,
          startDate: promo.startDate
        }
      })
      
      // ******************************
      // if (dateRange && dateRange.length === 2) {
      //   transformedPromoData = transformedPromoData.filter(ad => {
      //     const adStartDate = new Date(ad.startDate);
      //     const adEndDate = new Date(ad.endDate);
      //     return adStartDate >= dateRange[0].startOf('day') && adEndDate <= dateRange[1].endOf('day');
      //   });
      // }
      
      // ******************************

      setAdvertisements(transformedPromoData);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (error) {
      message.error('광고 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
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
          <Button onClick={() => onHandleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onHandleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    // setJoinForm(prev => ({
    //   ...prev,
    //   ...filters,
    // }));
  };

  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setJoinForm(prev => ({
      ...prev,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const onHandleReset = () => {
    setJoinForm({});
    setFilteredInfo({});
    // *****************************
    setDateRange([]);
    // *****************************
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0,
    });
    if (tableRef.current) {
      tableRef.current.clearFilters();
      tableRef.current.clearSorters();
    }
    fetchAdvertisementData();
    };

    // *****************************
    // const onHandleDateRangeChange = (dates) => {
    //   setDateRange(dates);
    //   if (dates) {
    //     const filteredData = advertisements.filter(ad => {
    //       const adStartDate = new Date(ad.startDate);
    //       const adEndDate = new Date(ad.endDate);
    //       return adStartDate >= dates[0].startOf('day') && adEndDate <= dates[1].endOf('day');
    //     });
    //     setAdvertisements(filteredData);
    //   } else {
    //     fetchAdvertisementData(dates);
    //   }
    // };
    const onHandleDateRangeChange = (dates) => {
      setDateRange(dates);
      setPagination(prev => ({ ...prev, current: 1 })); // 페이지 초기화
      fetchAdvertisementData();
    };
    // *****************************

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
      title: '상품ID',
      dataIndex: 'productId',
      key: 'productId',
      filteredValue: filteredInfo.productId || null,
      filtered: false,
      ...getColumnSearchProps('productId'),
    },
    {
      title: '상품명',
      dataIndex: 'productName',
      key: 'productName',
      filteredValue: filteredInfo.productName || null,
      filtered: false,
      ...getColumnSearchProps('productName'),
    },
    {
      title: '상품가격',
      dataIndex: 'price',
      key: 'price',
      filteredValue: filteredInfo.price || null,
      filtered: false,
      render: (price) => price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '₩ '),
      ...getColumnSearchProps('price'),
    },
    {
      title: '할인율',
      dataIndex: 'discountRate',
      key: 'discountRate',
      filteredValue: filteredInfo.discountRate || null,
      filtered: false,
      render: (discountRate) => `${discountRate} %`,
      ...getColumnSearchProps('discountRate'),
    },
    {
      title: '상품이미지',
      dataIndex: 'productImage',
      key: 'productImage',
      filteredValue: filteredInfo.discoauntRate || null,
      filtered: false,
      ...getColumnSearchProps('productImage'),
    },
    {
      title: '광고 시작일',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      sortOrder: sortedInfo.columnKey === 'startDate' && sortedInfo.order,
    },
    {
      title: '광고 종료일',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      sortOrder: sortedInfo.columnKey === 'endDate' && sortedInfo.order,
    },
    {
      title: '광고 상태',
      dataIndex: 'serviceStatus',
      key: 'serviceStatus',
      filteredValue: filteredInfo.serviceStatus || null,
      filters: [
        { text: '대기', value: 'PENDING' },
        { text: '승인', value: 'APPROVE' },
        { text: '진행중', value: 'IN_PROGRESS' },
        { text: '마감', value: 'ENDED_EVENT' },
        { text: '취소', value: 'CANCELED' },
      ],
      onFilter: (value, record) => record.serviceStatus === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'green',
      APPROVE: 'orange',
      IN_PROGRESS: 'cyan',
      ENDED_EVENT: 'pink',
      CANCELED: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: '대기',
      APPROVE: '승인',
      IN_PROGRESS: '진행중',
      ENDED_EVENT: '마감',
      CANCELED: '취소'
    };
    return texts[status] || status;
  };

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>상단 노출 관리</h2>
        </Flex>
      </Flex>
      <Flex gap="small" align="center" justify='space-between'>
      <Flex gap="small" wrap>
        <Space align="center">검색기간</Space>
          <RangePicker 
            value={dateRange}
            onChange={onHandleDateRangeChange}
            allowClear
            onCalendarChange={(dates) => {
              if (!dates) {
                onHandleReset();
              }
            }}
          />
        </Flex>
        <Flex gap="small" wrap>
          <StatusCard title="광고진행중" count={advertisements.filter(ad => ad.serviceStatus === 'IN_PROGRESS').length} />
          <StatusCard title="광고마감" count={advertisements.filter(ad => ad.serviceStatus === 'ENDED_EVENT').length} />
        </Flex>
      </Flex>
      <Flex gap="small" wrap>
          <Button onClick={onHandleReset}>Clear Filter</Button>
        </Flex>
      <br />
      <Table
        className={styles.customTable}
        ref={tableRef}
        columns={columns}
        dataSource={advertisements}
        rowKey="productId"
        pagination={pagination}
        loading={loading}
        onChange={onHandleTableChange}
        style={{ width: '100%', height: '400px'}} // 전체 테이블 크기 조정
        scroll={{ x: '100%', y: 400,}}// 가로 스크롤과 세로 스크롤 설정
      />
    </div>
  );
};

export default Promotion;
