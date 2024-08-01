import { Button, Flex, theme, Slider, Space, Menu, Dropdown, Badge, Avatar } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useFontSizeStore } from "../../stores/fontSizeStore";
import useAuthStore from '../../stores/useAuthStore';

import { useState } from "react";

const MainHeader = ({ collapsed, onCollapse }) => {

  const {username} = useAuthStore();
  console.log('username: ', username)

  const { fontSize, setFontSize } = useFontSizeStore();
  const [sliderValue, setSliderValue] = useState(fontSize);

  const handleFontSizeChange = value => {
    setSliderValue(value);
  };

  const handleFontSizeAfterChange = value => {
    setFontSize(value);
  };

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  const menu = (
    <Menu>
      {/* <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item> */}
      {/* <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item> */}
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        padding: 0,
        // backgroundColor: '#FAF6F0',
        //backgroundColor: '#F4EEED',
        backgroundColor: '#ffffff',
        //background: colorBgContainer,
        height: '55px',  //  header 사이즈 조정
        lineHeight: '55px'  //  header 내의 요소들 사이즈 조정 (height와 같은 값으로 변경)
      }}>
      <Flex justify="space-between">
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
        <Flex>
          <span style={{ marginRight: '10px' }}>{username}님</span>
          <Space style={{ marginRight: "16px" }}>
            <Dropdown menu={{ items: menu.children }} trigger={['click']}>
              <Badge dot>
                <Avatar
                  size="large"
                  max={{
                    count: 2,
                    style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer'},
                    popover: { trigger: 'click' },
                  }}
                >
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </Avatar>
              </Badge>
            </Dropdown>
          </Space>
        </Flex>
        {/* <Space style={{ marginRight: "16px" }}>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Badge dot>
              <Avatar
                size="large"
                max={{
                  count: 2,
                  style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer'},
                  popover: { trigger: 'click' },
                }}
              >
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              </Avatar>
            </Badge>
          </Dropdown>
        </Space> */}
      </Flex>
    </Header>
  );
};

export default MainHeader;
