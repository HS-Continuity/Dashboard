import { fetchTimeAttackItems } from '../../apis'; // fetchProductItems 함수를 가져오기
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, Table, Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import StatusCard from '../../components/Cards/StatusCard';


const ProductTimeSale = () => {
  
  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });

  // ----------------------------------------------------------------------------------

  const { data: timeAttack, isLoading } = useQuery({
    queryKey: ["timeAttack"],
    queryFn: () => fetchTimeAttackItems()
  });

  if (isLoading) {
    return <div>Loading...</div>; // or a more sophisticated loading indicator
}

  // console.log(timeAttack)
  
  // -----------------------------------------------------------------------

  
  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const onHandleChange = (pagination, filters) => {
    setFilteredInfo(filters);  //  필터링 정보 업데이트
  };

  const onClearFilters = () => {  //  모든 필터 초기화 이벤트
    setFilteredInfo({});
  };

  const onHandleReset = (clearFilters) => {  //  컬럼별 리셋
    clearFilters();
    setSearchText('');
  };

  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.productId)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
      console.log('key값업데이트', selectedRowKeys)
    },
    onClick: (e) => {
      console.log(e);
    },
  };

  const onRow = (record, rowIndex) => {
    return {
      onClick: (e) => {
        const currentTime = new Date().getTime();
        if (
          lastClickedRow === rowIndex &&
          currentTime - lastClickedTime < 300 // 300ms 이내에 두 번 클릭하면 더블 클릭으로 간주
        ) {
          navigate(`${record.productId}`); 
        }
        setLastClickedRow(rowIndex);
        setLastClickedTime(currentTime);
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

  // -------------------------------------------------------------------------
  const columns = [
    { 
      title: '타임어택세일ID', 
      dataIndex: 'timeAttackSaleId', 
      key: 'timeAttackSaleId',
      filteredValue: filteredInfo.timeAttackSaleId || null,
      filtered: false,
      ...getColumnSearchProps('timeAttackSaleId'),
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
      title: '할인율', 
      dataIndex: 'discountRate', 
      key: 'discountRate',
      render: (discountRate) => `${discountRate}%`,
      filteredValue: filteredInfo.discountRate || null,
      filtered: false,
      ...getColumnSearchProps('discountRate') ,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '시작시간', 
      dataIndex: 'startTime', 
      key: 'startTime',
      filteredValue: filteredInfo.startTime || null,
      filtered: false,
      ...getColumnSearchProps('startTime') ,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '종료시간', 
      dataIndex: 'endTime', 
      key: 'endTime',
      filteredValue: filteredInfo.endTime || null,
      filtered: false,
      ...getColumnSearchProps('endTime')  ,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '마감여부',
      dataIndex: 'endTime', // 종료시간이 기준
      key: '마감여부',
      render: (endTime) => {
        const endTimeMoment = moment(endTime);
        const currentTime = moment();
        return endTimeMoment.isBefore(currentTime) ? 'O' : 'X'; // 마감 여부 표시
      },
      filters: [
        { text: '마감', value: 'O' },
        { text: '진행중', value: 'X' },
      ],
      filteredValue: filteredInfo.마감여부 || null,
      onFilter: (value, record) => {
        const endTimeMoment = moment(record.endTime);
        const currentTime = moment();
        return endTimeMoment.isBefore(currentTime) === (value === 'O'); // 마감 여부 필터링
      },
      onCell: (record) => ({
        onClick: () => handleCellClick(record), // 셀 클릭 이벤트 처리
      }),
    },
  ];
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
          <Button onClick={onClearFilters}>Clear Filter</Button>
        </Flex>
        <Flex gap="small" wrap>
          <StatusCard title="진행중" />
          <StatusCard title="마감" />
        </Flex>
      </Flex>

      <Table
      columns={columns}
      rowSelection={rowSelection}
      dataSource={timeAttack}
      pagination={tableParams.pagination}
      onChange={onHandleChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="timeAttackSaleId"
      />
    </div>
  );
};

export default ProductTimeSale;
