import { useRef, useState, useMemo } from 'react';
import { Flex, Space, DatePicker, Table, Tag, Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';

const { RangePicker } = DatePicker;
const deliveryStatusTags = ['배송준비', '배송완료', '환불'];
const tagColors = {
  '배송준비': 'green',
  '배송완료': 'blue',
  '환불': 'orange'
};

const data = [
  {
    key: '1',
    no: 1,
    주문번호: 100001,
    배송번호: 200001,
    회원ID: 'C00001',
    회원명: '김하늘',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['배송준비']
  },
  {
    key: '2',
    no: 2,
    주문번호: 100002,
    배송번호: 200002,
    회원ID: 'C00001',
    회원명: '이태양',
    배송시작일: '2024-04-02',
    상품: '오이 외 2건',
    tags: ['배송완료']
  },
  {
    key: '3',
    no: 3,
    주문번호: 100001,
    배송번호: 200001,
    회원ID: 'C00001',
    회원명: '박은별',
    배송시작일: '2024-03-01',
    상품: '오이 외 1건',
    tags: ['배송준비']},
  {
    key: '4',
    no: 4,
    주문번호: 100001,
    배송번호: 200001,
    회원ID: 'C00001',
    회원명: '최바다',
    배송시작일: '2024-02-01',
    상품: '오이 외 1건',
    tags: ['환불']
  },
  {
    key: '5',
    no: 5,
    주문번호: 100001,
    배송번호: 200001,
    회원ID: 'C00001',
    회원명: '정구름',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['배송완료']
  },
  {
    key: '6',
    no: 6,
    주문번호: 100001,
    배송번호: 200001,
    회원ID: 'C00001',
    회원명: '한별이',
    배송시작일: '2024-05-01',
    상품: '오이 외 1건',
    tags: ['배송완료']
  },
];

const Delivery = () => {

  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [filteredDate, setFilteredDate] = useState(data);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  //const [tableData, setTableData] = useState(data);  //  테이블 상태 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [filteredData, setFilteredData] = useState(data);  //  초기값은 원본 데이터(data)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });
  //const [sortedInfo, setSortedInfo] = useState({});
  const searchInput = useRef(null);

  // status별 개수 세기
  // 1. 빈 객체 생성하기 (태그별 개수 저장)
  const statusCounts = {};
  // 2. forEach 사용해서 orderStatusTags 배열 순회하기
  deliveryStatusTags.forEach((tag) => {
    // 옵셔널 체이닝(?.) 사용해서 item.tags가 존재하는 경우에만 includes(tag) 호출하기
    // 태그가 key, 개수가 value
    statusCounts[tag] = data.filter((item) => item.tags?.includes(tag)).length;
  });

  const filterData = (filteredDate, filters) => {
    return filteredDate.filter((item) => { // filteredDate를 사용하여 필터링
      return Object.keys(filters).every((key) => {
        const filterValues = filters[key];
        if (!filterValues) return true; // 필터가 선택되지 않은 경우 통과

        const itemValue = item[key];
        return Array.isArray(itemValue) 
          ? filterValues.some((value) => itemValue.includes(value)) // 배열인 경우: some() 사용
          : filterValues.includes(itemValue); // 배열이 아닌 경우: includes() 사용
      });
    });
  };

  const finalFilteredData = useMemo(() => {
    return filterData(filteredDate, filteredInfo);
  }, [filteredDate, filteredInfo]);

  const onDateRangeChange = (dates, dateStrings) => {
    setSelectedDateRange(dateStrings);  //  선택한 날짜 범위 저장
    
    const newFilteredDate = !dateStrings
      ? data // 날짜 범위가 지워진 경우 원본 데이터 사용
      : data.filter((item) => {
          if (dateStrings.length !== 2) {
            return true;
          }
          const startDate = moment(dateStrings[0], 'YYYY-MM-DD');
          const endDate = moment(dateStrings[1], 'YYYY-MM-DD');
          const itemDate = moment(item.배송시작일, 'YYYY-MM-DD');
          return itemDate.isBetween(startDate, endDate, null, '[]');
        });
      setFilteredDate(newFilteredDate);
  };

  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const onHandleChange = (pagination, filters) => {
    setFilteredInfo(filters);  //  필터링 정보 업데이트
    setFilteredData(filterData(filteredDate, filters));  //  필터링된 데이터 업데이트
    //setTableData(newFilteredData);  // 테이블 데이터 업데이트
    setTableParams({
      ...tableParams,
      pagination: { ...pagination },
    });
  };

  const onClearFilters = () => {  //  모든 필터 초기화 이벤트
    setFilteredInfo({});
    setFilteredData(data);  //  필터 초기화 시 원본 데이터로 설정
    setSelectedDateRange(null); // 기간 검색 필터 초기화
    //setTableData(data);
    console.log("모든 필터 초기화")
  };

  const onHandleReset = (clearFilters) => {  //  컬럼별 리셋
    clearFilters();
    setSearchText('');
    setFilteredInfo({});
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
            onClick={() => onHandleSearch}
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
      const filterValues = Array.isArray(filteredInfo[dataIndex])
    ? filteredInfo[dataIndex]
    : [filteredInfo[dataIndex]];
      // const newFilteredInfo = { 
      //   ...filteredInfo, // 기존 필터 정보 복사
      //   [dataIndex]: record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) ? value : undefined 
      // };
      onHandleChange(tableParams.pagination, {
        ...filteredInfo,
        [dataIndex]: record[dataIndex],
      }); // onHandleChange 호출

      //setFilteredInfo(newFilteredInfo);
      //setFilteredData(filterData(filteredDate, newFilteredInfo));  //  테이블 데이터 업데이트
      //setTableData(filterData(data, newFilteredInfo));  //  테이블 업데이트
    },
    filteredKeys: filteredInfo[dataIndex] || [],  //  filteredKey 초기화

    // onFilter: (value, record) =>
    //   record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    // onFilterDropdownOpenChange: (visible) => {
    //   if (visible) {
    //     setTimeout(() => searchInput.current?.select(), 100);
    //   }
    // },
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
      title: '배송번호',
      dataIndex: '배송번호',
      key: '배송번호',
      fixed: 'left',
      filteredValue: filteredInfo.배송번호 || null,
      filtered: false,
      ...getColumnSearchProps('배송번호'),
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
      title: '배송상태',
      dataIndex: 'tags',  //  밑에 데이터에서 'tags' 필드를 사용하므로
      key: 'tags',
      render: (_, {tags}) => (
        <>
          {tags.map((tag) => {  //  배송상태정보가 배송상태 필드에 저장되어 있으므로
            let color = tagColors[tag] || 'default';  //  tagColors 객체에 해당 tag의 색상이 없으면 'default' 색상 사용
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
      filters: deliveryStatusTags.map((tag) => ({ text: tag, value: tag })), // 필터 생성하기
      filteredValue: filteredInfo.tags || null,  //  컬럼의 dataIndex를 키로 사용
      //filtered: false,
      // onFilter: (value, record) => record.배송상태 === value,
      onFilter: (value, record) => record.tags.includes(value),  //  선택된 태그 값(value)이 record.tag 배열에 포함되어 있는지 확인 후 필터링하기
    },
  ];

  return (
    <div>
      <Flex gap="small" align="center" justify='space-between'>
        <Flex gap="small" wrap>
          <Space align="center">검색기간</Space>
          <RangePicker onChange={onDateRangeChange} allowClear />
        </Flex>
        <Flex gap="small" wrap>
          {deliveryStatusTags.map((tag) => (
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
          <Space align="center">배송상태변경</Space>
          <StatusChangeButton title={"배송완료"}/>
          <StatusChangeButton title={"환불신청"}/>
        </Flex>
      </Flex>
      <br />
      <Table
        columns={columns}
        rowSelection={{}}  // 체크박스
        dataSource={finalFilteredData}
        pagination={tableParams.pagination}
        onChange={onHandleChange}  // 페이지 변경 이벤트
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default Delivery;
