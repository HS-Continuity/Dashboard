import { fetchReleases, updateDeliveryDate, updateReleaseMemo, updateReleaseHoldReason, updateReleaseStatus, updateBulkReleaseStatus, requestCombinedPackaging} from '../../apis/apisShipments';
import { useState, useEffect, useRef } from 'react'
import { Table, Flex, Space, DatePicker, Button, message, Tag, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from 'moment';
import style from './Shipment.module.css';
import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
const { RangePicker } = DatePicker;

const Shipment = () => {
  const [isServerUnstable, setIsServerUnstable] = useState(false);

  //const [selectedRowKeys, setSelectedRowKeys] = useState([]);  //  선택한 행의 key 값 저장
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [joinForm, setJoinForm] = useState([{}]);
  //const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const searchInput = useRef(null);

  useEffect(() => {
    fetchShipments();
  }, [pagination.current, pagination.pageSize, joinForm])


  // const fetchShipments = async (page = 1, pageSize = 10) => {
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const params = {
        // customerId: getCurrentUserId(), // 현재 로그인한 사용자의 ID를 가져오는 함수
        customerId: 1,
        page: pagination.current - 1,
        size: pagination.pageSize,
        orderStatus: joinForm.orderStatus,
        orderId: joinForm.orderId,
        startDeliveryDate: joinForm.startDeliveryDate,
        recipient: joinForm.recipient,
        recipientPhoneNumber: joinForm.recipientPhoneNumber,
        recipientAddress: joinForm.recipientAddress,
        memberId: joinForm.memberId,
        memberName: joinForm.memberName,
        memberPhoneNumber: joinForm.memberPhoneNumber,
        startDate: joinForm.startDate,
        endDate: joinForm.endDate
      }
      const response = await fetchReleases(params);

      console.log('받아오는 출고데이터: ', response)

      let isServerUnstable = false;

      const transformedOrders = response.content.map(order => {
        const productOrderList = order.productOrderList?.productOrderList || 'null';
        let productName = '';
        let isMemberInfoAvailable = true;
        let isProductInfoAvailable = true;
        
        if (productOrderList && productOrderList.length > 0) {
          productName = `${productOrderList[0].name}`;
          // orderDateTime = `${productOrderList[0].orderDateTime}`

          if (productOrderList.length > 1) {
            productName += ` 외 ${productOrderList.length - 1}건`;
            // orderDateTime += ` 외 ${productOrderList.length - 1}건`;
          }

          // 서버 연결 상태 확인
          isMemberInfoAvailable = productOrderList.every(product => product.availableMemberInformation);  //  모든 상품에 대해...
          isProductInfoAvailable = productOrderList.every(product => product.availableProductInformation);
          
          if (!isMemberInfoAvailable || !isProductInfoAvailable) {
            isServerUnstable = true;
          }
        }
        
        return {
          orderId: order.orderId.toString() || '',
          productName: !isProductInfoAvailable ? (productName || '') : '확인중',
          //startDeliveryDate: order.startDeliveryDate,
          orderStatus: order.statusName?.toString() || '',
          productOrderList: productOrderList,
        }
      });

      //console.log('어떤 데이터를 받아오나요?: ', transformedOrders)

      setReleases(transformedOrders);
      setIsServerUnstable(isServerUnstable);
      setPagination({
        ...pagination,
        total: response.totalElements,
      })
      
    } catch (error) {
      //console.error('Failed to fetch orders:', error);
      message.error('출고 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setJoinForm(prev => ({
      ...prev,
      [dataIndex]: selectedKeys[0]
    }));
  };

  const onHandleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setJoinForm(prev => {
      const newForm = { ...prev };
      delete newForm[dataIndex];
      return newForm;
    });
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
          style={{ marginBottom: 8, display: 'block' }}
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
          <Button type="link" size="small" onClick={close}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onHandleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const onHandleDateChange = async (date, dateString, record) => {
    try {
      await updateDeliveryDate(record.orderId, dateString);
      message.success('배송시작일이 설정되었습니다.');
      fetchShipments();
    } catch (error) {
      message.error('배송시작일 설정에 실패했습니다.');
    }
  };

  const onHandleMemoClick = async (record) => {
    const { value: memo } = await Swal.fire({
      title: '출고메모',
      input: 'textarea',
      inputLabel: '출고메모를 입력하세요',
      inputPlaceholder: '출고메모를 입력하세요...',
      inputAttributes: {
        'aria-label': '출고메모를 입력하세요'
      },
      showCancelButton: true,
      confirmButtonText: '등록하기',
      cancelButtonText: '취소'
    });

    if (memo) {
      try {
        await updateReleaseMemo(record.orderId, memo);
        message.success('출고메모가 등록되었습니다.');
        fetchShipments();
      } catch (error) {
        message.error('출고메모 등록에 실패했습니다.');
      }
    }
  };

  const onHandleHoldReasonClick = async (record) => {
    const { value: holdReason } = await Swal.fire({
      title: '출고보류',
      input: 'textarea',
      inputLabel: '출고 보류 사유를 입력하세요',
      inputPlaceholder: '출고 보류 사유를 입력하세요...',
      inputAttributes: {
        'aria-label': '출고 보류 사유를 입력하세요'
      },
      showCancelButton: true,
      confirmButtonText: '등록하기',
      cancelButtonText: '취소'
    });

    if (holdReason) {
      try {
        await updateReleaseHoldReason(record.orderId, holdReason);
        message.success('출고보류 사유가 등록되었습니다.');
        fetchShipments();
      } catch (error) {
        message.error('출고보류 사유 등록에 실패했습니다.');
      }
    }
  };

  const onHandleStatusChange = async (status) => {
    if (selectedRowKeys.length === 0) {
      message.warning('변경할 항목을 선택해주세요.');
      return;
    }

    const selectedReleases = releases.filter(release => selectedRowKeys.includes(release.orderId));
    const isValidStatus = selectedReleases.every(release => {
      if (status === 'RELEASE_COMPLETED' && release.statusName !== 'AWAITING_RELEASE') {
        return false;
      }
      if (status === 'HOLD_RELEASE' && release.statusName === 'RELEASE_COMPLETED') {
        return false;
      }
      if (status === 'COMBINED_PACKAGING_COMPLETED' && release.statusName !== 'AWAITING_RELEASE') {
        return false;
      }
      return true;
    });

    if (!isValidStatus) {
      message.error(`해당 주문건의 출고 상태는 ${status} 상태로 변경할 수 없습니다.`);
      return;
    }

    try {
      if (selectedRowKeys.length === 1) {
        await updateReleaseStatus(selectedRowKeys[0], status);
      } else {
        await updateBulkReleaseStatus(selectedRowKeys, status);
      }
      message.success('출고 상태가 성공적으로 변경되었습니다.');
      fetchShipments();
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('출고 상태 변경에 실패했습니다.');
    }
  };

  const onHandleCombinedPackaging = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('합배송 할 항목을 선택해주세요.');
      return;
    }

    try {
      await requestCombinedPackaging(selectedRowKeys);
      message.success('합배송 요청이 성공적으로 처리되었습니다.');
      fetchShipments();
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('합배송 요청에 실패했습니다.');
    }
  };



  useEffect(() => {
    if (!fetchShipments.length > 0) {
      if (isServerUnstable) {
        message.warning('일부 주문에서 서버 연결이 불안정합니다.');
      } else {
        message.success('주문 데이터를 성공적으로 불러왔습니다.');
      }
    }
  }, [isServerUnstable]);



  // const onClearFilters = () => {
  //   setFilteredInfo({});
  // };

  // const handleReset = (clearFilters) => {  // 컬럼별 리셋
  //   clearFilters();
  //   setSearchText('');
  // }

  // const onHandCellClick = (record) => {
  //   console.log("클릭한 행의 key: ", record.member_id);
  //   setSelectedRowKeys(record.member_id);
  // }

  const onRow = (record) => {
    return {
      onClick: () => {
        if (record && record.memberId) {
          console.log('Navigation to detail page with data: ', record);
          //navigate();  // 출고 상세 페이지로 이동 
        } else {
          console.error('Invalid record: ', record);
          message.error('회원 정보를 불러올 수 없습니다.');
        }
      }
    };
  };
  

  const columns = [
    {
      title: '주문ID',
      dataIndex: 'orderId',
      key: 'orderId',
      filteredValue: joinForm.orderId || null,
      ...getColumnSearchProps('orderId'),
    },
    {
      title: '배송시작일',
      dataIndex: 'startDeliveryDate',
      key: 'startDeliveryDate',
      render: (text, record) => (
        <DatePicker 
          defaultValue={text ? moment(text) : null}
          onChange={(date, dateString) => onHandleDateChange(date, dateString, record)}
        />
      ),
      filteredValue: joinForm.startDeliveryDate || null,
      ...getColumnSearchProps('startDeliveryDate'),
    },
    {
      title: '주문상품',
      dataIndex: 'productName',
      key: 'productName',
      filteredValue: joinForm.productName || null,
      ...getColumnSearchProps('productName'),
    },
    {
      title: '출고메모',
      dataIndex: 'memo',
      key: 'memo',
      render: (text, record) => (
        <Button onClick={() => onHandleMemoClick(record)}>
          {text ? (text.length > 15 ? `${text.slice(0, 15)}...` : text) : '메모 입력'}
        </Button>
      ),
      filteredValue: joinForm.memo || null,
      ...getColumnSearchProps('memo'),
    },
    {
      title: '출고보류사유',
      dataIndex: 'holdReason',
      key: 'holdReason',
      render: (text, record) => (
        <Button onClick={() => onHandleHoldReasonClick(record)}>
          {text ? (text.length > 15 ? `${text.slice(0, 15)}...` : text) : '사유 입력'}
        </Button>
      ),
      filteredValue: joinForm.holdReason || null,
      ...getColumnSearchProps('holdReason'),
    },
    {
      title: '출고상태', 
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      filters: [
        { text: '출고대기', value: 'AWAITING_RELEASE' },
        { text: '출고보류', value: 'HOLD_RELEASE' },
        { text: '출고완료', value: 'RELEASE_COMPLETED' },
      ],
      filteredValue: joinForm.orderStatus || null,
      onFilter: (value, record) => record.orderStatus === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      width: '10%',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      AWAITING_RELEASE: 'green',
      HOLD_RELEASE: 'orange',
      RELEASE_COMPLETED: 'cyan'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      AWAITING_RELEASE: '출고대기',
      HOLD_RELEASE: '출고보류',
      RELEASE_COMPLETED: '출고완료'
    };
    return texts[status] || status;
  };

  const statusTags = ['출고대기', '출고보류', '출고완료'];

  return (
    <div>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" wrap>
          <h2>출고관리</h2>
        </Flex>
      </Flex>
      <Flex gap="small" align="center" justify='space-between'>
        <Flex gap="small" wrap>
          <Space align="center">검색기간</Space>
          <RangePicker 
            // value={selectedDateRange}
            // onChange={onHandleRangePickerChange}
            allowClear />
        </Flex>
        <Flex gap="small" wrap>
          {statusTags.map((tag) => (
            // <StatusCard key={tag} title={tag} count={statusCounts[tag]} />
            <StatusCard key={tag} title={tag}/>
          ))}
        </Flex>
      </Flex>
      <br />
      <Flex className={style.fullScreen}>
        
        <Flex gap='small' align='center' justify='space-between'>
        <Flex gap="small" wrap>
          {/* <Button >Clear Filter</Button> */}
          {/* <Button onClick={onClearFilters}>Clear Filter</Button> */}
          <Button onClick={onHandleReset}>Clear Filter</Button>
        </Flex>
        <Flex gap="small" wrap>
          <Space align="center">출고상태변경</Space>
          <StatusChangeButton 
            title={"출고완료"}
            onClick={() => onHandleStatusChange('RELEASE_COMPLETED')}
          />
          <StatusChangeButton 
            title={"출고보류"}
            onClick={() => onHandleStatusChange('HOLD_RELEASE')}
          />
          <StatusChangeButton 
            title={"합배송완료"}
            onClick={() => onHandleStatusChange('COMBINED_PACKAGING_COMPLETED')}
          />
        </Flex>
      </Flex>
      <br/>
      <Table
        columns={columns}
        dataSource={releases}
        rowKey="orderId"
        pagination={pagination}
        loading={loading}
        onChange={onHandleTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);  // 선택한 행의 key 값 업데이트
          }
        }}
        onRow={onRow}
      />
      </Flex>
      <Button onClick={onHandleCombinedPackaging}>합배송 요청</Button>
      
    </div>
  )
}

export default Shipment

