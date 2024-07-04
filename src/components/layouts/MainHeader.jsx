import { Button, Slider, Space, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useFontSizeStore } from "../../stores/fontSizeStore";
import { useState } from "react";

const MainHeader = ({ collapsed, onCollapse }) => {
  const { fontSize, setFontSize } = useFontSizeStore();
  const [sliderValue, setSliderValue] = useState(fontSize);

  const handleFontSizeChange = value => {
    setSliderValue(value);
  };

  const handleFontSizeAfterChange = value => {
    setFontSize(value);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}>
      <Space>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Space>
          <span>글자 크기 조절:</span>
          <Slider
            min={14}
            max={24}
            onChange={handleFontSizeChange}
            onChangeComplete={handleFontSizeAfterChange}
            value={sliderValue}
            style={{ width: 200 }}
          />
        </Space>
      </Space>
    </Header>
  );
};

export default MainHeader;
