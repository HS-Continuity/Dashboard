import {
  fetchRegularOrderCountsBetweenMonth,
  fetchRegularOrderCountByDate,
} from "../../../apis/apisOrders";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, ConfigProvider, Table, Badge, Calendar, message, Drawer } from "antd";

import locale from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import "../../customer/OrderSubscriptionModule.css";
import useAuthStore from "../../../stores/useAuthStore";

const EasyOrderSubscription = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [monthlyOrderCounts, setMonthlyOrderCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [dailyOrdersPagination, setDailyOrdersPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({}); // 필터링 정보 저장
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 현재 날짜로 초기화
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [panelDate, setPanelDate] = useState(dayjs()); // 현재 패널 날짜 상태 추가
  const [isServerUnstable, setIsServerUnstable] = useState(false);
  const { username } = useAuthStore();

  const fetchMonthlyOrders = async () => {
    setLoading(true);
    try {
      //customerId: String(username),
      //const customerId = 1;  // 실제 사용시 로그인한 고객의 ID를 사용해야 함!!

      const response = await fetchRegularOrderCountsBetweenMonth(
        currentMonth.startOf("month"),
        currentMonth.endOf("month")
        //customerId
      );
      console.log("받아온 데이터: ", response);
      setMonthlyOrderCounts(response);
    } catch (error) {
      console.error("Failed to fetch monthly orders:", error);
      //message.error('주문 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyOrders = async (date, size = 10, page = 1) => {
    setLoading(true);
    try {
      const response = await fetchRegularOrderCountByDate(date, size, page);
      console.log("response: ", response);

      let isServerUnstable = false;
      const transformedOrders = response.content.map(order => {
        const isMemberInfoAvailable = order.availableMemberInformation;
        const isProductInfoAvailable = order.availableProductInformation;

        if (!isMemberInfoAvailable || !isProductInfoAvailable) {
          isServerUnstable = true;
        }

        return {
          ...order,
          productName: isProductInfoAvailable ? order.productName : "불러오는 중..",
          memberId: isMemberInfoAvailable
            ? order.memberInfo?.memberId?.toString() || ""
            : "불러오는 중..",
        };
      });

      setDailyOrders(response.content);
      setDailyOrdersPagination({
        current: page,
        pageSize: size,
        total: response.totalElements || 0,
      });
    } catch (error) {
      console.error("Failed to fetch daily orders: ", error);
      //message.error('일별 주문 데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isServerUnstable) {
      message.warning("일부 서비스에 연결할 수 없습니다. 데이터가 부분적으로 표시될 수 있습니다.");
    }
  }, [isServerUnstable]);

  useEffect(() => {
    fetchMonthlyOrders();
  }, [currentMonth]);

  const cellRender = current => {
    if (!monthlyOrderCounts) return null;

    const ordersForDate = monthlyOrderCounts.filter(
      order =>
        // dayjs(order.START_DATE).format('YYYY-MM-DD') === current.format('YYYY-MM-DD')
        dayjs(order.days).format("YYYY-MM-DD") === current.format("YYYY-MM-DD")
    );

    if (ordersForDate.length === 0) return null;

    const firstOrder = ordersForDate[0];
    const content =
      ordersForDate.length > 1
        ? `${firstOrder.productName} 상품건 외 ${ordersForDate.length - 1}건`
        : firstOrder.productName;

    return (
      <ul className='events'>
        <li>
          <Badge status='processing' text={content} />
        </li>
      </ul>
    );
  };

  const onPanelChange = value => {
    setCurrentMonth(value);
  };

  const onSelectDate = selectedDate => {
    if (selectedDate.isSame(panelDate, "month")) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      console.log("Fetching orders for date:", formattedDate);
      fetchDailyOrders(formattedDate, 10, 1);
      setIsDrawerVisible(true);
    } else {
      setPanelDate(selectedDate);
      setCurrentMonth(selectedDate);
    }
  };

  const handleTableChange = pagination => {
    fetchDailyOrders(selectedDate.format("YYYY-MM-DD"), pagination.pageSize, pagination.current);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const onRow = record => {
    return {
      onClick: () => {
        const basePath = location.pathname.startsWith("/easy") ? "/easy/order" : "/order";
        navigate(`${basePath}/subscription/${record.regularDelivaryApplicationId}`, {
          state: { regularOrderDetail: [record] },
        });
      },
    };
  };

  const columns = [
    {
      title: "정기주문ID",
      dataIndex: "regularDelivaryApplicationId",
      key: "regularDelivaryApplicationId",
      fixed: "left",
      filteredValue: filteredInfo.regularDelivaryApplicationId || null,
      filtered: false,
      width: 50,
    },
    {
      title: "주문상품",
      dataIndex: "productName",
      key: "productName",
      fixed: "left",
      filteredValue: filteredInfo.productName || null,
      filtered: false,
      width: 140,
    },
  ];

  return (
    <div>
      <Flex gap='small' align='center' justify='space-between'>
        <Flex gap='small' wrap>
          <h2>정기주문관리</h2>
        </Flex>
      </Flex>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: "#FFB30D", // today cell color
            borderRadius: 2,

            // Alias Token
            colorBgContainer: "#ffffff", // calendar bg color
            fontSizeSM: 12,
          },
        }}
        locale={locale}>
        <Calendar
          cellRender={cellRender}
          onSelect={onSelectDate}
          value={currentMonth}
          onPanelChange={onPanelChange}
          locale={locale}
          mode='month'
          //style={{ height: '100%' }}
        />
      </ConfigProvider>

      <Drawer
        title={selectedDate.format("YYYY-MM-DD")}
        placement='right'
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        width={800}>
        {dailyOrders.length > 0 ? (
          <>
            <Table
              size='small'
              columns={columns}
              dataSource={dailyOrders}
              rowKey='regularDelivaryApplicationId'
              pagination={{
                ...dailyOrdersPagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={handleTableChange}
              onRow={onRow}
            />
          </>
        ) : (
          <h2>주문건이 없습니다.</h2>
        )}
      </Drawer>
    </div>
  );
};

export default EasyOrderSubscription;
