import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, DatePicker, Table, Tag, Button, Input } from 'antd'
import { SearchOutlined, HourglassOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import RegisterButton from '../../components/Buttons/RegisterButton';
import ApplyButton from '../../components/Buttons/ApplyButton';


const data = [
  {
    key: '1',
    no: 1,
    식품ID: 100010,
    고객ID: 200010,
    식품상세카테고리ID: 500010,
    식품명: '오감자',
    식품가격: 5000,
    기본할인율: 2,
    정기배송할인율: 5,
    페이지노출여부: 'O',
  },
  {
    key: '2',
    no: 2,
    식품ID: 100011,
    고객ID: 200011,
    식품상세카테고리ID: 500011,
    식품명: '오고구마',
    식품가격: 8000,
    기본할인율: 2,
    정기배송할인율: 5,
    페이지노출여부: 'O',
  },
  {
    key: '3',
    no: 3,
    식품ID: 100012,
    고객ID: 200012,
    식품상세카테고리ID: 500012,
    식품명: '오옥수수',
    식품가격: 4500,
    기본할인율: 2,
    정기배송할인율: 5,
    페이지노출여부: 'X',
  },
  {
    key: '4',
    no: 4,
    식품ID: 100013,
    고객ID: 200013,
    식품상세카테고리ID: 500013,
    식품명: '오키위',
    식품가격: 5500,
    기본할인율: 2,
    정기배송할인율: 5,
    페이지노출여부: 'O',
  },
  {
    key: '5',
    no: 5,
    식품ID: 100014,
    고객ID: 200014,
    식품상세카테고리ID: 500014,
    식품명: '오토마토',
    식품가격: 6000,
    기본할인율: 2,
    정기배송할인율: 5,
    페이지노출여부: 'O',
  },
  {
    key: '6',
    no: 6,
    식품ID: 100015,
    고객ID: 200015,
    식품상세카테고리ID: 500015,
    식품명: '오가지',
    식품가격: 3500,
    기본할인율: 2,
    정기배송할인율: 5,
    페이지노출여부: 'X',
  },
  {
    key: '7',
    no: 7,
    식품ID: 100016,
    고객ID: 200016,
    식품상세카테고리ID: 500016,
    식품명: '오콩나물',
    식품가격: 4500,
    기본할인율: 2,
    정기배송할인율: 5,
    페이지노출여부: 'O',
  }
];


const ProductGeneral = () => {

  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const datasRef = useRef(data);  //  상태 변경 후 영구 저장
  const [datas, setDatas] = useState(data);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [filteredData, setFilteredData] = useState(datasRef.current);  //  초기값은 원본 데이터(data)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });

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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
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
          navigate('../generalDetail', { 
            state: { 
              selectedTags: record.tags,
              selectedOrderId: record.주문번호,
              selectedOrderDate: record.배송시작일,
            } 
          }); 
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
      setFilteredData(datasRef.current.filter(item => {
        if (dataIndex === "tags") {
          return item.tags.includes(value);
        } else {
          return item[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
        }
      }));
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

  const columns = [
    {
      title: 'NO.',
      dataIndex: 'no',
      key: 'no',
      fixed: 'left'
    },
    {
      title: '식품ID',
      dataIndex: '식품ID',
      key: '식품ID',
      fixed: 'left',
      filteredValue: filteredInfo.식품ID || null,
      filtered: false,
      ...getColumnSearchProps('식품ID'),
    },
    {
      title: '고객ID',
      dataIndex: '고객ID',
      key: '고객ID',
      fixed: 'left',
      filteredValue: filteredInfo.고객ID || null,
      filtered: false,
      ...getColumnSearchProps('고객ID'),
    },
    {
      title: '식품상세카테고리ID',
      dataIndex: '식품상세카테고리ID',
      key: '식품상세카테고리ID',
      fixed: 'left',
      filteredValue: filteredInfo.식품상세카테고리ID || null,
      filtered: false,
      ...getColumnSearchProps('식품상세카테고리ID'),
    },
    {
      title: '식품명',
      dataIndex: '식품명',
      key: '식품명',
      fixed: 'left',
      filteredValue: filteredInfo.식품명 || null,
      filtered: false,
      ...getColumnSearchProps('식품명'),
    },
    {
      title: '식품가격',
      dataIndex: '식품가격',
      key: '식품가격',
      fixed: 'left',
      filteredValue: filteredInfo.식품가격 || null,
      filtered: false,
      ...getColumnSearchProps('식품가격'),
    },
    {
      title: '기본할인율',
      dataIndex: '기본할인율',
      key: '기본할인율',
      fixed: 'left',
      filteredValue: filteredInfo.기본할인율 || null,
      filtered: false,
      ...getColumnSearchProps('기본할인율'),
    },
    {
      title: '정기배송할인율',
      dataIndex: '정기배송할인율',
      key: '정기배송할인율',
      fixed: 'left',
      filteredValue: filteredInfo.정기배송할인율 || null,
      filtered: false,
      ...getColumnSearchProps('정기배송할인율'),
    },
    {
      title: '페이지노출여부',
      dataIndex: '페이지노출여부',
      key: '페이지노출여부',
      filters: [
        { text: 'O', value: 'O' },
        { text: 'X', value: 'X' },
      ],
      filteredValue: filteredInfo.페이지노출여부 || null,
      // onFilter: (value, record) => record.name.includes(value),
      // ellipsis: true,
      filtered: false,
      width: 100,
      onFilter: (value, record) => record.페이지노출여부 === value,
    },
  ]

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>일반식품관리</h2>
        </Flex>
      </Flex>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap="small" wrap>
          <Button onClick={onClearFilters}>Clear Filter</Button>
          {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
        </Flex>
        <Flex gap="small" wrap>
          <RegisterButton 
            title={"식품 등록하기"}
            onClick={() => {
              
            }}
          />
          <ApplyButton 
            title={"타임어택"}
            onClick={() => {
              
            }}
          />
          <ApplyButton 
            title={"친환경"}
            onClick={() => {
              
            }}
          />
        </Flex>
        
      </Flex>
      <Table
      columns={columns}
      rowSelection={rowSelection}
      dataSource={data}
      pagination={tableParams.pagination}
      onChange={onHandleChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="key"
      />
    </div>
  )
};

export default ProductGeneral;
