import { useEffect, useState } from "react";
import {
  ShoppingCartOutlined,
  SignatureOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  ShopOutlined,
  OrderedListOutlined,
  InboxOutlined,
  BarChartOutlined,
  CarOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, useLocation } from "react-router-dom";
import Title from "antd/es/typography/Title";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidenav = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const [openKeys, setOpenKeys] = useState([]);

  // Token 값으로 userRole 불러오기
  const userRole = "customer"; // 또는 "customer"

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const pathname = location.pathname;
    const key = getKeyFromPath(pathname);
    setSelectedKeys([key]);

    const parentKey = key.split("-")[0];
    if (parentKey !== key) {
      setOpenKeys([parentKey]);
    }
  }, [location]);

  const getKeyFromPath = pathname => {
    const pathToKey = {
      "/": "1",
      "/admin/member": "2",
      "/admin/customer": "3",
      "/admin/product": "4-1",
      "/admin/approval": "4-2",
      "/admin/category": "4-3",
      "/admin/review": "5",
      "/admin/statistics": "6",
      "/member/manage": "12-1",
      "/member/address": "12-2",
      "/member/payment": "12-3",
      "/product/general": "13-1",
      "/product/eco": "13-2",
      "/product/timesale": "13-3",
      "/order/general": "14-1",
      "/order/subscription": "14-2",
      "/inventory": "15",
      "/statistics": "16",
      "/delivery": "17-1",
      "/promotion": "18",
    };
    return pathToKey[pathname] || "1";
  };

  const adminMenuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to='/'>메인</Link>,
    },
    {
      key: "2",
      icon: <SmileOutlined />,
      label: <Link to='/admin/member'>회원 관리</Link>,
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: <Link to='/admin/customer'>고객 관리</Link>,
    },
    {
      key: "4",
      icon: <ShoppingCartOutlined />,
      label: "식품 관리",
      children: [
        {
          key: "4-1",
          label: <Link to='/admin/product'>식품 관리</Link>,
        },
        {
          key: "4-2",
          label: <Link to='/admin/approval'>신청 승인 관리</Link>,
        },
        {
          key: "4-3",
          label: <Link to='/admin/category'>카테고리 관리</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <SignatureOutlined />,
      label: <Link to='/admin/review'>리뷰 관리</Link>,
    },
    {
      key: "6",
      icon: <BarChartOutlined />,
      label: <Link to='/admin/statistics'>통계 관리</Link>,
    },
  ];

  const customerMenuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to='/'>메인</Link>,
    },
    {
      key: "12",
      icon: <UserOutlined />,
      label: "회원",
      children: [
        {
          key: "12-1",
          label: <Link to='/member/manage'>회원 관리</Link>,
        },
        {
          key: "12-2",
          label: <Link to='/member/address'>주소지 관리</Link>,
        },
        {
          key: "12-3",
          label: <Link to='/member/payment'>결제 수단 관리</Link>,
        },
      ],
    },
    {
      key: "13",
      icon: <ShopOutlined />,
      label: "식품",
      children: [
        {
          key: "13-1",
          label: <Link to='/product/general'>일반 식품 관리</Link>,
        },
        {
          key: "13-2",
          label: <Link to='/product/eco'>친환경 식품 관리</Link>,
        },
        {
          key: "13-3",
          label: <Link to='/product/timesale'>타임세일 식품 관리</Link>,
        },
      ],
    },
    {
      key: "14",
      icon: <OrderedListOutlined />,
      label: "주문",
      children: [
        {
          key: "14-1",
          label: <Link to='/order/general'>일반 결제 관리</Link>,
        },
        {
          key: "14-2",
          label: <Link to='/order/subscription'>정기 결제 관리</Link>,
        },
      ],
    },
    {
      key: "15",
      icon: <InboxOutlined />,
      label: <Link to='/inventory'>재고</Link>,
    },
    {
      key: "16",
      icon: <BarChartOutlined />,
      label: <Link to='/solution'>통계</Link>,
    },
    {
      key: "17",
      icon: <CarOutlined />,
      label: "배송",
      children: [
        {
          key: "17-1",
          label: <Link to='/delivery'>배송 상태 관리</Link>,
        },
      ],
    },
    {
      key: "18",
      icon: <GiftOutlined />,
      label: <Link to='/promotion'>프로모션</Link>,
    },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : customerMenuItems;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{ background: colorBgContainer }}>
      <div className='demo-logo-vertical' />
      <Title level={3}>효성CMS+ 스퀘어</Title>
      <Menu
        theme='light'
        mode='inline'
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidenav;
