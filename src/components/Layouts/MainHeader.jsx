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
import { fetchCustomerDetail } from "../../apis/apisMain";

import { useState, useEffect } from "react";
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

  const { fontSize, setFontSize } = useFontSizeStore();
  const [sliderValue, setSliderValue] = useState(fontSize);
  const [customerInfo, setCustomerInfo] = useState(null);
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

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (username) {
        try {
          const data = await fetchCustomerDetail(username);
          setCustomerInfo(data);
        } catch (error) {
          console.error('Failed to fetch customer info:', error);
        } 
      }
    };

    fetchCustomerInfo();
  }, [username]);

  return (
    <Header
      style={{
        padding: 0,
        backgroundColor: "#ffffff",
        height: "55px",
        lineHeight: "55px",
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
          <span style={{ marginRight: "10px" }}>님</span>
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
        </Flex>
      </Flex>
    </Header>
  );
};

export default MainHeader;
