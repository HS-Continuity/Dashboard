import { Table, Flex, Space, DatePicker, Divider, Button } from 'antd'
import { useState, useEffect } from 'react'
import { fetchReleases, updateReleaseMemo } from '../../apis/apisOrders';
import Swal from 'sweetalert2';
import './ShipmentModule.css';

const { RangePicker } = DatePicker;

const Shipment = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // const [selectedDateRange, setSelectedDateRange] = useState([]);

  // const onHandleRangePickerChange = (dates) => {
  //   setSelectedDateRange(dates || []);  //  상태 업데이트
  // }

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const customerId = 1; // 로그인한 고객 ID
      const result = await fetchReleases(customerId, null, page - 1, pageSize);
      setReleases(result.content);
      setPagination({
        ...pagination,
        current: page,
        pageSize: pageSize,
        total: result.totalElements,
      });
    } catch (error) {
      // console.error('Error fetching releases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onHandleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const onHandleMemoClick = async (record) => {
    const { valud: memo } = await Swal.fire({
      title: '출고 메모 입력',
      input: 'textarea',
      inputLabel: '메모',
      inputPlaceholder: '출고 메모를 입력하세요...',
      inputValue: record.memo || '',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return '메모를 입력해주세요!';
        }
      }
    });

    if (memo) {
      try {
        await updateReleaseMemo(record.releaseId, memo);
        Swal.fire('성공', '메모가 업데이트되었습니다.', 'success');
        fetchData(pagination.current, pagination.pageSize);
      } catch (error) {
        Swal.fire('오류', '메모 업데이트에 실패했습니다.', 'error');
      }
    }
  };

  const columns = [
    {
      title: '출고ID', 
      dataIndex: 'releaseId',
      key: 'releaseId'
    },
    {
      title: '출고 상태', 
      dataIndex: 'release_status_id',
      key: 'release_status_id'
    },
    {
      title: '배송 시작일', 
      dataIndex: 'start_delivery_date',
      key: 'start_delivery_date'
    },
    {
      title: '출고 보류 사유', 
      dataIndex: 'hold_reason',
      key: 'hold_reason'
    },
    {
      title: '메모', 
      dataIndex: 'memo',
      key: 'memo',
      render: (text, record) => (
        <Button onClick={() => onHandleMemoClick(record)}>
          {text ? '메모 수정' : '메모 입력'}
        </Button>
      )
    },
    {
      title: '주문 상세 ID', 
      dataIndex: 'order_detail_id',
      key: 'order_detail_id'
    },
  ];

  return (
    <div>
      <Flex className='fullScreen'>
        <Flex className='header'>
          <h2>출고관리</h2>
          <div>
            <Space align="center">검색기간</Space>
            <RangePicker 
              // value={selectedDateRange}
              // onChange={onHandleRangePickerChange}
              allowClear />
          </div>
        </Flex>
        <Divider/>
        <Flex className='content'>
        <Table
            columns={columns}
            dataSource={releases}
            loading={loading}
            pagination={pagination}
            onChange={onHandleTableChange}
            rowKey="releaseId"
          />
        </Flex>
      </Flex>
      
    </div>
  )
}

export default Shipment
