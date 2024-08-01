import { fetchStoreMembers, fetchMemberAddresses, fetchMemberPaymentCards } from '../../apis/apisMembers';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Flex, Space, Table, Button, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useQuery } from '@tanstack/react-query';
import './MemberManageModule.css';
import styles from './Table.module.css';


const MemberManage = () => {


  //const [isServerUnstable, setIsServerUnstable] = useState(false);
    
  const [joinForm, setJoinForm] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const tableRef = useRef();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, [pagination.current, pagination.pageSize, joinForm])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: 1,
        ...joinForm,
        page: pagination.current - 1,
        size: pagination.pageSize,
        // ...joinForm
      };
      
      Object.entries(joinForm).forEach(([key, value]) => {
        if (value != null && value !== '') {
          if (value instanceof Date) {
            params[key] = value.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
          } else if (Array.isArray(value)) {
            params[key] = value.join(','); // 배열을 쉼표로 구분된 문자열로 변환
          } else {
            params[key] = value;
          }
        }
      });

      console.log('Sending params:', params);

      const response = await fetchStoreMembers(params);

      console.log('받아온 회원 데이터: ', response);

      //let isServerUnstable = false;

      const transformedMembers = response.content.map(member => {
        return {
          // orderId: order.orderId.toString() || '',
          memberId: member.memberId.toString() || '',
          memberName: member.memberName,
          memberPhoneNumber: member.memberPhoneNumber,
          memberEmail: member.memberEmail,
          memberBirthday: member.memberBirthday,
          gender: member.gender
        }
      });

      setMembers(transformedMembers);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });

    } catch (error) {
      console.error('Failed to fetch members:', error);
      message.error('회원 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onHandleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    // console.log(filteredInfo)
    // console.log(filters)
    const newJoinForm = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length > 0) {
        newJoinForm[key] = filters[key][0];
      }
      setJoinForm(newJoinForm);
    });
    // setJoinForm(newJoinForm);
  
    fetchMembers(pagination.current, pagination.pageSize);
  };
  console.log('joinForm: ', joinForm)

  const clearFilters = () => {
    setFilteredInfo({});
    setJoinForm({});
    fetchMembers();
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
        className={styles.customTable}
        columns={columns}
        rowSelection={rowSelection}
        dataSource={members}
        loading={loading}
        pagination={pagination}
        onChange={onHandleTableChange}  // 페이지 변경 이벤트
        onRow={onRow}
        rowKey="memberId"
        locale={{
          emptyText: '데이터가 없습니다',
        }}
        style={{ width: '90%', height: '500px' }} // 전체 테이블 크기 조정
        //scroll={{ x: '100%', y: 600,}}// 가로 스크롤과 세로 스크롤 설정
      />
    </div>
  );
};

export default MemberManage;
