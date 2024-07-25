import { fetchMembers } from '../../apis/apisMembers';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Flex, Space, Table, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useQuery } from '@tanstack/react-query';
import './MemberManageModule.css';


const MemberManage = () => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const searchInput = useRef(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 50,  //  페이지당 항목 수
    },
  });

  const navigate = useNavigate();

  // const { data: members, isLoading, error } = useQuery({
  //   queryKey: ["memberId", memberId],
  //   queryFn: () => fetchMembers(memberId)
  // });

  const YourComponent = ({ memberId }) => {
    const { data: members } = useQuery({
      queryKey: ["memberId", memberId], // queryKey에 memberId를 포함
      queryFn: () => fetchMembers(memberId), // fetchMembers 호출 시 memberId 전달
    });
  }

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
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
      onClick: () => {
        navigate(`../manage/${record.memberId}`);
        setLastClickedRow(rowIndex);
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
      // dataIndex: 'number',  // 해당 데이터가 어떤 필드에 있는지
      key: 'number',
      render: (text, record, index) => index + 1,
      width: 100,
      fixed: 'left',
    },
    {
      title: '회원ID',
      dataIndex: 'memberId',
      key: 'memberId',
      fixed: 'left',
      filteredValue: filteredInfo.memberId || null,
      filtered: false,
      ...getColumnSearchProps('memberId'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '회원명',
      dataIndex: 'memberName',
      key: 'memberName',
      fixed: 'left',
      filteredValue: filteredInfo.memberName || null,
      filtered: false,
      ...getColumnSearchProps('memberName'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '휴대전화',
      dataIndex: 'memberPhoneNumber',
      key: 'memberPhoneNumber',
      fixed: 'left',
      filteredValue: filteredInfo.memberPhoneNumber || null,
      filtered: false,
      ...getColumnSearchProps('memberPhoneNumber'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '이메일',
      dataIndex: 'memberEmail',
      key: 'memberEmail',
      fixed: 'left',
      filteredValue: filteredInfo.memberEmail || null,
      filtered: false,
      ...getColumnSearchProps('memberEmail'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '생년월일',
      dataIndex: 'memberBirthday',
      key: 'memberBirthday',
      fixed: 'left',
      filteredValue: filteredInfo.memberBirthday || null,
      filtered: false,
      ...getColumnSearchProps('memberBirthday'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    {
      title: '성별',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: '남', value: 'MALE' },
        { text: '여', value: 'FEMALE' },
      ],
      filteredValue: filteredInfo.gender || null,
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
      </Flex>
      <br />
      <Table
      columns={columns}
      rowSelection={rowSelection}
      dataSource={members}
      pagination={tableParams.pagination}
      onChange={handleChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="memberId"
      />
    </div>
  );
};

export default MemberManage;
