import { fetchTimeSaleList } from '../../apis/apisProducts';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, Tag, Table, Button, Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import StatusCard from '../../components/Cards/StatusCard';
import styles from './Table.module.css';


const ProductTimeSale = () => {
  
  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const [timeSaleProducts, setTimeSaleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [joinForm, setJoinForm] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statusCount, setStatusCount] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const searchInput = useRef(null);
  const tableRef = useRef();
  const navigate = useNavigate();

  const [state, setState] = useState({
    isModalOpen: false,
    selectedRowKeys: [],
    filteredInfo: {},
    tableParams: {
      pagination: {
        current: 1,
        pageSize: 20,
      },
    },
  });

  useEffect(() => {
    fetchTimeSales();
    
  }, [])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  const fetchTimeSales = async (page = pagination.current, pageSize = pagination.pageSize, form = joinForm) => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        pageSize: pageSize,
        ...form
      };

      console.log('Sending params:', params);

      const response = await fetchTimeSaleList();
      console.log('받아온 데이터: ', response)

      const transformedTimeSales = response.map(item => {
        return {
          discountRate: item.discountRate,
          endDateTime: moment(item.endDateTime).format('YYYY-MM-DD HH:mm'),
          price: item.price,
          productId: item.productId,
          productName: item.productName,
          serviceStatus: item.serviceStatus,
          startDateTime: moment(item.startDateTime).format('YYYY-MM-DD HH:mm'),
          timesaleId: item.timesaleId
        }
      });

      setTimeSaleProducts(transformedTimeSales);
      setPagination({
        ...pagination,
        total: response.totalElements
      });

      // 상태별 개수 계산
      const counts = transformedTimeSales.reduce((acc, item) => {
        acc[item.serviceStatus] = (acc[item.serviceStatus] || 0) + 1;
        return acc;
      }, {});
      setStatusCount(counts);

    } catch (error) {
      message.error('타임세일 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(true);
    }
  };
  
  const clearFilters = () => {
    setFilteredInfo({});
    fetchTimeSales();
  };

  const onHandleReset = (clearFilters) => {  //  컬럼별 리셋
    clearFilters();
    setSearchText('');
  };

  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.timesaleId)
    setSelectedRowKeys(record.productId)
  }

  const onRow = (record) => {
    return {
      onClick: () => {
        // if (record && record.timesaleId) {
          navigate(`/product/timesale/${record.timesaleId}`);
          console.log('주소: ', record.timesaleId)
        // } else {
        //   console.error('Invalid record: ', record);
        //   message.error('타임세일 정보를 불러올 수 없습니다.');
        // }
      }
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
          ref={searchInput}
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
            onClick={() => clearFilters && onHandleReset(clearFilters)}
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
      />
    ),
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return recordValue !== undefined && recordValue.toString().toLowerCase().includes(value.toLowerCase());
    }, 

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const onHandleTableChange = (newPagination, filters) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
  }

  // // -------------------------------------------------------------------------
  const columns = [
    { 
      title: '타임세일식품ID', 
      dataIndex: 'timesaleId', 
      key: 'timesaleId',
      filteredValue: filteredInfo.timesaleId || null,
      filtered: false,
      ...getColumnSearchProps('timesaleId'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '식품ID', 
      dataIndex: 'productId', 
      key: 'productId',
      filteredValue: filteredInfo.productId || null,
      filtered: false,
      ...getColumnSearchProps('productId'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '식품명', 
      dataIndex: 'productName', 
      key: 'productId',
      filteredValue: filteredInfo.productName || null,
      filtered: false,
      ...getColumnSearchProps('productName'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '타임세일시작', 
      dataIndex: 'startDateTime', 
      key: 'startDateTime',
      filteredValue: filteredInfo.startDateTime || null,
      filtered: false,
      ...getColumnSearchProps('startDateTime') ,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '타임세일종료', 
      dataIndex: 'endDateTime', 
      key: 'endDateTime',
      filteredValue: filteredInfo.endDateTime || null,
      filtered: false,
      ...getColumnSearchProps('endDateTime')  ,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '타임세일 할인율', 
      dataIndex: 'discountRate', 
      key: 'discountRate',
      render: (discountRate) => `${discountRate}%`,
      filteredValue: filteredInfo.discountRate || null,
      filtered: false,
      ...getColumnSearchProps('discountRate'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '마감여부',
      dataIndex: 'endDateTime', // 종료시간이 기준
      key: '마감여부',
      render: (endDateTime) => {
        const endTimeMoment = moment(endDateTime);
        const currentTime = moment();
        return endTimeMoment.isBefore(currentTime) ? 'O' : 'X'; // 마감 여부 표시
      },
      filters: [
        { text: '마감', value: 'O' },
        { text: '진행중', value: 'X' },
      ],
      filteredValue: filteredInfo.endDateTime || null,
      onFilter: (value, record) => {
        const endTimeMoment = moment(record.endDateTime);
        const currentTime = moment();
        return (endTimeMoment.isBefore(currentTime) ? 'O' : 'X') === value; // 마감 여부 필터링
      },
      onCell: (record) => ({
        onClick: () => handleCellClick(record), // 셀 클릭 이벤트 처리
      }),
    },
    { 
      title: '서비스 상태', 
      dataIndex: 'serviceStatus', 
      key: 'serviceStatus', 
      //render: (visible) => (visible === 'O' ? '노출' : '미노출'), 
      filters: [
        { text: '승인대기', value: 'PENDING' },
        { text: '승인', value: 'APPROVE' },
        { text: '진행중', value: 'IN_PROGRESS' },
        { text: '마감', value: 'ENDED_EVENT' },
        { text: '취소', value: 'CANCELED' },
      ],
      filteredValue: filteredInfo.serviceStatus || null,
      onFilter: (value, record) => record.serviceStatus === value,
      render: (status) => (
        <Tag color={getTagColor(status)}>
          {getTagText(status)}
        </Tag>
      ),
    },
  ];

  const getTagColor = (status) => {
    const colors = {
      PENDING: 'cyan',
      APPROVE: 'orange',
      IN_PROGRESS: 'blue',
      ENDED_EVENT: 'green',
      CANCELED: 'gray'
    };
    return colors[status] || 'default';
  };

  const getTagText = (status) => {
    const texts = {
      PENDING: '승인대기',
      APPROVE: '승인',
      IN_PROGRESS: '진행중',
      ENDED_EVENT: '마감',
      CANCELED: '취소'
    };
    return texts[status] || status;
  };
  // --------------------------------------------------------------------------

  // const tableData = timeAttack || []; 

  return (
    <div>
      <Flex gap='small' align="center" justify='space-between'>
        <Flex gap="small" wrap>
          <h2>타임어택식품관리</h2>
        </Flex>
      </Flex>
      <Flex gap='small' align="center" justify='space-between'>
        <Flex gap="small" wrap>
          <Button onClick={clearFilters}>Clear Filter</Button>
        </Flex>
        <Flex gap="small" wrap>
          <StatusCard title="승인대기" count={statusCount['PENDING'] || 0} />
          <StatusCard title="승인" count={statusCount['APPROVE'] || 0} />
          <StatusCard title="진행중" count={statusCount['IN_PROGRESS'] || 0} />
          <StatusCard title="마감" count={statusCount['ENDED_EVENT'] || 0} />
          <StatusCard title="취소" count={statusCount['CANCELED'] || 0} />
        </Flex>
      </Flex>
      <br/>   
      <Table
      className={styles.customTable}
      columns={columns}
      rowSelection={rowSelection}
      dataSource={timeSaleProducts}
      pagination={pagination}
      onChange={onHandleTableChange}
      onRow={onRow}
      rowKey="productId"
      style={{ width: '100%', height: '400px'}} // 전체 테이블 크기 조정
      scroll={{ x: '100%', y: 400,}}// 가로 스크롤과 세로 스크롤 설정
      />
    </div>
  );
};

export default ProductTimeSale;
