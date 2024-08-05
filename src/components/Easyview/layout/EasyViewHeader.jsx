import React from "react";
import { Layout, Button, Typography, Space, Switch } from "antd";
import { Link } from "react-router-dom";
import styles from "./EasyViewHeader.module.css";

const { Header } = Layout;
const { Title } = Typography;

const EasyViewHeader = ({
  isLargeCursor,
  setIsLargeCursor,
  isSpeechEnabled,
  setIsSpeechEnabled,
  speakText,
  navigate,
  location,
  isContentVisible,
  toggleContentVisibility,
}) => {
  const handleSpeechToggle = checked => {
    setIsSpeechEnabled(checked);
    if (checked) {
      speakText("음성 안내가 활성화되었습니다.");
    }
  };

  const handleSendNormalPage = () => {
    if (location.pathname === "/easy") {
      window.location.href = "http://localhost:5173";
    } else {
      navigate(location.pathname.replace("/easy", ""));
    }
  };

  return (
    <Header className={styles.bgGradient}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}>
        <div style={{ flex: 1 }}>
          <Link to='/easy'>
            <Title level={4} style={{ margin: 0, color: "white", fontSize: "30px" }}>
              연이음
            </Title>
          </Link>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Space size='large'>
            <Switch
              className={styles.largeSwitch}
              checkedChildren='마우스 안내 끄기'
              unCheckedChildren='마우스 안내 켜기'
              checked={isLargeCursor}
              onChange={setIsLargeCursor}
            />
            <Switch
              className={styles.largeSwitch}
              checkedChildren='음성 안내 끄기'
              unCheckedChildren='음성 안내 켜기'
              checked={isSpeechEnabled}
              onChange={handleSpeechToggle}
            />
            <Button onClick={handleSendNormalPage} size='large'>
              자세히 보기
            </Button>
          </Space>
        </div>
      </div>
      <Button
        onClick={toggleContentVisibility}
        size='large'
        style={{
          fontSize: "16px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}>
        {isContentVisible ? "메뉴 숨기기" : "메뉴 보이기"}
      </Button>
    </Header>
  );
};

export default EasyViewHeader;
