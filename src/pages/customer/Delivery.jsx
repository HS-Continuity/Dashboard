import { useRef, useState } from 'react';
import { Flex, Space, DatePicker, Table, Tag, Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import CommonSearchBar from '../../components/Searchbar/CommonSearchBar';

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
    배송시작일: '2024-01-02',
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
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['배송준비']},
  {
    key: '4',
    no: 4,
    주문번호: 100001,
    배송번호: 200001,
    회원ID: 'C00001',
    회원명: '최바다',
    배송시작일: '2024-01-01',
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
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['배송완료']
  },
];

// const columns = [
//   {
//     title: 'NO.',
//     dataIndex: 'no',  // 해당 데이터가 어떤 필드에 있는지
//     key: 'no',
//     fixed: 'left'
//   },
//   {
//     title: '주문번호',
//     dataIndex: '주문번호',
//     key: '주문번호',
//     fixed: 'left'
//   },
//   {
//     title: '배송번호',
//     dataIndex: '배송번호',
//     key: '배송번호',
//     fixed: 'left'
//   },
//   {
//     title: '회원ID',
//     dataIndex: '회원ID',
//     key: '회원ID',
//     fixed: 'left'
//   },
//   {
//     title: '회원명',
//     dataIndex: '회원명',
//     key: '회원명',
//     fixed: 'left'
//   },
//   {
//     title: '배송시작일',
//     dataIndex: '배송시작일',
//     key: '배송시작일',
//     fixed: 'left'
//   },
//   {
//     title: '상품',
//     dataIndex: '상품',
//     key: '상품',
//     fixed: 'left'
//   },
//   {
//     title: '배송상태',
//     dataIndex: 'tags',  //  밑에 데이터에서 'tags' 필드를 사용하므로
//     key: 'tags',
//     render: (_, {tags}) => (
//       <>
//         {tags.map((tag) => {  //  배송상태정보가 배송상태 필드에 저장되어 있으므로
//           // if (!orderStatusTags.includes(tag)) {  //  배열에 tag 값 있는지 확인
//           //   return null;  // 유효하지 않은 태그는 표시 X
//           // }

//           let color = tagColors[tag] || 'default';  //  tagColors 객체에 해당 tag의 색상이 없으면 'default' 색상 사용
//           return (
//             <Tag color={color} key={tag}>
//               {tag}
//             </Tag>
//           );
//         })}
//       </>
//     ),
//   },
// ];


const Delivery = () => {

  // status별 개수 세기
  // 1. 빈 객체 생성하기 (태그별 개수 저장)
  const statusCounts = {};
  // 2. forEach 사용해서 orderStatusTags 배열 순회하기
  deliveryStatusTags.forEach((tag) => {
    // 옵셔널 체이닝(?.) 사용해서 item.tags가 존재하는 경우에만 includes(tag) 호출하기
    // 태그가 key, 개수가 value
    statusCounts[tag] = data.filter((item) => item.tags?.includes(tag)).length;
  });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const searchInput = useRef(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 50,  //  페이지당 항목 수
    },
  });

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const handleReset = (clearFilters) => {  //  컬럼별 리셋
    clearFilters();
    setSearchText('');
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
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
      filteredValue: filteredInfo.회원명 || null,
      filtered: false,
      ...getColumnSearchProps('회원명'),
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
            // if (!orderStatusTags.includes(tag)) {  //  배열에 tag 값 있는지 확인
            //   return null;  // 유효하지 않은 태그는 표시 X
            // }
  
            let color = tagColors[tag] || 'default';  //  tagColors 객체에 해당 tag의 색상이 없으면 'default' 색상 사용
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
      filteredValue: filteredInfo.배송상태 || null,
      filtered: false,
      onFilter: (value, record) => record.배송상태 === value,
    },
  ];


  return (
    <div>
      <Flex gap="small" align="center" justify='space-between'>
        <Flex gap="small" wrap>
          <Space align="center">검색기간</Space>
          <RangePicker /> {/* start - end date 검색 */}
          <Space align="center"><span></span>|<span></span></Space>
          <CommonSearchBar title={"회원번호/회원명"}/>
        </Flex>
        <Flex gap="small" wrap>
          {deliveryStatusTags.map((tag) => (
            <StatusCard key={tag} title={tag} count={statusCounts[tag]} />
          ))}
        </Flex>
      </Flex>
      <br />
      <Flex gap='small' align='flex-end' vertical>
        
        <Flex gap="small" wrap>
          <Space align="center">배송상태변경</Space>
          <StatusChangeButton title={"배송완료"}/>
          <StatusChangeButton title={"환불신청"}/>
        </Flex>
      </Flex>
      <br />
      <br />
      <Flex gap="small" justify= "flex-end">
        <Button onClick={clearFilters}>Clear Filter</Button>
        {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
      </Flex>
      <br />
      <Table
        columns={columns}
        rowSelection={{}}  // 체크박스
        dataSource={data}
        pagination={tableParams.pagination}
        onChange={handleChange}  // 페이지 변경 이벤트
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default Delivery;
