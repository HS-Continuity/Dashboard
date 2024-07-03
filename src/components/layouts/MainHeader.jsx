import React from "react";
import { Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";

const MainHeader = ({ collapsed, onCollapse }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onCollapse}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
    </Header>
  );
};

export default MainHeader;
