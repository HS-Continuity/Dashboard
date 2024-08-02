import { fetchProductItems, registerTimesale, registerAdvertisement  } from '../../apis/apisProducts';
import { registerProductInventory } from '../../apis/apisInventory'; 
import { useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space, Table, Tag, Button, Input, message, ConfigProvider } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Swal from 'sweetalert2';
import moment from 'moment';
import RegisterButton from '../../components/Buttons/RegisterButton';
import ApplyButton from '../../components/Buttons/ApplyButton';
import PromotionApplyButton from '../../components/Buttons/PromotionApplyButton';
import TimeAttackApplyModal from '../../components/Modals/TimeAttackApplyModal';
import styles from './Table.module.css';


const ProductGeneral = () => {

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

      // console.log('Sending params:', params);
      // console.log('Fetching with params:', params);

      const response = await fetchProductItems(params);
      

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

  // 상단 노출 신청
  const onHandlePromotionApply = async () => {
    if (selectedRowKeys.length !== 1) {
      message.warning('상단 노출을 신청할 상품을 하나만 선택해주세요.');
      return;
    }

    const selectedProduct = products.find(product => product.productId === selectedRowKeys[0]);

    const { value: formValues } = await Swal.fire({
      title: '상단 노출 신청',
      html:
      '<div style="text-align: left; margin-bottom: 20px;">' +
      '<label for="swal-input1" style="display: inline-block; width: 150px; font-weight: bold;">상품ID</label>' +
      `<input id="swal-input1" class="swal2-input" value="${selectedProduct.productId}" readonly style="width: 230px;">` +
      '</div>' +
      '<div style="text-align: left; margin-bottom: 20px;">' +
      '<label for="swal-input2" style="display: inline-block; width: 150px; font-weight: bold;">상품명</label>' +
      `<input id="swal-input2" class="swal2-input" value="${selectedProduct.productName}" readonly style="width: 230px;">` +
      '</div>' +
      '<div style="text-align: left; margin-bottom: 5px;">' +
      '<label for="swal-input3" style="display: inline-block; width: 150px; font-weight: bold;">노출 시작일</label>' +
      '<input id="swal-input3" class="swal2-input" type="date" style="width: 300px;">' +
      '</div>' +
      '<div id="swal-input3-error" style="color: red; margin-left: 150px; margin-bottom: 15px;"></div>' +
      '<div style="text-align: left; margin-bottom: 20px;">' +
      '<label for="swal-input4" style="display: inline-block; width: 150px; font-weight: bold;">노출 종료일</label>' +
      '<input id="swal-input4" class="swal2-input" type="date" readonly style="width: 300px;">' +
      '</div>',
      confirmButtonText: '신청하기',
      focusConfirm: false,
      showCloseButton: true,
      preConfirm: () => {
        const startDate = document.getElementById('swal-input3').value;
        let isValid = true;

        if (!startDate) {
          document.getElementById('swal-input3-error').textContent = '노출 시작일을 선택해주세요.';
          isValid = false;
        } else {
          const selectedDate = moment(startDate);
          if (selectedDate.day() !== 1) {  // 1은 월요일을 의미합니다
            document.getElementById('swal-input3-error').textContent = '노출 시작일은 월요일이어야 합니다.';
            isValid = false;
          } else {
            document.getElementById('swal-input3-error').textContent = '';
          }
        }

        if (!isValid) {
          return false;
        }

        const endDate = moment(startDate).endOf('week').format('YYYY-MM-DD');
        document.getElementById('swal-input4').value = endDate;

        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          startDate,
          endDate
        ];
      },
      didOpen: () => {
        const startInput = document.getElementById('swal-input3');
        startInput.addEventListener('change', (e) => {
          const selectedDate = moment(e.target.value);
          if (selectedDate.day() === 1) {
            const endDate = selectedDate.endOf('week').format('YYYY-MM-DD');
            document.getElementById('swal-input4').value = endDate;
            document.getElementById('swal-input3-error').textContent = '';
          } else {
            document.getElementById('swal-input3-error').textContent = '노출 시작일은 월요일이어야 합니다.';
            document.getElementById('swal-input4').value = '';
          }
        });
      }
    });

    if (formValues) {
      const [productId, productName, startDate, endDate] = formValues;

      try {
        const advertisementData = {
          productId: parseInt(productId),
          productName,
          startDate,
          endDate
        };

        await registerAdvertisement(advertisementData);
        message.success('상단 노출 신청이 완료되었습니다');
      } catch (error) {
        console.error('Error: ', error);
        message.error('상단 노출 신청에 실패했습니다.');
      }
    }
  };

  // 재고 등록 버튼
  const onHandleInventoryRegister = (event, record) => {
    event.stopPropagation();  // 이벤트 전파 중단
    Swal.fire({
      title: '재고 등록',
      html:
      '<div class="swal2-input-group">' +
      '<label for="swal-input1" class="swal2-input-label">입고날짜:</label>' +
      '<input id="swal-input1" class="swal2-input" type="date">' +
      '</div>' +
      '<div class="swal2-input-group">' +
      '<label for="swal-input2" class="swal2-input-label">재고수량:</label>' +
      '<input id="swal-input2" class="swal2-input" type="number">' +
      '</div>' +
      '<div class="swal2-input-group">' +
      '<label for="swal-input3" class="swal2-input-label">소비기한:</label>' +
      '<input id="swal-input3" class="swal2-input" type="date">' +
      '</div>',
      focusConfirm: false,
      preConfirm: () => {
        return {
          warehouseDate: document.getElementById('swal-input1').value,
          quantity: document.getElementById('swal-input2').value,
          expirationDate: document.getElementById('swal-input3').value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { warehouseDate, quantity, expirationDate } = result.value;
        if (!warehouseDate || !quantity || !expirationDate) {
          Swal.fire('오류', '모든 필드를 입력해주세요.', 'error');
          return;
        }
        onHandleInventoryCreate(record.productId, warehouseDate, parseInt(quantity), expirationDate);
      }
    });
  };

  // 재고 등록
  const onHandleInventoryCreate = async (productId, warehouseDate, quantity, expirationDate) => {
    try {
      const registerData = {
        productId,
        warehouseDate,
        quantity,
        expirationDate
      };
      const response = await registerProductInventory(registerData);
      if (response && response.successCode === SuccessCode.INSERT_SUCCESS) {
        message.success('재고가 성공적으로 등록되었습니다.');
        //fetchInventorySummaryData(); // 재고 요약 데이터 새로고침
      } else {
        //message.error('재고 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('재고 등록 오류:', error);
      message.error('재고 등록에 실패했습니다.');
    }
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

  const onHandleTableChange = (newPagination, filters, sorter) => {
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
      onClick: (event) => {
        // 재고 등록 버튼 클릭 시 상세 페이지로 이동하지 않음
        if (event.target.tagName != 'BUTTON') {
          navigate(`/product/general/${record.productId}`)
        }
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

  const onClickCreate = () => {
    navigate('../create');
  }

  const handleCellClick = (record) => {
    console.log("클릭한 행의 key: ", record.productId)
  }

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
      width: '10%',
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
        <Tag 
          color={getTagColor(status)}
          className={styles.largeTag}
        >
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
        <Tag 
          color={getTagColor(status)}
          className={styles.largeTag}
        >
          {getTagText(status)}
        </Tag>
      ),
    },
    {
      title: '재고 등록',
      key: 'register',
      render: (_, record) => (
        <Button onClick={(event) => onHandleInventoryRegister(event, record)}>재고 등록</Button>
      ),
    }
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
          <h2>일반식품관리</h2>
        </Flex>
      </Flex>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap="small" wrap>
          <Button onClick={onHandleReset} className={styles.smallButton} >Clear Filter</Button>
          {/* <Button onClick={clearAll}>Clear filters and sorters</Button> */}
        </Flex>
        <Flex gap="small" wrap>
          <RegisterButton 
            title={"일반식품"}
            onClick={onClickCreate}
          />
          <ApplyButton 
            title={"타임세일"}
            onClick={onHandleTimesaleApply}
          />
          <PromotionApplyButton 
          title={"상단 노출"}
          onClick={onHandlePromotionApply}
        />
        </Flex>
        
      </Flex>
      <br/>
      <ConfigProvider
        theme={{
          token: {
            fontSizeSM: '8px'
          },
        }}
      >
        <Table
        className={styles.customTable}
        columns={columns}
        dataSource={products}
        pagination={pagination}
        //loading={loading}
        onChange={onHandleTableChange}  // 페이지 변경 이벤트
        rowSelection={rowSelection}
        onRow={onRow}
        rowKey="productId"
        style={{ width: '100%', height: '400px'}} // 전체 테이블 크기 조정
        scroll={{ x: '100%', y: 400,}}// 가로 스크롤과 세로 스크롤 설정
      />
      </ConfigProvider>
      {/* <Table
        className={styles.customTable}
        columns={columns}
        dataSource={products}
        pagination={pagination}
        //loading={loading}
        onChange={onHandleTableChange}  // 페이지 변경 이벤트
        rowSelection={rowSelection}
        onRow={onRow}
        rowKey="productId"
        style={{ width: '95%', height: '300px'}} // 전체 테이블 크기 조정
        scroll={{ x: '100%', y: 600,}}// 가로 스크롤과 세로 스크롤 설정
      /> */}
    </div>
  )
};

export default ProductGeneral;
