import { useRef, useState, useEffect } from 'react';
import { Input, Flex, Space, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import CommonSearchBar from '../../components/Searchbar/CommonSearchBar';

const data = [
  {
    key: '1',
    no: 1,
    회원ID: 100001,
    회원명: '김하늘',
    휴대전화: '010-1234-5678',
    이메일: 'qazwsxedc@gmail.com',
    생년월일: '1997-03-06',
    성별: '여',
  },
  {
    key: '2',
    no: 2,
    회원ID: 100002,
    회원명: '이태양',
    휴대전화: '010-9876-5432',
    이메일: 'bnmmnbvcxz@gmail.com',
    생년월일: '1971-06-02',
    성별: '여',
  },
  {
    key: '3',
    no: 3,
    회원ID: 100003,
    회원명: '박은별',
    휴대전화: '010-2468-1357',
    이메일: 'ghjklzxcv@naver.com',
    생년월일: '1999-12-08',
    성별: '여',
  },
  {
    key: '4',
    no: 4,
    회원ID: 100004,
    회원명: '최바다',
    휴대전화: '010-3692-5814',
    이메일: 'mnbvcxz@naver.com',
    생년월일: '1988-02-23',
    성별: '여',
  },
  {
    key: '5',
    no: 5,
    회원ID: 100005,
    회원명: '정구름',
    휴대전화: '010-5555-1212',
    이메일: 'uiopasdf@naver.com',
    생년월일: '1989-06-23',
    성별: '여',
  },
  {
    key: '6',
    no: 6,
    회원ID: 100006,
    회원명: '한별이',
    휴대전화: '010-7418-5296',
    이메일: 'lkjhgfdsa@naver.com',
    생년월일: '1970-11-11',
    성별: '여',
  },
  {
    key: '7',
    no: 7,
    회원ID: 100007,
    회원명: '강산들',
    휴대전화: '010-8979-4561',
    이메일: 'poiuytrewq@naver.com',
    생년월일: '1994-03-06',
    성별: '남',
  },
  {
    key: '8',
    no: 8,
    회원ID: 100008,
    회원명: '윤햇살',
    휴대전화: '010-1123-5813',
    이메일: 'zxcvbnm@naver.com',
    생년월일: '1994-06-27',
    성별: '남',
  },
  {
    key: '9',
    no: 9,
    회원ID: 100009,
    회원명: '서강물',
    휴대전화: '010-9638-5214',
    이메일: 'asdfghjkl@naver.com',
    생년월일: '1997-10-01',
    성별: '여',
  },
  {
    key: '10',
    no: 10,
    회원ID: 100010,
    회원명: '문지혜',
    휴대전화: '010-4567-8912',
    이메일: 'qwertyuiop@gmail.com',
    생년월일: '1983-02-10',
    성별: '남',
  },
];


const MemberManage = () => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

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
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
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
      width: 100,
      fixed: 'left',
    },
    {
      title: '회원ID',
      dataIndex: '회원ID',
      key: '회원ID',
      fixed: 'left',
      ...getColumnSearchProps('회원ID'),
    },
    {
      title: '회원명',
      dataIndex: '회원명',
      key: '회원명',
      fixed: 'left',
      ...getColumnSearchProps('회원명'),
    },
    {
      title: '휴대전화',
      dataIndex: '휴대전화',
      key: '휴대전화',
      fixed: 'left',
      ...getColumnSearchProps('휴대전화'),
    },
    {
      title: '이메일',
      dataIndex: '이메일',
      key: '이메일',
      fixed: 'left',
      ...getColumnSearchProps('이메일'),
    },
    {
      title: '생년월일',
      dataIndex: '생년월일',
      key: '생년월일',
      fixed: 'left',
      ...getColumnSearchProps('생년월일'),
    },
    {
      title: '성별',
      dataIndex: '성별',
      key: '성별',
      filters: [
        {
          text: '남',
          value: '남자',
        },
        {
          text: '여',
          value: '여자',
        },
      ],
      width: 100,
    },
  ];

  return(
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>회원관리</h2>
        </Flex>
        <Flex gap="small" wrap>
          <CommonSearchBar title={"회원번호/회원명"}/>
        </Flex>
      </Flex>
      <br />
      <br />
      <Table
      columns={columns}
      // rowKey={(record) => record.login.uuid}
      dataSource={data}
      // pagination={tableParams.pagination}
      // loading={loading}
      // onChange={handleTableChange}
      pagination={{
        pageSize: 50,
      }}
      scroll={{
        y: 500,
      }}
    />
    </div>
  )
};

export default MemberManage;
