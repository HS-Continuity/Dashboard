import { fetchEcoProductItems, registerTimesale } from '../../apis/apisProducts';
import { useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, Table, Tag, Button, Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Swal from 'sweetalert2';
import moment from 'moment';
import RegisterButton from '../../components/Buttons/RegisterButton';
import ApplyButton from '../../components/Buttons/ApplyButton';
import TimeAttackApplyModal from '../../components/Modals/TimeAttackApplyModal';


const ProductEco = () => {

  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [joinForm, setJoinForm] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //const [statusCount, setStatusCount] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const searchInput = useRef(null);
  const tableRef = useRef();
  const navigate = useNavigate();

  // const [lastClickedRow, setLastClickedRow] = useState(null);
  // const [lastClickedTime, setLastClickedTime] = useState(null);
  // const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  // const [searchedColumn, setSearchedColumn] = useState('');
  //const [isModalOpen, setIsModalOpen] = useState(false);
  // const [tableParams, setTableParams] = useState({
  //   pagination: {
  //     current: 1,  // 현재 페이지 번호
  //     pageSize: 20,  //  페이지당 항목 수
  //   },
  // });

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

  //const { isModalOpen } = state;

  // ----------------------------------------------------------------------------------

  useEffect(() => {
    fetchProducts();
    
  }, [])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  const fetchProducts = async (page = pagination.current, pageSize = pagination.pageSize, form = joinForm) => {
    setLoading(true);
    try {
      const params = {
        startPage: page - 1,
        pageSize: pageSize,
        ...form
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
      console.log('Fetching with params:', params);

      const response = await fetchEcoProductItems(params);
      

      const transformedProducts = response.content.map(product => {
        
        //console.log('product: ', product)

        return {
          baseDiscountRate: product.baseDiscountRate,
          description: product.description,
          detailCategoryName: product.detailCategoryName,
          isEcoFriendly: product.isEcoFriendly,
          isPageVisibility: product.isPageVisibility,
          isRegularSale: product.isRegularSale,
          origin: product.origin,
          price: product.price,
          productId: product.productId,
          productName: product.productName,
          regularDiscountRate: product.regularDiscountRate
        }
      });

      //console.log('어떤 데이터를 받아오나요?d: ', response)
      console.log('어떤 데이터를 받아오나요?d: ', transformedProducts);

      setProducts(transformedProducts);
      console.log('찐막 데이터: ',products)
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: response.totalElements,
      }));

    } catch (error) {
      message.error('식품 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(true);
    }
  };

  // ----------------------------------------------------------------------------------


  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setJoinForm(prev => ({
      ...prev,
      [dataIndex]: selectedKeys[0] ? [selectedKeys[0]] : null
    }));
  };

  const onHandleReset = () => {  //  컬럼별 리셋
    setJoinForm({});
    setFilteredInfo({});
    setDateRange([]);
    if (tableRef.current) {
      tableRef.current.clearFilters();
    }
    fetchProducts();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
          style={{ 
            marginBottom: 8, 
            display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => onHandleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => {
              close();
            }}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    // onFilter: (value, record) =>
    //   record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilter: (value, record) => {
      if (record[dataIndex] == null) return false;
      
      const itemValue = record[dataIndex];
      const filterValue = value;
    
      // 날짜 처리
      if (itemValue instanceof Date) {
        const dateValue = itemValue.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        return dateValue.includes(filterValue);
      }
    
      // 그 외의 경우
      const stringItemValue = String(itemValue).toLowerCase();
      const stringFilterValue = String(filterValue).toLowerCase();
    
      return stringItemValue.includes(stringFilterValue);
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onHandleTableChange = (newPagination, filters) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
  
    // 모든 필터를 joinForm에 추가
    const newJoinForm = { ...joinForm };
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        newJoinForm[key] = filters[key][0]; // 첫 번째 필터 값만 사용
      } else {
        delete newJoinForm[key]; // 필터가 제거된 경우
      }
    });
  
    setJoinForm(newJoinForm);
    if (newPagination.current !== pagination.current || newPagination.pageSize !== pagination.pageSize) {
      fetchProducts(newPagination.current, newPagination.pageSize, newJoinForm);
    }
  };

  const onRow = (record) => {
    return {
      onClick: () => {
        navigate(`/product/eco/${record.productId}`)
      }
    };
  };

  const onHandleTimesaleApply = async () => {
    if (selectedRowKeys.length !== 1) {
      message.warning('타임세일을 신청할 상품을 하나만 선택해주세요.');
      return;
    }

    const selectedProductId = selectedRowKeys[0];
    const now = moment();

    const { value: formValues } = await Swal.fire({
      title: '타임세일 신청',
      html:
      '<div style="text-align: left; margin-bottom: 20px;">' +
      '<label for="swal-input1" style="display: inline-block; width: 150px; font-weight: bold;">상품 아이디</label>' +
      `<input id="swal-input1" class="swal2-input" value="${selectedProductId}" readonly style="width: 230px;">` +
      '</div>' +
      '<div style="text-align: left; margin-bottom: 5px;">' +
      '<label for="swal-input2" style="display: inline-block; width: 150px; font-weight: bold;">타임세일 시작</label>' +
      `<input id="swal-input2" class="swal2-input" type="datetime-local" min="${now.format('YYYY-MM-DDTHH:mm')}" style="width: 300px;" placeholder="날짜와 시간을 선택하세요">` +
      '</div>' +
      '<div id="swal-input2-error" style="color: red; margin-left: 150px; margin-bottom: 15px;"></div>' +
      '<div style="text-align: left; margin-bottom: 20px;">' +
      '<label for="swal-input3" style="display: inline-block; width: 150px; font-weight: bold;">타임세일 종료</label>' +
      '<input id="swal-input3" class="swal2-input" type="datetime-local" readonly style="width: 300px;">' +
      '</div>' +
      '<div style="text-align: left; margin-bottom: 5px;">' +
      '<label for="swal-input4" style="display: inline-block; width: 150px; font-weight: bold;">타임세일 할인율</label>' +
      '<div style="display: inline-block; position: relative; width: 230px;">' +
      '<input id="swal-input4" class="swal2-input" type="number" min="0" max="100" style="width: 100%;">' +
      '<span style="position: absolute; right: 10px; top: 60%; transform: translateY(-50%); font-weight: bold;">%</span>' +
      '</div>' +
      '</div>' +
      '<div id="swal-input4-error" style="color: red; margin-left: 150px;"></div>',
      focusConfirm: false,
      //showCancelButton: true,
      confirmButtonText: '신청하기',
      //cancelButtonText: '취소',
      showCloseButton: true,
      width: '700px',
      padding: '20px',
      preConfirm: () => {
        const startTime = document.getElementById('swal-input2').value;
        const discountRate = document.getElementById('swal-input4').value;
        let isValid = true;
  
        // 타임세일 시작 시간 검증
        if (!startTime) {
          document.getElementById('swal-input2-error').textContent = '타임세일 시작 시간을 선택해주세요.';
          isValid = false;
        } else {
          document.getElementById('swal-input2-error').textContent = '';
        }
  
        // 할인율 검증
        if (!discountRate) {
          document.getElementById('swal-input4-error').textContent = '할인율을 입력해주세요.';
          isValid = false;
        } else {
          document.getElementById('swal-input4-error').textContent = '';
        }
  
        if (!isValid) {
          return false;  // 폼 제출 방지
        }
  
        const endTime = moment(startTime).add(3, 'hours').format('YYYY-MM-DDTHH:mm');
        document.getElementById('swal-input3').value = endTime;
        return [
          document.getElementById('swal-input1').value,
          startTime,
          endTime,
          discountRate
        ]
      },
      didOpen: () => {
        const startInput = document.getElementById('swal-input2');
        startInput.addEventListener('change', (e) => {
          const endInput = document.getElementById('swal-input3');
          const endTime = moment(e.target.value).add(3, 'hours').format('YYYY-MM-DDTHH:mm');
          endInput.value = endTime;
        });
      }
    })
    
    if (formValues) {
      const [productId, startTime, endTime, discountRate] = formValues;
  
      try {
        const timesaleData = {
          productId: parseInt(productId), 
          startTime: moment(startTime).toISOString(),
          endTime: moment(endTime).toISOString(),
          discountRate: parseInt(discountRate)
        };
  
        await registerTimesale(timesaleData);
        message.success('타임세일 신청이 완료되었습니다');
      } catch (error) {
        console.error('Error: ', error);
        message.error('타임세일 신청에 실패했습니다.');
      }
    }
  };

  // const selectedProducts = products.filter(product => selectedRowKeys.includes(product.orderId))

  // const setIsModalOpen = useCallback((isOpen) => {
  //   setState(prevState => ({ ...prevState, isModalOpen: isOpen }));
  // }, []); // 빈 배열을 전달하여 useCallback이 한 번만 실행되도록 함

  // const onShowModal = () => {
  //   if (selectedRowKeys.length === 0) {
  //     message.warning('타임어택을 신청할 상품을 선택하세요.');
  //     return;
  //   }
  //   console.log('key값:',selectedRowKeys)
  //   setIsModalOpen(true);
  // };


  // const onHandleExit = () => {
  //   setIsModalOpen(false); // 모달 상태 변경
  // };

  const onClickCreate = () => {
    navigate('../create');
  }

  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.productId)
  }

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys) => {
  //     setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
  //     console.log('key값업데이트', selectedRowKeys)
  //   },
  //   onClick: (e) => {
  //     console.log(e);
  //   },
  // };

  // const onRow = (record, rowIndex) => {
  //   return {
  //     onClick: (e) => {
  //       const currentTime = new Date().getTime();
  //       if (
  //         lastClickedRow === rowIndex &&
  //         currentTime - lastClickedTime < 300 // 300ms 이내에 두 번 클릭하면 더블 클릭으로 간주
  //       ) {
  //         //navigate(`${record.productId}`);
  //         // console.log(e)

  //       }
  //       setLastClickedRow(rowIndex);
  //       setLastClickedTime(currentTime);
  //     },
  //   };
  // };


  // -------------------------------------------------------------------------
  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,  //  페이지가 넘어가도 순번 규칙이 이어서 적용됨
      width: '5%',
      fixed: 'left',
      //width: '5%',
      //fixed: 'left'  // 테이블의 왼쪽에 고정
    },
    { 
      title: '식품ID', 
      dataIndex: 'productId', 
      key: 'productId',
      filteredValue: joinForm.productId ? [joinForm.productId] : null,
      ...getColumnSearchProps('productId'),
    },
    { 
      title: '식품상세카테고리', 
      dataIndex: 'detailCategoryName', 
      key: 'detailCategoryName',
      filteredValue: joinForm.detailCategoryName ? [joinForm.detailCategoryName] : null,
      ...getColumnSearchProps('detailCategoryName'),
    },
    { 
      title: '식품명', 
      dataIndex: 'productName', 
      key: 'productName',
      filteredValue: joinForm.productName ? [joinForm.productName] : null,
      ...getColumnSearchProps('productName'),
    },
    { 
      title: '식품가격', 
      dataIndex: 'price', 
      key: 'price', 
      render: (price) => price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '₩ '),
      filteredValue: joinForm.price ? [joinForm.price] : null,
      ...getColumnSearchProps('price'),
    },
    { 
      title: '기본할인율', 
      dataIndex: 'baseDiscountRate', 
      key: 'baseDiscountRate', 
      render: (baseDiscountRate) => `${baseDiscountRate}%`,
      filteredValue: joinForm.baseDiscountRate ? [joinForm.baseDiscountRate] : null,
      ...getColumnSearchProps('baseDiscountRate'),
    },
    { 
      title: '정기배송가능여부', 
      dataIndex: 'isRegularSale', 
      key: 'isRegularSale', 
      //render: (visible) => (visible === 'O' ? '노출' : '미노출'), 
      filters: [
        { text: 'O', value: 'ACTIVE' },
        { text: 'X', value: 'INACTIVE' },
      ],
      filteredValue: joinForm.isRegularSale ? [joinForm.isRegularSale] : null,
      onFilter: (value, record) => record.isRegularSale === value,
      render: (status) => (
        <Tag color={getTagColor(status)}>
          {getTagText(status)}
        </Tag>
      ),
    },
    { 
      title: '정기배송할인율', 
      dataIndex: 'regularDiscountRate', 
      key: 'regularDiscountRate', 
      render: (regularDiscountRate) => `${regularDiscountRate}%`,
      filteredValue: joinForm.regularDiscountRate ? [joinForm.regularDiscountRate] : null,
      ...getColumnSearchProps('regularDiscountRate'),
    },
    { 
      title: '페이지노출여부', 
      dataIndex: 'isPageVisibility', 
      key: 'isPageVisibility', 
      //render: (visible) => (visible === 'O' ? '노출' : '미노출'), 
      filters: [
        { text: 'O', value: 'ACTIVE' },
        { text: 'X', value: 'INACTIVE' },
      ],
      filteredValue: joinForm.isPageVisibility ? [joinForm.isPageVisibility] : null,
      onFilter: (value, record) => record.isPageVisibility === value,
      render: (status) => (
        <Tag color={getTagColor(status)}>
          {getTagText(status)}
        </Tag>
      ),
    },
  ];

  const getTagColor = (status) => {
    const colors = {
      ACTIVE: 'cyan',
      INACTIVE: 'gray'
    };
    return colors[status] || 'default';
  };

  const getTagText = (status) => {
    const texts = {
      ACTIVE: 'O',
      INACTIVE: 'X'
    };
    return texts[status] || status;
  }
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
          <Button onClick={onHandleReset}>Clear Filter</Button>
          {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
        </Flex>
        <Flex gap="small" wrap>
          <RegisterButton 
            title={"친환경 식품"}
            onClick={onClickCreate}
          />
          <ApplyButton 
            title={"타임세일"}
            onClick={onHandleTimesaleApply}/>
          {/* <ApplyButton title={"타임어택"} onClick={onShowModal} /> */}
          {/* {isModalOpen && (
            <TimeAttackApplyModal
              isModalOpen={isModalOpen}
              selectedProductIds={selectedRowKeys}
              onClose={() => setIsModalOpen(false)}
            />
          )} */}
        </Flex>
        
      </Flex>
      <br/>
    <Table
      columns={columns}
      dataSource={products}
      pagination={pagination}
      //loading={loading}
      onChange={onHandleTableChange}  // 페이지 변경 이벤트
      scroll={{ y: 600,}}
      rowSelection={rowSelection}
      onRow={onRow}
      rowKey="productId"
      />
    </div>
  )
};

export default ProductEco;
