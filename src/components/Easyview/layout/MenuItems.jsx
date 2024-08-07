import React from "react";
import {
  UserOutlined,
  ShopOutlined,
  OrderedListOutlined,
  InboxOutlined,
  BarChartOutlined,
  CarOutlined,
  GiftOutlined,
  DollarOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";

export const mainMenuItems = [
  { key: "member", icon: <UserOutlined className='easyIcon' />, label: "회원" },
  { key: "product", icon: <ShopOutlined className='easyIcon' />, label: "식품" },
  { key: "inventory", icon: <InboxOutlined className='easyIcon' />, label: "재고" },
  { key: "promotion", icon: <GiftOutlined className='easyIcon' />, label: "광고" },
  { key: "order", icon: <DollarOutlined className='easyIcon' />, label: "주문" },
  { key: "shipment", icon: <CodeSandboxOutlined className='easyIcon' />, label: "출고" },
  { key: "delivery", icon: <CarOutlined className='easyIcon' />, label: "배송" },
  { key: "statistics", icon: <BarChartOutlined className='easyIcon' />, label: "통계" },
];

export const subMenuItems = {
  product: [
    { key: "general", label: "일반 식품" },
    { key: "eco", label: "친환경 식품" },
    { key: "timesale", label: "반짝할인 식품" },
  ],
  order: [
    { key: "general", label: "일반 주문" },
    { key: "subscription", label: "정기 주문" },
  ],
  // delivery: [{ key: "status", label: "배송 상태 관리" }],
};
