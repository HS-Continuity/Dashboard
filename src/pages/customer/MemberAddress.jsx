import { useRef, useState } from "react";
import { Input, Flex, Space, Table, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const data = [
  {
    key: "1",
    no: 1,
    회원주소ID: "ADD105992",
    회원ID: "C100001",
    회원명: "김하늘",
    주소: "서울특별시 강남구 역삼동",
    기본배송지여부: "O",
  },
  {
    key: "2",
    no: 2,
    회원주소ID: "ADD109176",
    회원ID: "C100002",
    회원명: "이태양",
    주소: "경기도 성남시 분당구 정자동",
    기본배송지여부: "O",
  },
  {
    key: "3",
    no: 3,
    회원주소ID: "ADD108854",
    회원ID: "C100003",
    회원명: "박은별",
    주소: "부산광역시 해운대구 우동",
    기본배송지여부: "X",
  },
  {
    key: "4",
    no: 4,
    회원주소ID: "ADD108463",
    회원ID: "C100004",
    회원명: "최바다",
    주소: "인천광역시 연수구 송도동",
    기본배송지여부: "X",
  },
  {
    key: "5",
    no: 5,
    회원주소ID: "ADD106987",
    회원ID: "C100005",
    회원명: "정구름",
    주소: "대구광역시 수성구 범어동",
    기본배송지여부: "O",
  },
  {
    key: "6",
    no: 6,
    회원주소ID: "ADD102700",
    회원ID: "C100006",
    회원명: "한별이",
    주소: "광주광역시 서구 화정동",
    기본배송지여부: "O",
  },
  {
    key: "7",
    no: 7,
    회원주소ID: "ADD102237",
    회원ID: "C100007",
    회원명: "강산들",
    주소: "울산광역시 남구 삼산동",
    기본배송지여부: "O",
  },
  {
    key: "8",
    no: 8,
    회원주소ID: "ADD100007",
    회원ID: "C100008",
    회원명: "윤햇살",
    주소: "울산광역시 남구 삼산동",
    기본배송지여부: "X",
  },
  {
    key: "9",
    no: 9,
    회원주소ID: "ADD103724",
    회원ID: "C100009",
    회원명: "서강물",
    주소: "세종특별자치시 한솔동",
    기본배송지여부: "X",
  },
  {
    key: "10",
    no: 10,
    회원주소ID: "ADD107357",
    회원ID: "C100010",
    회원명: "문지혜",
    주소: "경상남도 창원시 성산구 상남동",
    기본배송지여부: "O",
  },
];

const MemberAddress = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const searchInput = useRef(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1, // 현재 페이지 번호
      pageSize: 50, //  페이지당 항목 수
    },
  });

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
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

  const handleReset = clearFilters => {
    //  컬럼별 리셋
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`검색할 내용을 입력해 주세요`}
          value={selectedKeys[0] || ""} // 빈 문자열도 처리
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()} //  Enter 입력 시 필터링 적용
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90,
            }}>
            검색
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{
              width: 90,
            }}>
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
            type='link'
            size='small'
            onClick={() => {
              close();
            }}>
            닫기
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "NO.",
      dataIndex: "no", // 해당 데이터가 어떤 필드에 있는지
      key: "no",
      width: 100,
      fixed: "left",
    },
    {
      title: "회원주소ID",
      dataIndex: "회원주소ID",
      key: "회원주소ID",
      width: 200,
      fixed: "left",
      filteredValue: filteredInfo.회원주소ID || null,
      filtered: false,
      ...getColumnSearchProps("회원주소ID"),
    },
    {
      title: "회원ID",
      dataIndex: "회원ID",
      key: "회원ID",
      width: 200,
      fixed: "left",
      filteredValue: filteredInfo.회원ID || null,
      filtered: false,
      ...getColumnSearchProps("회원ID"),
    },
    {
      title: "회원명",
      dataIndex: "회원명",
      key: "회원명",
      width: 200,
      fixed: "left",
      filteredValue: filteredInfo.회원명 || null,
      filtered: false,
      ...getColumnSearchProps("회원명"),
    },
    {
      title: "주소",
      dataIndex: "주소",
      key: "주소",
      width: 350,
      fixed: "left",
      filteredValue: filteredInfo.주소 || null,
      filtered: false,
      ...getColumnSearchProps("주소"),
    },
    {
      title: "기본배송지여부",
      dataIndex: "기본배송지여부",
      key: "기본배송지여부",
      filters: [
        { text: "O", value: "O" },
        { text: "X", value: "X" },
      ],
      filteredValue: filteredInfo.기본배송지여부 || null,
      // onFilter: (value, record) => record.name.includes(value),
      // ellipsis: true,
      filtered: false,
      width: 150,
      onFilter: (value, record) => record.기본배송지여부 === value,
    },
  ];

  return (
    <div>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap='small' wrap>
          <h2>회원주소지관리</h2>
        </Flex>
      </Flex>
      <br />
      <Flex gap='small' justify='flex-end'>
        <Button onClick={clearFilters}>Clear Filter</Button>
        {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
      </Flex>
      <br />
      <Table
        columns={columns}
        dataSource={data}
        pagination={tableParams.pagination}
        onChange={handleChange} // 페이지 변경 이벤트
        scroll={{ y: 600 }}
      />
    </div>
  );
};

export default MemberAddress;
