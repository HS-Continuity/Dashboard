import { fetchInventorySummary, fetchProductInventories, modifyProductInventory, registerProductInventory } from '../../apis/apisInventory';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Flex, Space, Table, Drawer, Button, Input, message } from 'antd'
import moment from 'moment';
import Swal from 'sweetalert2';
import { LeftOutlined, SearchOutlined, HourglassOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import styles from './Table.module.css';
import useAuthStore from "../../stores/useAuthStore";

const Inventory = () => {
  const [searchText, setSearchText] = useState('');  //  검색 정보 저장
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저
  const [filteredInfo, setFilteredInfo] = useState({});  // 필터링 정보 저장

  const [inventorySummary, setInventorySummary] = useState([]);
  const [productInventories, setProductInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [drawerFilteredInfo, setDrawerFilteredInfo] = useState({});
  const [drawerSortedInfo, setDrawerSortedInfo] = useState({});
  const [drawerSearchText, setDrawerSearchText] = useState('');
  const [drawerSearchedColumn, setDrawerSearchedColumn] = useState('');
  const { username } = useAuthStore();

  useEffect(() => {
    fetchInventorySummaryData();
  }, [pagination.current, pagination.pageSize]);

  // 상품별 재고 합계 현황
  const fetchInventorySummaryData = async () => {
    setLoading(true);
    try {
      // customerId: String(username),
      const customerId = 1;
      const response = await fetchInventorySummary(customerId, pagination.current - 1, pagination.pageSize);
      setInventorySummary(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements
      });

      console.log('받아온 데이터: ', inventorySummary);
    } catch (error) {
      message.error('재고 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false);
    }
  };

  // 특정 상품 재고 현황
  const fetchProductInventoriesData = async (productId) => {
    setLoading(true);
    try {
      const response = await fetchProductInventories(productId, 0, 10);
      //setProductInventories(response);

      console.log('받아온 특정 상품 재고 리스트: ', response)

      const transformedInventoriesData = response.map(inventory => {
        return {
          expirationDate: inventory.expirationDate,
          productId: inventory.productId,
          productInventoryId: inventory.productInventoryId,
          productName: inventory.productName,
          quantity: inventory.quantity,
          warehouseDate: inventory.warehouseDate
        }
      })

      setProductInventories(transformedInventoriesData);
      setPagination({
        ...pagination,
        total: response.totalElements
      })
      //console.log('변환된 재고 리스트: ', transformedInventoriesData)
    } catch (error) {
      message.error('상품 재고 리스트를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false);
    }
  }
  //console.log('받아온 특정 상품 재고 리스트: ', productInventories)

  const onHandleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const onDrawerTableChange = (pagination, filters, sorter) => {
    setDrawerFilteredInfo(filters);
    setDrawerSortedInfo(sorter);
  };

  // 재고 수량 변경 클릭
  const onHandleInventoryChange = (record) => {
    Swal.fire({
      title: '재고 변경',
      input: 'number',
      inputLabel: '추가할 재고 수량',
      inputPlaceholder: '숫자를 입력하세요',
      showCancelButton: true,
      confirmButtonText: '추가하기',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return '0보다 큰 숫자를 입력해주세요';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onHandleInventoryUpdate(record, parseInt(result.value));
      }
    });
  };

  // 재고 수량 업데이트
  const onHandleInventoryUpdate = async (record, additionalQuantity) => {
    try {
      // console.log('warehousingDate: ', record.warehouseDate)
      // console.log('quantity: ', record.quantity + additionalQuantity)
      // console.log('expirationDate: ', record.expirationDate)
      // console.log('productInventoryId: ', record.productInventoryId)
      const productInventoryId = record.productInventoryId;
      const modifyData = {
        warehousingDate: record.warehouseDate,
        quantity: record.quantity + additionalQuantity,
        expirationDate: record.expirationDate
      };
      //console.log('modifyData: ', modifyData)
      const response = await modifyProductInventory(productInventoryId, modifyData);

      // if (response.resultCode == null) {
        message.success('재고가 성공적으로 변경되었습니다.');
        
        // 로컬 상태 업데이트
        setProductInventories(prevInventories => 
          prevInventories.map(inventory => 
            inventory.productInventoryId === productInventoryId
              ? {...inventory, quantity: modifyData.quantity}
              : inventory
          )
        );

        // 전체 재고 요약 업데이트
        setInventorySummary(prevSummary =>
          prevSummary.map(item => 
            item.productId === record.productId
              ? {...item, totalQuantity: item.totalQuantity + additionalQuantity}
              : item
          )
        );
      // } else {
      //   //message.error('재고 변경에 실패했습니다: ' + (response ? response.resultMsg : '알 수 없는 오류'));
      // }
    } catch (error) {
      // console.error('재고 변경 오류:', error);
      // message.error('재고 변경에 실패했습니다: ' + error.message);
    }
  };

  // 재고 등록 클릭
  const onHandleInventoryRegister = (record) => {
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
      const registerData = {
        productId,
        warehouseDate,
        quantity,
        expirationDate
      };
      const response = await registerProductInventory(registerData);
      //console.log('registerData가 뭐여?: ', registerData)
      message.success('재고가 성공적으로 등록되었습니다.');

      fetchInventorySummaryData(); // 재고 요약 데이터 새로고침
  };


  const getDrawerColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ''}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onHandleDrawerSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => onHandleDrawerSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => onHandleDrawerReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      drawerSearchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[drawerSearchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const onHandleDrawerSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setDrawerSearchText(selectedKeys[0]);
    setDrawerSearchedColumn(dataIndex);
  };


  const onHandleReset = (clearFilters) => {  //  컬럼별 리셋
    clearFilters();
    setSearchText('');
  };

  const onHandleDrawerReset = () => {
    setDrawerFilteredInfo({});
    setDrawerSortedInfo({});
    setDrawerSearchText('');
    setDrawerSearchedColumn('');
  };

  const onRow = (record) => {
    return {
      onClick: () => {
        setSelectedProduct(record);
        fetchProductInventoriesData(record.productId);
        setDrawerVisible(true);
      },
    };
  };

  
  const columns = [
    {
      title: '상품명',
      dataIndex: 'productName',
      key: 'productName',
      width: '40%'
    },
    {
      title: '재고 수량',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: '40%'
    },
    {
      title: '재고 등록',
      key: 'register',
      render: (_, record) => (
        <Button onClick={() => onHandleInventoryRegister(record)}>재고 등록</Button>
      ),
    }
  ]

  const drawerColumns = [
    {
      title: 'NO.',
      dataIndex: 'no',  // 해당 데이터가 어떤 필드에 있는지
      key: 'no',
      fixed: 'left',
      width: '10%',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,  //  페이지가 넘어가도 순번 규칙이 이어서 적용됨
    },
    {
      title: '입고날짜',
      dataIndex: 'warehouseDate',
      key: 'warehouseDate',
      width: '20%',
      filteredValue: drawerFilteredInfo.warehouseDate || null,
      filtered: false,
      ...getDrawerColumnSearchProps('warehouseDate'),
      sorter: (a, b) => moment(a.warehouseDate).unix() - moment(b.warehouseDate).unix(),
      sortOrder: drawerSortedInfo.columnKey === 'warehouseDate' && drawerSortedInfo.order,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '유통기한',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      width: '20%',
      filteredValue: drawerFilteredInfo.expirationDate || null,
      filtered: false,
      ...getDrawerColumnSearchProps('expirationDate'),
      sorter: (a, b) => moment(a.expirationDate).unix() - moment(b.expirationDate).unix(),
      sortOrder: drawerSortedInfo.columnKey === 'expirationDate' && drawerSortedInfo.order,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '20%',
      filteredValue: drawerFilteredInfo.quantity || null,
      filtered: false,
    },
    {
      title: '재고 변경',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Button onClick={() => onHandleInventoryChange(record)}>재고 변경</Button>
      ),
    }
  ]


  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        </Flex>
        <Flex gap="small" wrap>
          <h2>상품별 재고현황</h2>
        </Flex>
      </Flex>
      <br/>
      <Table 
        dataSource={inventorySummary} 
        columns={columns}
        pagination={pagination}
        onChange={onHandleTableChange}
        onRow={onRow}
        rowKey="productId"
        loading={loading}
      />
      <Drawer
        title={`${selectedProduct?.productName} 재고 리스트`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={1100}
      >
        {/* <Flex gap="small" wrap>
          <Button onClick={onHandleDrawerReset}>Clear Filter</Button>
        </Flex>
        <br/>
        <Table 
          dataSource={productInventories} 
          columns={drawerColumns}
          pagination={false}
          rowKey="productInventoryId"
          onChange={onDrawerTableChange}
          sortDirections={['descend', 'ascend', 'descend']}
        /> */}
        <Flex gap="small" wrap>
          <Button onClick={onHandleDrawerReset}>초기화</Button>
        </Flex>
        <br/>
        <Table 
          className={styles.customTable}
          dataSource={productInventories} 
          columns={drawerColumns}
          pagination={false}
          rowKey="productInventoryId"
          onChange={onDrawerTableChange}
          sortDirections={['descend', 'ascend', 'descend']}
        />
      </Drawer>
    </div>
  )
};

export default Inventory;
