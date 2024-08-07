import {
  fetchCustomerOrders,
  updateOrderStatus,
  updateBulkOrderStatus,
  subscribeToOrderStatusUpdates,
} from "../../../apis/apisOrders";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Space,
  DatePicker,
  Table,
  Tag,
  Button,
  Input,
  message,
  Switch,
  Slider,
  Typography,
  Tooltip,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import Swal from "sweetalert2";
import StatusCard from "../../../components/Cards/StatusCard";
import StatusChangeButton from "../../../components/Buttons/StatusChangeButton";
import style from "../../customer/Order.module.css";
import newVoice2 from "../../../assets/audio/newVoice2.m4a";
import locale from "antd/es/date-picker/locale/ko_KR";
import useAuthStore from "../../../stores/useAuthStore";
import EasyOrderGeneralDetail from "./EasyOrderGeneralDetail";
import { useFontSizeStore } from "../../../stores/fontSizeStore";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const EasyOrderGeneral = () => {
  const { username } = useAuthStore();

  const audioRef = useRef(new Audio(newVoice2)); // 오디오 객체 생성
  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const { tableFontSize, setTableFontSize } = useFontSizeStore();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [joinForm, setJoinForm] = useState({});
  const [fullOrders, setFullOrders] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const searchInput = useRef(null);
  const tableRef = useRef();
  const eventSourceRef = useRef(null);
  const prevStatusCountRef = useRef({});

  const getTableCellStyle = () => ({
    fontSize: `${tableFontSize}px`,
  });

  const checkForNewOrders = useCallback(newStatusCount => {
    let hasNewOrder = false;
    ["PAYMENT_COMPLETED", "PREPARING_PRODUCT", "AWAITING_RELEASE"].forEach(status => {
      if (newStatusCount[status] > (prevStatusCountRef.current[status] || 0)) {
        hasNewOrder = true;
      }
    });
    prevStatusCountRef.current = { ...newStatusCount };
    return hasNewOrder;
  }, []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchOrders();
    const customerId = String(username);
    eventSourceRef.current = subscribeToOrderStatusUpdates(customerId);

    eventSourceRef.current.onopen = () => {
      console.log("SSE connection opened");
    };

    eventSourceRef.current.onmessage = event => {
      console.log("Received SSE message:", event);
      const data = JSON.parse(event.data);
      console.log("Parsed SSE data:", data);

      setStatusCount(prevStatusCount => {
        const newStatusCount = { ...prevStatusCount };
        data.forEach(item => {
          if (
            ["PAYMENT_COMPLETED", "PREPARING_PRODUCT", "AWAITING_RELEASE"].includes(item.statusName)
          ) {
            newStatusCount[item.statusName] = item.count;
          }
        });

        if (!isInitialMount.current) {
          const hasNewOrder = checkForNewOrders(newStatusCount);

          if (hasNewOrder) {
            if (isSoundOn) {
              audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
            }
            Swal.fire({
              title: "Notification",
              text: "새로운 주문이 들어왔습니다",
              icon: "info",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } else {
          isInitialMount.current = false;
        }

        prevStatusCountRef.current = newStatusCount;
        return newStatusCount;
      });
    };

    eventSourceRef.current.onerror = error => {
      console.error("SSE Error: ", error);
      eventSourceRef.current.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [checkForNewOrders, isSoundOn]);

  useEffect(() => {
    const handleUserInteraction = () => {
      audioRef.current.load();
      document.removeEventListener("click", handleUserInteraction);
    };
    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: String(username),
        page: pagination.current - 1,
        size: pagination.pageSize,
        ...joinForm,
      };

      Object.entries(joinForm).forEach(([key, value]) => {
        if (value != null && value !== "") {
          if (value instanceof Date) {
            params[key] = value.toISOString().split("T")[0];
          } else if (Array.isArray(value)) {
            params[key] = value.join(",");
          } else {
            params[key] = value;
          }
        }
      });

      const response = await fetchCustomerOrders(params);
      setFullOrders(response.content);

      let isServerUnstable = false;

      const transformedOrders = response.content.map(order => {
        const isMemberInfoAvailable = order.availableMemberInformation;
        const isProductInfoAvailable = order.availableProductInformation;

        if (!isMemberInfoAvailable || !isProductInfoAvailable) {
          isServerUnstable = true;
        }

        return {
          orderDetailId: order.orderDetailId?.toString() || "",
          memberId: isMemberInfoAvailable
            ? order.memberInfo?.memberId?.toString() || ""
            : "불러오는 중..",
          orderDateTime: order.orderDateTime?.toString() || "",
          deliveryAddress: order.recipient?.recipientAddress?.toString() || "",
          recipient: order.recipient?.recipient?.toString() || "",
          orderStatusCode: order.orderStatusCode?.toString() || "",
          productName: isProductInfoAvailable
            ? order.productOrderList?.length > 0
              ? `${order.productOrderList[0].name} ${order.productOrderList.length > 1 ? `외 ${order.productOrderList.length - 1}건` : ""}`
              : ""
            : "불러오는 중..",
        };
      });

      setOrders(transformedOrders);
      setIsServerUnstable(isServerUnstable);
      setPagination({
        ...pagination,
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("주문 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onHandleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setJoinForm(prev => ({
      ...prev,
      [dataIndex]: selectedKeys[0] ? [selectedKeys[0]] : null,
    }));
  };

  const onHandleReset = () => {
    setJoinForm({});
    setFilteredInfo({});
    setDateRange([]);
    if (tableRef.current) {
      tableRef.current.clearFilters();
    }
    fetchOrders();
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`검색할 내용을 입력해 주세요`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onHandleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
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
          <Button
            onClick={() => onHandleReset(clearFilters, dataIndex)}
            size='small'
            style={{ width: 90 }}>
            초기화
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close();
            }}>
            닫기
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => {
      if (record[dataIndex] == null) return false;

      const itemValue = record[dataIndex];
      const filterValue = value;

      // 날짜 처리
      if (itemValue instanceof Date) {
        const dateValue = itemValue.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        return dateValue.includes(filterValue);
      }

      // 그 외의 경우
      const stringItemValue = String(itemValue).toLowerCase();
      const stringFilterValue = String(filterValue).toLowerCase();

      return stringItemValue.includes(stringFilterValue);
    },
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onHandleTableChange = (newPagination, filters) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
    setJoinForm(prev => ({
      ...prev,
      orderStatusCode: filters.orderStatusCode ? filters.orderStatusCode[0] : null,
    }));
  };

  const onHandleRangePickerChange = dates => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      setJoinForm(prev => ({
        ...prev,
        startDate: startDate,
        endDate: endDate,
      }));
    } else {
      setJoinForm(prev => {
        const newForm = { ...prev };
        delete newForm.startDate;
        delete newForm.endDate;
        return newForm;
      });
    }
  };

  const onHandleStatusChange = async status => {
    if (selectedRowKeys.length === 0) {
      message.warning("변경할 항목을 선택해주세요.");
      return;
    }

    const selectedOrders = orders.filter(order => selectedRowKeys.includes(order.orderDetailId));

    const isValidStatus = selectedOrders.every(order => {
      console.log("현재 status: ", order.orderStatusCode);
      if (status == "PREPARING_PRODUCT" && order.orderStatusCode !== "PAYMENT_COMPLETED") {
        return false;
      }
      if (status == "AWAITING_RELEASE" && order.orderStatusCode !== "PREPARING_PRODUCT") {
        return false;
      }
      return true;
    });

    if (!isValidStatus) {
      message.error(`해당 주문건의 주문 상태는 ${status} 상태로 변경할 수 없습니다.`);
      return;
    }

    try {
      if (selectedRowKeys.length === 1) {
        await updateOrderStatus(selectedRowKeys[0], status);
      } else {
        await updateBulkOrderStatus(selectedRowKeys, status);
      }
      message.success("주문 상태가 성공적으로 변경되었습니다.");
      fetchOrders();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("주문 상태 변경 실패:", error);
      message.error("주문 상태 변경에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (isServerUnstable) {
      message.warning("일부 서비스에 연결할 수 없습니다. 데이터가 부분적으로 표시될 수 있습니다.");
    }
  }, [isServerUnstable]);

  const onRow = record => {
    return {
      onClick: () => {
        const fullOrderData = fullOrders.find(
          order => order.orderDetailId === record.orderDetailId
        );
        setSelectedOrder(fullOrderData);
        setIsDrawerVisible(true);
      },
    };
  };

  const columns = [
    {
      title: "주문 아이디",
      dataIndex: "orderDetailId",
      key: "orderDetailId",
      fixed: "left",
      filteredValue: joinForm.orderId ? [joinForm.orderId] : null,
      filtered: false,
      ...getColumnSearchProps("orderDetailId"),
      width: "15%",
      render: text => text || "null",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "회원ID",
      dataIndex: "memberId",
      key: "memberId",
      fixed: "left",
      filteredValue: joinForm.memberId ? [joinForm.memberId] : null,
      filtered: false,
      ...getColumnSearchProps("memberId"),
      width: "15%",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "주문날짜",
      dataIndex: "orderDateTime",
      key: "orderDateTime",
      fixed: "left",
      filteredValue: joinForm.orderDateTime ? [joinForm.orderDateTime] : null,
      filtered: false,
      ...getColumnSearchProps("orderDateTime"),
      width: "20%",
      render: text => {
        if (text === "null" || !text) {
          return "null";
        }
        return moment(text).format("YYYY-MM-DD HH:mm");
      },
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "배송지",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      width: "30%",
      filteredValue: joinForm.deliveryAddress ? [joinForm.deliveryAddress] : null,
      filtered: false,
      ...getColumnSearchProps("deliveryAddress"),
      render: text => text || "null",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "수령인",
      dataIndex: "recipient",
      key: "recipient",
      filteredValue: joinForm.recipient ? [joinForm.recipient] : null,
      filtered: false,
      ...getColumnSearchProps("recipient"),
      width: "10%",
      render: text => text || "null",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "주문 상태",
      dataIndex: "orderStatusCode",
      key: "orderStatusCode",
      filters: [
        { text: "결제완료", value: "PAYMENT_COMPLETED" },
        { text: "상품준비중", value: "PREPARING_PRODUCT" },
        { text: "출고대기중", value: "AWAITING_RELEASE" },
      ],
      filteredValue: joinForm.orderStatusCode ? [joinForm.orderStatusCode] : null,
      onFilter: (value, record) => record.orderStatusCode === value,
      render: status => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
      width: "10%",
    },
  ];

  const getStatusColor = status => {
    const colors = {
      PAYMENT_COMPLETED: "#E2860A",
      PREPARING_PRODUCT: "#447E7A",
      AWAITING_RELEASE: "#D6737A",
    };
    return colors[status] || "default";
  };

  const getStatusText = status => {
    const texts = {
      PENDING: "주문 대기",
      PAYMENT_COMPLETED: "결제 완료",
      AWAITING_RELEASE: "출고 대기",
      PREPARING_PRODUCT: "상품 준비",
      SHIPPED: "배송 시작",
      IN_DELIVERY: "배송중",
      DELIVERED: "배송 완료",
      CANCELED: "주문 취소",
    };
    return texts[status] || status;
  };

  return (
    <div>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap='small' wrap>
          <h2>일반주문관리</h2>
        </Flex>
      </Flex>
      <Flex gap='small' align='center' justify='end'>
        <Flex gap='small' wrap>
          {["PAYMENT_COMPLETED", "PREPARING_PRODUCT", "AWAITING_RELEASE"].map(status => (
            <StatusCard
              key={status}
              title={getStatusText(status)}
              count={statusCount[status] || 0}
              color={getStatusColor(status)}
            />
          ))}
        </Flex>
      </Flex>
      <br />
      <Flex className={style.fullScreen}>
        <Flex gap='large' align='center' justify='space-between'>
          <Flex gap='small'>
            <Flex gap='small'>
              <Space align='center'>검색기간</Space>
              <RangePicker
                value={dateRange}
                onChange={onHandleRangePickerChange}
                allowClear
                locale={locale}
              />
            </Flex>
            <Button onClick={onHandleReset}>초기화</Button>
          </Flex>
          <Flex>
            <Text strong>글꼴 크기 : </Text>
            <Slider
              min={12}
              max={30}
              value={tableFontSize}
              onChange={setTableFontSize}
              style={{ width: 200, marginBottom: 16 }}
            />
          </Flex>
          <Flex gap='small'>
            <Flex gap='small' align='center'>
              <Space align='center'>음성 알림</Space>
              <Switch
                checkedChildren='ON'
                unCheckedChildren='OFF'
                checked={isSoundOn}
                onChange={checked => setIsSoundOn(checked)}
              />
            </Flex>
            <Space align='center'>주문상태변경</Space>
            <Tooltip title={`결제 완료 → 주문 승인`} color={"#00835F"} key={"#00835F"}>
              <Button onClick={() => onHandleStatusChange("PREPARING_PRODUCT")}>
                {"주문승인"}
              </Button>
            </Tooltip>
            <Tooltip title={`상품 준비 → 출고 대기`} color={"#00835F"} key={"#00835F"}>
              <Button onClick={() => onHandleStatusChange("AWAITING_RELEASE")}>{"출고대기"}</Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
      <br />
      <Table
        columns={columns}
        dataSource={orders}
        rowKey='orderDetailId'
        pagination={pagination}
        loading={loading}
        onChange={onHandleTableChange}
        rowSelection={rowSelection}
        onRow={onRow}
        style={{ width: "100%", height: "300px" }}
        scroll={{ x: "100%", y: 300 }}
      />
      <EasyOrderGeneralDetail
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        orderDetail={selectedOrder}
      />
    </div>
  );
};

export default EasyOrderGeneral;
