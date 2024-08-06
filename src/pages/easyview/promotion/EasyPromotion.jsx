import { fetchAdvertisements } from "../../../apis/apisPromotion";
import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Table,
  Tag,
  Button,
  Input,
  Space,
  message,
  DatePicker,
  Slider,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import StatusCard from "../../../components/Cards/StatusCard";
const { Text } = Typography;
import locale from "antd/es/date-picker/locale/ko_KR";
const { RangePicker } = DatePicker;

import useAuthStore from "../../../stores/useAuthStore";
import { useFontSizeStore } from "../../../stores/fontSizeStore";

const Promotion = () => {
  const [dateRange, setDateRange] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [joinForm, setJoinForm] = useState({});
  const searchInput = useRef(null);
  const tableRef = useRef(null);
  const { username } = useAuthStore();
  const { tableFontSize, setTableFontSize } = useFontSizeStore();

  const getTableCellStyle = () => ({
    fontSize: `${tableFontSize}px`,
  });

  useEffect(() => {
    fetchAdvertisementData();
  }, [pagination.current, pagination.pageSize, dateRange, joinForm]);

  const fetchAdvertisementData = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: String(username),
        startPage: pagination.current - 1,
        pageSize: pagination.pageSize,
        ...joinForm,
      };
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      const response = await fetchAdvertisements(params);

      let transformedPromoData = response.map(promo => {
        return {
          discountRate: promo.discountRate,
          endDate: promo.endDate,
          price: promo.price,
          productId: promo.productId,
          productImage: promo.productImage,
          productName: promo.productName,
          serviceStatus: promo.serviceStatus,
          startDate: promo.startDate,
        };
      });

      setAdvertisements(transformedPromoData);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (error) {
      message.error("광고 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`검색할 ${dataIndex}를 입력하세요.`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            검색
          </Button>
          <Button onClick={() => onHandleReset(clearFilters)} size='small' style={{ width: 90 }}>
            초기화
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onHandleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setJoinForm(prev => ({
      ...prev,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const onHandleReset = () => {
    setJoinForm({});
    setFilteredInfo({});
    setDateRange([]);
    setPagination({
      current: 1,
      pageSize: 5,
      total: 0,
    });
    if (tableRef.current) {
      tableRef.current.clearFilters();
      tableRef.current.clearSorters();
    }
    fetchAdvertisementData();
  };

  const onHandleDateRangeChange = dates => {
    setDateRange(dates);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchAdvertisementData();
  };

  const getColumns = () => [
    {
      title: "식품 아이디",
      dataIndex: "productId",
      key: "productId",
      filteredValue: filteredInfo.productId || null,
      filtered: false,
      ...getColumnSearchProps("productId"),
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "식품명",
      dataIndex: "productName",
      key: "productName",
      filteredValue: filteredInfo.productName || null,
      filtered: false,
      ...getColumnSearchProps("productName"),
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "식품가격",
      dataIndex: "price",
      key: "price",
      filteredValue: filteredInfo.price || null,
      filtered: false,
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" && sortedInfo.order,
      render: price =>
        price.toLocaleString("ko-KR", { style: "currency", currency: "KRW" }).replace("₩", "₩ "),
      ...getColumnSearchProps("price"),
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "할인율",
      dataIndex: "discountRate",
      key: "discountRate",
      filteredValue: filteredInfo.discountRate || null,
      filtered: false,
      sorter: (a, b) => a.discountRate - b.discountRate,
      sortOrder: sortedInfo.columnKey === "discountRate" && sortedInfo.order,
      render: discountRate => `${discountRate} %`,
      ...getColumnSearchProps("discountRate"),
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "광고 시작일",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      sortOrder: sortedInfo.columnKey === "startDate" && sortedInfo.order,
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "광고 종료일",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      sortOrder: sortedInfo.columnKey === "endDate" && sortedInfo.order,
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "광고 상태",
      dataIndex: "serviceStatus",
      key: "serviceStatus",
      filteredValue: filteredInfo.serviceStatus || null,
      filters: [
        { text: "대기", value: "PENDING" },
        { text: "승인", value: "APPROVE" },
        { text: "진행중", value: "IN_PROGRESS" },
        { text: "마감", value: "ENDED_EVENT" },
        { text: "취소", value: "CANCELED" },
      ],
      onFilter: (value, record) => record.serviceStatus === value,
      render: status => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
  ];

  const getRowKey = (record, index) => `${record.productId}-${index}`;

  const getStatusColor = status => {
    const colors = {
      PENDING: "#E2860A",
      APPROVE: "#447E7A",
      IN_PROGRESS: "#D6737A",
      ENDED_EVENT: "#4D7D9E",
      CANCELED: "#878987",
    };
    return colors[status] || "default";
  };

  const getStatusText = status => {
    const texts = {
      PENDING: "대기",
      APPROVE: "승인",
      IN_PROGRESS: "진행중",
      ENDED_EVENT: "마감",
      CANCELED: "취소",
    };
    return texts[status] || status;
  };

  return (
    <div style={getTableCellStyle()}>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap='small' wrap>
          <h2>상단 노출 관리</h2>
        </Flex>
      </Flex>
      <Flex gap='small' align='center' justify='end' style={{ marginBottom: "20px" }}>
        {["PENDING", "APPROVE", "IN_PROGRESS", "ENDED_EVENT", "CANCELED"].map(status => (
          <StatusCard
            key={status}
            title={getStatusText(status)}
            count={advertisements.filter(ad => ad.serviceStatus === status).length}
            color={getStatusColor(status)}
          />
        ))}
      </Flex>
      <Flex gap='large' align='flex-start' justify='space-between' style={{ marginBottom: "20px" }}>
        <Flex gap='small' align='center'>
          <Space align='center'>검색기간</Space>
          <RangePicker
            value={dateRange}
            onChange={onHandleDateRangeChange}
            allowClear
            onCalendarChange={dates => {
              if (!dates) {
                onHandleReset();
              }
            }}
            locale={locale}
          />
          <Button style={getTableCellStyle()} onClick={onHandleReset}>
            정렬 초기화
          </Button>
        </Flex>

        <Flex gap='small' align='center' style={{ marginRight: "560px" }}>
          <Text strong>글꼴 크기:</Text>
          <Slider
            min={12}
            max={30}
            value={tableFontSize}
            onChange={setTableFontSize}
            style={{ width: "200px" }}
          />
        </Flex>
      </Flex>
      {/* <br /> */}
      <Table
        ref={tableRef}
        columns={getColumns()}
        dataSource={advertisements}
        rowKey={getRowKey}
        pagination={pagination}
        loading={loading}
        onChange={(pagination, filters, sorter) => {
          onHandleTableChange(pagination, filters, sorter);
          setSortedInfo(sorter);
        }}
        style={{ width: "100%", height: "400px", marginBottom: "100px" }}
        scroll={{ x: "100%", y: 400 }}
      />
    </div>
  );
};

export default Promotion;
