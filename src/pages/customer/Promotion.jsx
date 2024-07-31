import { fetchAdvertisements} from '../../apis/apisPromotion';
import { useEffect, useRef, useState} from 'react';
import { Flex, Table, Tag, Button, Input, Space, message, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import StatusCard from '../../components/Cards/StatusCard';
const { RangePicker } = DatePicker;


const Promotion = () => {
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
  }, [pagination.current, pagination.pageSize]);

  const fetchAdvertisementData = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: 1, // 실제 사용시 로그인한 고객의 ID를 사용해야 함
        startPage: pagination.current - 1,
        pageSize: pagination.pageSize,
        // ...joinForm
      };
      const response = await fetchAdvertisements(params);

      const transformedPromoData = response.map(promo => {

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
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
    // setJoinForm({});
    setFilteredInfo({});
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
            // value={dateRange}
            // onChange={onHandleRangePickerChange}
            allowClear
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
        ref={tableRef}
        columns={columns}
        dataSource={advertisements}
        rowKey="productId"
        pagination={pagination}
        loading={loading}
        onChange={onHandleTableChange}
      />
    </div>
  );
};

export default Promotion;
