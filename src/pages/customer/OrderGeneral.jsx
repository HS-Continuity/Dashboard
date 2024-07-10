import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, DatePicker, Table, Tag, Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import CommonSearchBar from '../../components/Searchbar/CommonSearchBar';


const { RangePicker } = DatePicker;
const orderStatusTags = ['결제완료', '주문승인', '배송준비중','배송중', '배송완료'];
const tagColors = {
  '결제완료': 'green',
  '주문승인': 'blue',
  '배송준비중': 'orange',
  '배송중': 'purple',
  '배송완료': 'cyan',
};

const data = [
  {
    key: '1',
    no: 1,
    주문번호: 100001,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-02-01',
    상품: '오이 외 1건',
    tags: ['배송완료'],
    카테고리: '1번카테'
  },
  {
    key: '2',
    no: 2,
    주문번호: 100002,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['결제완료'],
    카테고리: '1번카테'
  },
  {
    key: '3',
    no: 3,
    주문번호: 100003,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-31',
    상품: '오이 외 1건',
    tags: ['주문승인'],
    카테고리: '2번카테'
  },
  {
    key: '4',
    no: 4,
    주문번호: 100004,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-04-01',
    상품: '오이 외 1건',
    tags: ['배송중'],
    카테고리: '2번카테'
  },
  {
    key: '5',
    no: 5,
    주문번호: 100005,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-15',
    상품: '오이 외 1건',
    tags: ['결제완료'],
    카테고리: '3번카테'
  },
];

const OrderGeneral = () => {

  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
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

  // status별 개수 세기
  // 1. 빈 객체 생성하기 (태그별 개수 저장)
  const statusCounts = {};
  // 2. forEach 사용해서 orderStatusTags 배열 순회하기
  orderStatusTags.forEach((tag) => {
    // 옵셔널 체이닝(?.) 사용해서 item.tags가 존재하는 경우에만 includes(tag) 호출하기
    // 태그가 key, 개수가 value
    statusCounts[tag] = datasRef.current.filter((item) => item.tags?.includes(tag)).length;
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

  const onHandleRangePickerChange = (dates) => {
    setSelectedDateRange(dates || []);  //  상태 업데이트
  }

  const applyFilters = (data) => {
    if (!selectedDateRange || selectedDateRange.length === 0) {
      return data;
    } else {
      const startDate = selectedDateRange[0].startOf('day').format('YYYY-MM-DD');
      const endDate = selectedDateRange[1].endOf('day').format('YYYY-MM-DD');
  
      return data.filter(item => {
        const itemDate = moment(item.배송시작일, 'YYYY-MM-DD').startOf('day');
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
  const onHandleStatusChange = (newStatus) => {
    // 1. 깊은 복사
    const updatedData = JSON.parse(JSON.stringify(datasRef.current)); 

    // 2. tags 값 변경
    updatedData.forEach(item => {
      if (selectedRowKeys.includes(item.key)) {
        item.tags = [newStatus]; 
      }
    });

    // 3. 상태 업데이트 및 localStorage 저장
    datasRef.current = updatedData;
    setDatas(updatedData);
    setFilteredData(applyFilters(updatedData));
    localStorage.setItem('OrderGeneralData', JSON.stringify(updatedData)); 
    setSelectedRowKeys([]);
    console.log("StatusChangeButton 클릭 후 변경된 데이터:", updatedData);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
    },
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('OrderGeneralData')) || data; // localStorage에서 불러오기
    datasRef.current = storedData;
    setDatas(storedData);
    setFilteredData(applyFilters(datas));
    console.log("페이지 최초 렌더링 시 데이터:", storedData);
  }, []);

  useEffect(() => {
    setFilteredData(applyFilters(datas)); // datas 변경 시 filteredData 업데이트
  }, [datas, selectedDateRange]); // datas와 selectedDateRange에 의존하도록 변경

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
      dataIndex: 'no',  // 해당 데이터가 어떤 필드에 있는지
      key: 'no',
      fixed: 'left'
    },
    {
      title: '주문번호',
      dataIndex: '주문번호',
      key: '주문번호',
      fixed: 'left',
      filteredValue: filteredInfo.주문번호 || null,
      filtered: false,
      ...getColumnSearchProps('주문번호'),
    },
    {
      title: '회원ID',
      dataIndex: '회원ID',
      key: '회원ID',
      fixed: 'left',
      filteredValue: filteredInfo.회원ID || null,
      filtered: false,
      ...getColumnSearchProps('회원ID'),
    },
    {
      title: '회원명',
      dataIndex: '회원명',
      key: '회원명',
      fixed: 'left',
      filteredValue: filteredInfo.회원명 || null,
      filtered: false,
      ...getColumnSearchProps('회원명'),
    },
    {
      title: '휴대전화번호',
      dataIndex: '휴대전화번호',
      key: '휴대전화번호',
      fixed: 'left',
      filteredValue: filteredInfo.휴대전화번호 || null,
      filtered: false,
      ...getColumnSearchProps('휴대전화번호'),
    },
    {
      title: '배송시작일',
      dataIndex: '배송시작일',
      key: '배송시작일',
      fixed: 'left',
      filteredValue: filteredInfo.배송시작일 || null,
      filtered: false,
      ...getColumnSearchProps('배송시작일'),
    },
    {
      title: '상품',
      dataIndex: '상품',
      key: '상품',
      fixed: 'left',
      filteredValue: filteredInfo.상품 || null,
      filtered: false,
      ...getColumnSearchProps('상품'),
    },
    {
      title: '출고상태',
      dataIndex: 'tags',  //  밑에 데이터에서 'tags' 필드를 사용하므로
      key: 'tags',
      render: (_, {tags}) => (
        <>
          {tags.map((tag) => {  //  출고상태정보가 출고상태 필드에 저장되어 있으므로
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
      filteredValue: filteredInfo.tags || null,  //  컬럼의 dataIndex를 키로 사용
      onFilter: (value, record) => record.tags.includes(value),  //  선택된 태그 값(value)이 record.tag 배열에 포함되어 있는지 확인 후 필터링하기
    },
  ];

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
          {orderStatusTags.map((tag) => (
            <StatusCard key={tag} title={tag} count={statusCounts[tag]} />
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
            onClick={() => {
              onHandleStatusChange('주문승인');
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송준비중"}
            onClick={() => {
              onHandleStatusChange('배송준비중');
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송중"}
            onClick={() => {
              onHandleStatusChange('배송중');
              setSelectedRowKeys([]);
            }}
          />
          <StatusChangeButton 
            title={"배송완료"}
            onClick={() => {
              onHandleStatusChange('배송완료');
              setSelectedRowKeys([]);
            }}
          />
        </Flex>
      </Flex>
      <br />
      <Table
        columns={columns}
        //rowSelection={{}}  // 체크박스
        rowSelection={rowSelection}
        dataSource={filteredData}
        pagination={tableParams.pagination}
        onChange={onHandleChange}  // 페이지 변경 이벤트
        scroll={{ x: 1300 }}
        onRow={onRow}
        rowKey="key"
      />
    </div>
  );
};

export default OrderGeneral;
