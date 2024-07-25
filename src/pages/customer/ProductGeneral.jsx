// import { fetchProductItems } from '../../apis'; // fetchProductItems 함수를 가져오기
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, Table, Tag, Button, Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import RegisterButton from '../../components/Buttons/RegisterButton';
import ApplyButton from '../../components/Buttons/ApplyButton';
import TimeAttackApplyModal from '../../components/Modals/TimeAttackApplyModal';


const ProductGeneral = () => {

  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });

  const [state, setState] = useState({
    isModalOpen: false,
    selectedRowKeys: [],
    filteredInfo: {},
    tableParams: {
      pagination: {
        current: 1,
        pageSize: 20,
      },
    },
  });

  const { isModalOpen } = state;

  // ----------------------------------------------------------------------------------


  const { data: product, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () => fetchProductItems()
  });

  console.log(product)

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

  const setIsModalOpen = useCallback((isOpen) => {
    setState(prevState => ({ ...prevState, isModalOpen: isOpen }));
  }, []); // 빈 배열을 전달하여 useCallback이 한 번만 실행되도록 함

  const onShowModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('타임어택을 신청할 상품을 선택하세요.');
      return;
    }
    console.log('key값:',selectedRowKeys)
    setIsModalOpen(true);
  };


  // const onHandleExit = () => {
  //   setIsModalOpen(false); // 모달 상태 변경
  // };

  const onClickCreate = () => {
    navigate('../create');
  }

  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.productId)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
      console.log('key값업데이트', selectedRowKeys)
    },
    onClick: (e) => {
      console.log(e);
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
          //navigate(`${record.productId}`);
          // console.log(e)

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
      dataIndex: 'productId', 
      key: 'productId',
      filteredValue: filteredInfo.productId || null,
      filtered: false,
      ...getColumnSearchProps('productId'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '고객ID', 
      dataIndex: 'customerId', 
      key: 'customerId',
      filteredValue: filteredInfo.customerId || null,
      filtered: false,
      ...getColumnSearchProps('customerId'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '식품상세카테고리ID', 
      dataIndex: 'productDetailCategoryId', 
      key: 'productDetailCategoryId',
      filteredValue: filteredInfo.productDetailCategoryId || null,
      filtered: false,
      ...getColumnSearchProps('productDetailCategoryId') ,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '식품명', 
      dataIndex: 'productName', 
      key: 'productName',
      filteredValue: filteredInfo.productName || null,
      filtered: false,
      ...getColumnSearchProps('productName') ,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '판매타입코드', 
      dataIndex: 'saleTypeCode', 
      key: 'saleTypeCode',
      filteredValue: filteredInfo.saleTypeCode || null,
      filtered: false,
      ...getColumnSearchProps('saleTypeCode'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
    { 
      title: '식품가격', 
      dataIndex: 'productPrice', 
      key: 'productPrice', 
      render: (price) => price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }),
      filteredValue: filteredInfo.productPrice || null,
      filtered: false,
      ...getColumnSearchProps('productPrice'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      }) 
    },
    { 
      title: '기본할인율', 
      dataIndex: 'defaultDiscountPrice', 
      key: 'defaultDiscountPrice', 
      render: (defaultDiscountPrice) => `${defaultDiscountPrice}%`,
      filteredValue: filteredInfo.defaultDiscountPrice || null,
      filtered: false,
      ...getColumnSearchProps('defaultDiscountPrice'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      }) 
    },
    { 
      title: '정기배송할인율', 
      dataIndex: 'regularDeliveryDiscountPrice', 
      key: 'regularDeliveryDiscountPrice', 
      render: (regularDeliveryDiscountPrice) => `${regularDeliveryDiscountPrice}%`,
      filteredValue: filteredInfo.regularDeliveryDiscountPrice || null,
      filtered: false,
      ...getColumnSearchProps('regularDeliveryDiscountPrice'),
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      }) 
    },
    { 
      title: '페이지노출여부', 
      dataIndex: 'pageExposureStatus', 
      key: 'pageExposureStatus', 
      //render: (visible) => (visible === 'O' ? '노출' : '미노출'), 
      filters: [
        { text: '노출', value: 'O' },
        { text: '미노출', value: 'X' },
      ],
      filteredValue: filteredInfo.pageExposureStatus || null,
      filtered: false,
      width: 100,
      onFilter: (value, record) => record.pageExposureStatus === value,
      onCell: (record) => ({
        onClick: () => handleCellClick(record),
      })
    },
  ];
  // --------------------------------------------------------------------------

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>일반식품관리</h2>
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
              selectedProductIds={selectedRowKeys}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          <ApplyButton 
            title={"친환경"}
            onClick={onClickCreate}
          />
        </Flex>
        
      </Flex>
      
    <Table
      columns={columns}
      rowSelection={rowSelection}
      dataSource={product}
      pagination={tableParams.pagination}
      onChange={onHandleChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="productId"
      />
    </div>
  )
};

export default ProductGeneral;
