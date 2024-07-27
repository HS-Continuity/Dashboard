import { fetchStoreMembers, fetchMemberAddresses, fetchMemberPaymentCards } from '../../apis/apisMembers';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Flex, Space, Table, Button, message } from 'antd'
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

  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });


  // const YourComponent = ({ memberId }) => {
  //   const { data: members } = useQuery({
  //     queryKey: ["memberId", memberId], // queryKey에 memberId를 포함
  //     queryFn: () => fetchMembers(memberId), // fetchMembers 호출 시 memberId 전달
  //   });
  // }


  const fetchMembers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const customerId = 1;  //  추후에 로그인하고 수정
      const response = await fetchStoreMembers(customerId, page -1, pageSize);
      console.log('받아온 데이터: ', response)

      // setPagination({
      //   ...pagination,
      //   current: page,
      //   pageSize: pageSize,
      //   total: response.totalElements,
      // }); 
      if (response && response.content) {
        console.log('설정할 멤버 데이터: ', response.content)
        setMembers(response.content);
        setPagination({
          ...pagination,
          current: page,
          pageSize: pageSize,
          total: response.totalElements,
        });
      } else {
        console.log('회원 데이터가 없거나 형식이 올바르지 않습니다: ', response)
        message.error('회원 데이터 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      message.error('회원 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('현재 members 상태:', members);
  }, [members]);

  useEffect(() => {
    fetchMembers(pagination.current, pagination.pageSize);
  }, []);

  // useEffect(() => {
  //   fetchMembers(pagination.current, pagination.pageSize);
  // }, [pagination.current, pagination.pageSize]);


  const onHandleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    // setSortedInfo(sorter);
    fetchMembers(pagination.current, pagination.pageSize);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const handleReset = (clearFilters) => {  //  컬럼별 리셋
    clearFilters();
    setSearchText('');
  };

  /// !!!!!!!!!!!!!!!!!!!!!!!
  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.member_id)
    setSelectedRowKeys(record.member_id)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
    },
  };

  const onRow = (record) => {
    return {
      onClick: () => {
        // navigate(`../manage/${record.memberId}`, {state: record});
        if (record && record.memberId) {
          console.log('Navigating to detail page with data:', record);
          navigate(`../manage/${record.memberId}`, { state: record });
        } else {
          console.error('Invalid record:', record);
          message.error('회원 정보를 불러올 수 없습니다.');
        }
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
      key: 'index',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
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
      loading={loading}
      pagination={pagination}
      onChange={onHandleTableChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="memberId"
      locale={{
        emptyText: '데이터가 없습니다',
      }}
      />
    </div>
  );
};

export default MemberManage;
