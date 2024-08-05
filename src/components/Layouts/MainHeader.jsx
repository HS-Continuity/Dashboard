import {
  Button,
  Flex,
  theme,
  Slider,
  Space,
  Menu,
  Dropdown,
  Badge,
  Avatar,
  Typography,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useFontSizeStore } from "../../stores/fontSizeStore";
import useAuthStore from "../../stores/useAuthStore";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

// const menuItems = [
//   {
//     key: 'logout',
//     icon: <LogoutOutlined />,
//     label: 'Logout',
//     onClick: handleLogout
//   },
// ];

const MainHeader = ({ collapsed, onCollapse }) => {
  const { username, logout } = useAuthStore();
  console.log("username: ", username);

  const { fontSize, setFontSize } = useFontSizeStore();
  const [sliderValue, setSliderValue] = useState(fontSize);
  const navigate = useNavigate();

  const handleFontSizeChange = value => {
    setSliderValue(value);
  };

  const handleFontSizeAfterChange = value => {
    setFontSize(value);
  };

  
  const handleEasyViewMode = () => {
    navigate(`/easy${location.pathname}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        // backgroundColor: '#FAF6F0',
        //backgroundColor: '#F4EEED',
        backgroundColor: "#ffffff",
        //background: colorBgContainer,
        height: "55px", //  header 사이즈 조정
        lineHeight: "55px", //  header 내의 요소들 사이즈 조정 (height와 같은 값으로 변경)
      }}>
      <Flex justify='space-between'>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          style={{
            fontSize: "16px",
            width: 50,
            height: 50,
          }}
        />
        <Flex align='center' gap='large'>
          <Button onClick={handleEasyViewMode}>쉽게보기</Button>
          <Flex>
          <span style={{ marginRight: "10px" }}>{username}님</span>
          <Space style={{ marginRight: "16px" }}>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Badge dot>
                <Avatar
                  size='large'
                  max={{
                    count: 2,
                    style: { color: "#f56a00", backgroundColor: "#fde3cf", cursor: "pointer" },
                    popover: { trigger: "click" },
                  }}>
                  <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                </Avatar>
              </Badge>
            </Dropdown>
          </Space>
          </Flex>
          {/* <span style={{ marginRight: "10px" }}>{username}님</span>
          <Space style={{ marginRight: "16px" }}>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Badge dot>
                <Avatar
                  size='large'
                  max={{
                    count: 2,
                    style: { color: "#f56a00", backgroundColor: "#fde3cf", cursor: "pointer" },
                    popover: { trigger: "click" },
                  }}>
                  <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                </Avatar>
              </Badge>
            </Dropdown>
          </Space> */}
        </Flex>
      </Flex>
    </Header>
  );
};

export default MainHeader;
