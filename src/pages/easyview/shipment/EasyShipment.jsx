import {
  fetchReleases,
  updateReleaseStatus,
  updateBulkReleaseStatus,
  requestCombinedPackaging,
  fetchReleaseStatusCounts,
} from "../../../apis/apisShipments";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Flex,
  Space,
  DatePicker,
  Button,
  message,
  Tag,
  Input,
  Drawer,
  Slider,
  Typography,
  Tooltip,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import style from "../../customer/Shipment.module.css";
import StatusCard from "../../../components/Cards/StatusCard";
import StatusChangeButton from "../../../components/Buttons/StatusChangeButton";
import locale from "antd/es/date-picker/locale/ko_KR";
const { RangePicker } = DatePicker;

import useAuthStore from "../../../stores/useAuthStore";
import EasyShipmentDetail from "./EasyShipmentDetail";
import { useFontSizeStore } from "../../../stores/fontSizeStore";

const { Text } = Typography;

const EasyShipment = () => {
  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [joinForm, setJoinForm] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const searchInput = useRef(null);
  const tableRef = useRef();

  const { username } = useAuthStore();
  const { tableFontSize, setTableFontSize } = useFontSizeStore();

  const getTableCellStyle = () => ({
    fontSize: `${tableFontSize}px`,
  });

  useEffect(() => {
    fetchShipments();
    fetchStatusCounts();
  }, [pagination.current, pagination.pageSize, joinForm]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const fetchShipments = async () => {
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

      const response = await fetchReleases(params);

      let isServerUnstable = false;
      const transformedOrders = response.content.map(order => {
        const productOrderList = order.productOrderList?.productOrderList || "null";
        const recipient = order.recipient;
        let productName = "";
        let isMemberInfoAvailable = true;
        let isProductInfoAvailable = true;

        if (productOrderList && productOrderList.length > 0) {
          productName = `${productOrderList[0].name}`;

          if (productOrderList.length > 1) {
            productName += ` 외 ${productOrderList.length - 1}건`;
          }

          // 서버 연결 상태 확인
          isMemberInfoAvailable = productOrderList.every(
            product => product.availableMemberInformation
          ); //  모든 상품에 대해...
          isProductInfoAvailable = productOrderList.every(
            product => product.availableProductInformation
          );

          if (!isMemberInfoAvailable || !isProductInfoAvailable) {
            isServerUnstable = true;
          }
        }
        return {
          holdReason: order.holdReason || "",

          orderId: order.orderId.toString() || "",
          productName: !isProductInfoAvailable ? productName || "" : "확인중",
          startDeliveryDate: order.startDeliveryDate,
          releaseStatus: order.statusName?.toString() || "",
          productOrderList: productOrderList,
          recipient: recipient.recipient,
          recipientAddress: recipient.recipientAddress,
          recipientPhoneNumber: recipient.recipientPhoneNumber,
          memo: order.memo || "",
        };
      });

      setReleases(transformedOrders);
      setIsServerUnstable(isServerUnstable);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("출고 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const customerId = 1;
      const response = await fetchReleaseStatusCounts(customerId);
      if (response) {
        console.log("Status counts response:", response);
        const counts = {};
        response.forEach(item => {
          counts[item.statusName] = item.count;
        });
        setStatusCount(counts);
      } else {
        console.error("No response received for status counts.");
      }
    } catch (error) {
      message.error("상태별 개수를 불러오는데 실패했습니다.");
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
    fetchShipments();
  };

  console.log("release:", releases);

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
            Reset
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
        const dateValue = itemValue.toISOString().split("T")[0];
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
      releaseStatus: filters.releaseStatus ? filters.releaseStatus[0] : null,
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

    const selectedReleases = releases.filter(release => selectedRowKeys.includes(release.orderId));

    if (status === "RELEASE_COMPLETED") {
      const missingDeliveryDates = selectedReleases.filter(release => !release.startDeliveryDate);
      if (missingDeliveryDates.length > 0) {
        await Swal.fire({
          title: "배송시작일 미입력",
          text: "배송시작일을 선택해주세요",
          icon: "warning",
          confirmButtonText: "확인",
        });
        return;
      }
    }

    const isValidStatus = selectedReleases.every(release => {
      if (status === "RELEASE_COMPLETED") {
        if (release.releaseStatus === "RELEASE_COMPLETED") {
          return false;
        }
        return true;
      }

      if (status === "HOLD_RELEASE" && release.releaseStatus === "RELEASE_COMPLETED") {
        return false;
      }
      if (
        status === "COMBINED_PACKAGING_COMPLETED" &&
        release.releaseStatus !== "AWAITING_RELEASE"
      ) {
        return false;
      }
      return true;
    });

    if (!isValidStatus) {
      const statusText = getStatusText(status);
      message.error(`해당 주문건의 출고 상태는 ${statusText} 상태로 변경할 수 없습니다.`);
      return;
    }

    try {
      if (selectedRowKeys.length === 1) {
        await updateReleaseStatus(selectedRowKeys[0], status);
      } else {
        await updateBulkReleaseStatus(selectedRowKeys, status);
      }
      message.success("출고 상태가 성공적으로 변경되었습니다.");
      fetchShipments();
      setSelectedRowKeys([]);
    } catch (error) {
      message.error("출고 상태 변경에 실패했습니다.");
    }
  };

  const onHandleCombinedPackaging = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("합포장할 주문을 선택해주세요.");
      return;
    }

    const selectedReleases = releases.filter(release => selectedRowKeys.includes(release.orderId));
    const isValid = selectedReleases.every(
      (release, _, arr) =>
        release.memberId === arr[0].memberId &&
        release.startDeliveryDate === arr[0].startDeliveryDate &&
        release.recipientAddress === arr[0].recipientAddress &&
        release.releaseStatus === "AWAITING_RELEASE" // 출고대기 상태인 주문만 합포장 가능
    );

    if (!isValid) {
      message.error(
        "선택한 주문들의 회원 ID, 배송 시작일, 배송지가 모두 동일하고 출고대기 상태여야 합니다."
      );
      return;
    }

    const combinedPackagingInfo = {
      orderIds: selectedRowKeys,
      memberId: selectedReleases[0].memberId,
      startDeliveryDate: selectedReleases[0].startDeliveryDate,
      recipientAddress: selectedReleases[0].recipientAddress,
      deliveryFee: 3000, // 배송비 정보 추가
    };

    Swal.fire({
      title: "합포장 신청",
      html: `
        <div style="text-align: right; margin-bottom: 10px;">배송비: ${combinedPackagingInfo.deliveryFee}원</div>
        <div style="text-align: left; margin-bottom: 10px;">
          선택된 주문 ID:<br/>
          ${combinedPackagingInfo.orderIds.join("<br/>")}
        </div>
        <div>주문건들이 합포장되어 출고됩니다.</div>
      `,
      showCancelButton: true,
      confirmButtonText: "신청",
      cancelButtonText: "취소",
    }).then(result => {
      if (result.isConfirmed) {
        requestCombinedPackaging(combinedPackagingInfo.orderIds)
          .then(() => {
            message.success("합포장 신청이 완료되었습니다.");
            fetchShipments();
            setSelectedRowKeys([]);
          })
          .catch(error => {
            console.error("합포장 신청 실패:", error);
            message.error("합포장 신청에 실패했습니다.");
          });
      }
    });
  };

  useEffect(() => {
    if (!fetchShipments.length > 0) {
      if (isServerUnstable) {
        message.warning("일부 주문에서 서버 연결이 불안정합니다.");
      }
    }
  }, [isServerUnstable]);

  const onRow = record => {
    return {
      onClick: () => {
        setSelectedShipment(record);
        setDrawerVisible(true);
      },
    };
  };

  const columns = [
    {
      title: "주문ID",
      dataIndex: "orderId",
      key: "orderId",
      filteredValue: joinForm.orderId ? [joinForm.orderId] : null,
      ...getColumnSearchProps("orderId"),
      width: "15%",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "회원명",
      dataIndex: "recipient",
      key: "recipient",
      filteredValue: joinForm.memberName ? [joinForm.recipient] : null,
      ...getColumnSearchProps("recipient"),
      width: "8%",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "휴대전화",
      dataIndex: "recipientPhoneNumber",
      key: "recipientPhoneNumber",
      filteredValue: joinForm.memberPhoneNumber ? [joinForm.recipientPhoneNumber] : null,
      ...getColumnSearchProps("recipientPhoneNumber"),
      width: "15%",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "배송시작일",
      dataIndex: "startDeliveryDate",
      key: "startDeliveryDate",
      filteredValue: joinForm.startDeliveryDate ? [joinForm.startDeliveryDate] : null,
      ...getColumnSearchProps("startDeliveryDate"),
      width: "15%",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "주문상품",
      dataIndex: "productName",
      key: "productName",
      filteredValue: joinForm.productName ? [joinForm.productName] : null,
      ...getColumnSearchProps("productName"),
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "출고상태",
      dataIndex: "releaseStatus",
      key: "releaseStatus",
      filters: [
        { text: "출고대기", value: "AWAITING_RELEASE" },
        { text: "출고완료", value: "RELEASE_COMPLETED" },
        { text: "출고보류", value: "HOLD_RELEASE" },
        { text: "합포장완료", value: "COMBINED_PACKAGING_COMPLETED" },
      ],
      filteredValue: joinForm.releaseStatus ? [joinForm.releaseStatus] : null,
      onFilter: (value, record) => record.releaseStatus === value,
      render: status => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
      width: "10%",
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
  ];

  const getStatusColor = status => {
    const colors = {
      AWAITING_RELEASE: "#C77C1B",
      RELEASE_COMPLETED: "#878987",
      HOLD_RELEASE: "#4D7D9E",
      COMBINED_PACKAGING_COMPLETED: "#427870",
    };
    return colors[status] || "default";
  };

  const getStatusText = status => {
    const texts = {
      AWAITING_RELEASE: "출고대기",
      RELEASE_COMPLETED: "출고완료",
      HOLD_RELEASE: "출고보류",
      COMBINED_PACKAGING_COMPLETED: "합포장완료",
    };
    return texts[status] || status;
  };

  return (
    <div>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap='small' wrap>
          <h2>출고관리</h2>
        </Flex>
      </Flex>
      <Flex gap='small' align='center' justify='end'>
        <Flex gap='small' wrap>
          {[
            "AWAITING_RELEASE",
            "RELEASE_COMPLETED",
            "HOLD_RELEASE",
            "COMBINED_PACKAGING_COMPLETED",
          ].map(status => (
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
        <Flex gap='small' align='center' justify='space-between'>
          <Flex gap='small' wrap>
            <Flex gap='small'>
              <Space align='center'>검색기간</Space>
              <RangePicker
                value={dateRange}
                onChange={onHandleRangePickerChange}
                locale={locale}
                allowClear
              />
            </Flex>
            <Button onClick={onHandleReset}>정렬 초기화</Button>
          </Flex>
          <Flex gap='small' align='center' style={{ marginRight: "50px" }}>
            <Text strong>글꼴 크기:</Text>
            <Slider
              min={12}
              max={30}
              value={tableFontSize}
              onChange={setTableFontSize}
              style={{ width: "200px" }}
            />
          </Flex>
          <Flex gap='small' wrap>
            <Space align='center'>출고상태변경</Space>
            <Tooltip title={`출고 대기(보류) → 출고 완료`} color={"#00835F"} key={"#00835F"}>
              <Button onClick={() => onHandleStatusChange("RELEASE_COMPLETED")}>
                {"출고완료"}
              </Button>
            </Tooltip>
            <Tooltip title={`출고 대기 → 출고 보류`} color={"#00835F"} key={"#00835F"}>
              <Button onClick={() => onHandleStatusChange("HOLD_RELEASE")}>{"출고보류"}</Button>
            </Tooltip>
            <Tooltip
              title={`배송 시작일, 배송지가 같은 출고대기 상품을 합포장`}
              color={"#00835F"}
              key={"#00835F"}>
              <Button onClick={onHandleCombinedPackaging}>{"합포장요청"}</Button>
            </Tooltip>
          </Flex>
        </Flex>
        <br />
        <Table
          columns={columns}
          dataSource={releases}
          rowKey='orderId'
          pagination={pagination}
          loading={loading}
          onChange={onHandleTableChange}
          rowSelection={rowSelection}
          onRow={onRow}
          style={{ width: "100%", height: "400px" }}
          scroll={{ x: "100%", y: 300 }}
        />
      </Flex>
      <Button
        onClick={onHandleCombinedPackaging}
        style={{
          backgroundColor: "#FFEDB1",
          opacity: 0.8,
          border: "1px solid #FFF4D0",
          color: "#F09534",
        }}>
        합포장 요청
      </Button>
      <Drawer
        width={800}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title='출고 상세 정보'>
        {selectedShipment && (
          <EasyShipmentDetail
            shipmentDetail={selectedShipment}
            productOrderList={selectedShipment.productOrderList}
          />
        )}
      </Drawer>
    </div>
  );
};

export default EasyShipment;
