import { fetchProductItems } from '../../apis'; // fetchProductItems 함수를 가져오기
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, Space, Table, Tag, Button, Input, message } from 'antd'
import Highlighter from 'react-highlight-words';

const Inventory = () => {
  const navigate = useNavigate();
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickedTime, setLastClickedTime] = useState(null);
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [products, setProducts] = useState([]);
  
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,  // 현재 페이지 번호
      pageSize: 20,  //  페이지당 항목 수
    },
  });


  const { data: product, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () => fetchProductItems()
  });

  const uniqueProducts = useMemo(() => {
    if (isLoading || !product) return []; // 데이터 로딩 중이거나 product가 없으면 빈 배열 반환
  
    const productCountMap = product.reduce((acc, product) => {
      acc[product.productName] = (acc[product.productName] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(productCountMap).map(([productName, count], index) => ({
      index: index + 1,
      productName,
      count,
    }));
  }, [product, isLoading]); // product와 isLoading 값이 변경될 때만 uniqueProducts 재계산
  
  console.log("product:", product);
  console.log("unique:", uniqueProducts);


  
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

  // const onClickCreate = () => {
  //   navigate('../create');
  // }

  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.productName)
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
          navigate(`${record.productName}`);
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

  const columns = [
    { title: 'Index', dataIndex: 'index', key: 'index' },
    { title: '상품명', dataIndex: 'productName', key: 'productName' },
    { title: '개수', dataIndex: 'count', key: 'count' },
  ];

  return (
    <Table 
      dataSource={uniqueProducts} 
      columns={columns}
      // pagination={tableParams.pagination}
      onChange={onHandleChange}  // 페이지 변경 이벤트
      // scroll={{ y: 600,}}
      onRow={onRow}
      rowKey="productName"
       />
  )
};

export default Inventory;
