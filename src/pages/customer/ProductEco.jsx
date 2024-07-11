
import { fetchProductItems } from '../../apis'; // fetchProductItems 함수를 가져오기
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, DatePicker, Table, Tag, Button, Input, message } from 'antd'
import { SearchOutlined, HourglassOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import RegisterButton from '../../components/Buttons/RegisterButton';
import ApplyButton from '../../components/Buttons/ApplyButton';
import TimeAttackApplyModal from '../../components/Modals/TimeAttackApplyModal';


const ProductEco = () => {

  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]); // 상품 데이터를 저장할 상태 변수
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });

  // ----------------------------------------------------------------------------------

  useEffect(() => {
    fetchProductItems()
      .then(data => {
        const filteredProducts = data.filter(product => product.판매타입코드 === 2)
                                            .map(product => ({  //  필요한 데이터만 가져오기
                                              식품ID: product.식품ID,
                                              고객ID: product.고객ID,
                                              식품상세카테고리ID: product.식품상세카테고리ID,
                                              식품명: product.식품명,
                                              판매타입코드: product.판매타입코드,
                                              식품가격: product.식품가격,
                                              기본할인율: product.기본할인율,
                                              정기배송할인율: product.정기배송할인율,
                                              페이지노출여부: product.페이지노출여부상태값,
                                            }));
        setProducts(filteredProducts); 
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // ----------------------------------------------------------------------------------


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

  const onShowModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('타임어택을 신청할 상품을 선택하세요.');
      return;
    }
    setIsModalOpen(true);
  };

  // const onHandleSubmit = () => {
  //   setIsModalOpen(false);
  // };

  const onHandleExit = () => {
    setIsModalOpen(false);
  };

  const onClickCreate = () => {
    navigate('../create');
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
          navigate('../generalDetail'); 
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
      const recordValue = record[dataIndex];
      return recordValue !== undefined && recordValue.toString().toLowerCase().includes(value.toLowerCase());
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

  // -------------------------------------------------------------------------
  const columns = [
    { 
      title: '식품ID', 
      dataIndex: '식품ID', 
      key: '식품ID',
      filteredValue: filteredInfo.식품ID || null,
      filtered: false,
      ...getColumnSearchProps('식품ID')
    },
    { 
      title: '고객ID', 
      dataIndex: '고객ID', 
      key: '고객ID',
      filteredValue: filteredInfo.고객ID || null,
      filtered: false,
      ...getColumnSearchProps('고객ID')
    },
    { 
      title: '식품상세카테고리ID', 
      dataIndex: '식품상세카테고리ID', 
      key: '식품상세카테고리ID',
      filteredValue: filteredInfo.식품상세카테고리ID || null,
      filtered: false,
      ...getColumnSearchProps('식품상세카테고리ID') 
    },
    { 
      title: '식품명', 
      dataIndex: '식품명', 
      key: '식품명',
      filteredValue: filteredInfo.식품명 || null,
      filtered: false,
      ...getColumnSearchProps('식품명') 
    },
    { 
      title: '판매타입코드', 
      dataIndex: '판매타입코드', 
      key: '판매타입코드',
      filteredValue: filteredInfo.판매타입코드 || null,
      filtered: false,
      ...getColumnSearchProps('판매타입코드')  
    },
    { 
      title: '식품가격', 
      dataIndex: '식품가격', 
      key: '식품가격', 
      render: (price) => price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }),
      filteredValue: filteredInfo.식품가격 || null,
      filtered: false,
      ...getColumnSearchProps('식품가격') 
    },
    { 
      title: '기본할인율', 
      dataIndex: '기본할인율', 
      key: '기본할인율', 
      render: (discountRate) => `${discountRate}%`,
      filteredValue: filteredInfo.기본할인율 || null,
      filtered: false,
      ...getColumnSearchProps('기본할인율') 
    },
    { 
      title: '정기배송할인율', 
      dataIndex: '정기배송할인율', 
      key: '정기배송할인율', 
      render: (discountRate) => `${discountRate}%`,
      filteredValue: filteredInfo.정기배송할인율 || null,
      filtered: false,
      ...getColumnSearchProps('정기배송할인율') 
    },
    { 
      title: '페이지노출여부', 
      dataIndex: '페이지노출여부상태값', 
      key: '페이지노출여부상태값', 
      //render: (visible) => (visible === 'O' ? '노출' : '미노출'), 
      filters: [
        { text: '노출', value: 'O' },
        { text: '미노출', value: 'X' },
      ],
      filteredValue: filteredInfo.페이지노출여부상태값 || null,
      filtered: false,
      width: 100,
      onFilter: (value, record) => record.페이지노출여부상태값 === value
    },
  ];
  // --------------------------------------------------------------------------

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>친환경식품관리</h2>
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
            onClick={onClickCreate}
          />
          <ApplyButton title={"타임어택"} onClick={onShowModal} />
          {isModalOpen && (
            <TimeAttackApplyModal
              isModalOpen={isModalOpen}
              handleOk={() => setIsModalOpen(true)}  //  모달 닫기
              handleCancel={onHandleExit}
              selectedProductIds={selectedRowKeys}
            />
          )}

          <ApplyButton 
            title={"친환경"}
            onClick={onClickCreate}
          />
        </Flex>
        
      </Flex>
      {products.length > 0 ? (
      <Table
      columns={columns}
      rowSelection={rowSelection}
      dataSource={products}
      pagination={tableParams.pagination}
      onChange={onHandleChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="식품ID"
      />
    ) : (
      <p>Loading...</p>
    )}
    </div>
  )
};

export default ProductEco;
