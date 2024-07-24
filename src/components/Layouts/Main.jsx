import { useState } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import Sidenav from "./Sidenav";
import MainHeader from "./MainHeader";
const { Content } = Layout;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sidenav collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <Layout>
        <MainHeader collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Main;
