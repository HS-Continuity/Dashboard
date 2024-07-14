import { fetchTimeAttackItems } from '../../apis'; // fetchProductItems 함수를 가져오기
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, DatePicker, Table, Tag, Button, Input, message } from 'antd'
import { SearchOutlined, HourglassOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import RegisterButton from '../../components/Buttons/RegisterButton';
import ApplyButton from '../../components/Buttons/ApplyButton';
import TimeAttackApplyModal from '../../components/Modals/TimeAttackApplyModal';

import StatusCard from '../../components/Cards/StatusCard';


const ProductTimeSale = () => {
  
  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [ongoingCount, setOngoingCount] = useState(0);  //  진행중 개수
  const [finishedCount, setFinishedCount] = useState(0);  //  마감 개수
  
  const [timeSale, setTimeSale] = useState([]); // 상품 데이터를 저장할 상태 변수
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });
  const [productForm, setProductForm] = useState({}); // 각 필드별 상태 관리

  // ----------------------------------------------------------------------------------

  const { data: timeAttack, isLoading } = useQuery({
    queryKey: ["timeAttack"],
    queryFn: () => fetchTimeAttackItems()
  });

  console.log(timeAttack)

  // useEffect(() => {
  //   const now = moment();
  //   const ongoing = timeAttack.filter(item => moment(item.endTime).isAfter(now));
  //   const finished = timeAttack.filter(item => moment(item.endTime).isBefore(now));
    
  //   setOngoingCount(ongoing.length);
  //   setFinishedCount(finished.length);
  // }, [timeSale]); // timeAttack 상태가 변경될 때마다 실행

  const now = moment(); // 현재 시간
  //const endTimeMoment = moment({endTime}); // 종료 시간을 moment 객체로 변환

  

  // ----------------------------------------------------------------------------------

  
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
          // navigate('../timeSaleDetail'); 
          navigate(`${record.productId}`); 
        }
        setLastClickedRow(rowIndex);
        setLastClickedTime(currentTime);
      },
    };
  };
  // useEffect(() => {
  //   if (timeAttack) { // timeAttack이 존재하는지 확인
  //     setProductForm(timeAttack[0]); // product가 배열이 아닐 수 있으므로 바로 설정
  //     const endTime = moment(timeAttack.endTime);
  //     const currentTime = moment();

  //     // 마감 여부 자동 설정
  //     const isClosed = currentTime.isAfter(endTime);
  //     setProductForm({
  //       ...timeAttack,
  //       timeSaleStatus: isClosed ? 'O' : 'X'
  //     });
  //   }
  // }, [timeAttack]);

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
    // { 
    //   title: '마감여부', 
    //   dataIndex: 'endTime', // 종료시간이 기준
    //   key: '마감여부', 
    //   // render: (endTimeMoment) => {
    //   //   if (endTimeMoment.isBefore(now)) { // 종료 시간이 현재 시간보다 이전인 경우
    //   //     return 'O'; // 마감
    //   //   } else {
    //   //     return 'X'; // 진행 중
    //   //   }
    //   // },

    //   // render: (endTimeMoment) => endTimeMoment.isBefore(now) ? '마감' : '진행중',
      
    //   filters: [
    //     { text: '마감', value: 'O' },
    //     { text: '진행중', value: 'X' },
    //   ],
    //   filteredValue: filteredInfo.마감여부 || null,
    //   // onFilter: (value, record) => {
    //     // const endTimeMoment = moment(record.endTime);
  
    //     // if (value === '마감') {
    //     //   return endTimeMoment.isBefore(now);
    //     // } else if (value === '진행중') {
    //     //   return endTimeMoment.isAfter(now);
    //     // }
  
    //     // return false; // 필터 값이 없거나 일치하지 않는 경우 false 반환
    //   // },
    //   onCell: (record) => ({
    //     onClick: () => handleCellClick(record),
    //   })
    // },
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
          {/* <StatusCard title="진행중" count={ongoingCount}/>
          <StatusCard title="마감" count={finishedCount}/> */}
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
