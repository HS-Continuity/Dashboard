import { useState } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import Sidenav from "./Sidenav";
import MainHeader from "./MainHeader";
const { Content } = Layout;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();
  return (
    <Layout>
      <Sidenav collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <Layout>
        <MainHeader collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
        <Content
          style={{
            //margin: "16px 16px",  //  메인중앙화면 margin에 색(회색)
            padding: '0px 20px 20px 20px',
            // minHeight: 280,
            minHeight: '80vh',
            maxHeight: '100vh',
            backgroundColor: '#ffffff',
            //background: colorBgContainer,
            //borderRadius: borderRadiusLG,
          }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Main;
