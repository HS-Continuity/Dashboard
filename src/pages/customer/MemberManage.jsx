import { fetchCustomerList } from '../../apis';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Flex, Space, Table, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useQuery } from '@tanstack/react-query';


const MemberManage = () => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const searchInput = useRef(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 50,  //  페이지당 항목 수
    },
  });

  const navigate = useNavigate();

  const { data: member, isLoading } = useQuery({
    queryKey: ["member"],
    queryFn: () => fetchCustomerList()
  });

  const handleChange = (pagination, filters, sorter) => {
    //console.log('Various parameters', pagination, filters, sorter);
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

  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.member_id)
  }

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
          // navigate('../manageDetail', { 
          //   state: { 
          //     selectedMemberId: record.회원ID,
          //     selectedMemberName: record.회원명,
          //     selectedMemberGender: record.성별,
          //     selectedMemberPhone: record.휴대전화,
          //     selectedMemberEmail: record.이메일,
          //   } 
          // }); 
          navigate(`${record.member_id}`);
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
      dataIndex: 'number',  // 해당 데이터가 어떤 필드에 있는지
      key: 'number',
      width: 100,
      fixed: 'left',
    },
    {
      title: '회원ID',
      dataIndex: 'member_id',
      key: 'member_id',
      fixed: 'left',
      filteredValue: filteredInfo.member_id || null,
      filtered: false,
      ...getColumnSearchProps('member_id'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '회원명',
      dataIndex: 'member_name',
      key: 'member_name',
      fixed: 'left',
      filteredValue: filteredInfo.member_name || null,
      filtered: false,
      ...getColumnSearchProps('member_name'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '휴대전화',
      dataIndex: 'mobile_phone',
      key: 'mobile_phone',
      fixed: 'left',
      filteredValue: filteredInfo.mobile_phone || null,
      filtered: false,
      ...getColumnSearchProps('mobile_phone'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
      fixed: 'left',
      filteredValue: filteredInfo.email || null,
      filtered: false,
      ...getColumnSearchProps('email'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '생년월일',
      dataIndex: 'birth_date',
      key: 'birth_date',
      fixed: 'left',
      filteredValue: filteredInfo.birth_date || null,
      filtered: false,
      ...getColumnSearchProps('birth_date'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '성별',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: '남', value: '남' },
        { text: '여', value: '여' },
      ],
      filteredValue: filteredInfo.gender || null,
      // onFilter: (value, record) => record.name.includes(value),
      // ellipsis: true,
      filtered: false,
      width: 100,
      onFilter: (value, record) => record.gender === value,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
  ]; 

  return(
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>회원관리</h2>
        </Flex>
      </Flex>
      <br />
      <Flex gap="small" justify= "flex-end">
        <Button onClick={clearFilters}>Clear Filter</Button>
        {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
      </Flex>
      <br />
      <Table
      columns={columns}
      rowSelection={rowSelection}
      dataSource={member}
      pagination={tableParams.pagination}
      onChange={handleChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="member_id"
      />
    </div>
  );
};

export default MemberManage;
