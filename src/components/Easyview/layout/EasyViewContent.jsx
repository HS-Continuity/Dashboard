import React from "react";
import { Button, Typography, Space } from "antd";
import { mainMenuItems, subMenuItems } from "./MenuItems";
const { Text } = Typography;

const EasyViewContent = ({
  currentStep,
  breadcrumb,
  handleBack,
  handleMenuClick,
  speakText,
  isSpeechEnabled,
  style,
}) => {
  const renderButtons = () => {
    const items = currentStep === "main" ? mainMenuItems : subMenuItems[currentStep] || [];
    const itemCount = items.length;

    return items.map(item => (
      <Button
        key={item.key}
        onClick={() => handleMenuClick(item.key)}
        onMouseEnter={() => isSpeechEnabled && speakText(item.label)}
        style={{
          width: itemCount === 2 ? "100%" : "100%", // width 조정
          height: itemCount <= 3 ? "456px" : "228px", // height 조정
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s ease",
          background: "#ffffff",
          border: "2px solid #d9d9d9",
        }}
        className='easy-view-button'>
        {item.icon && React.isValidElement(item.icon) ? (
          React.cloneElement(item.icon, { className: "easyIcon" })
        ) : (
          <div style={{ width: "100px", height: "100px" }} />
        )}
        <Text
          style={{
            fontSize: "40px",
            marginTop: itemCount < 4 ? "-100px" : "",
          }}>
          {item.label}
        </Text>
      </Button>
    ));
  };

  return (
    <div style={{ ...style, padding: "20px" }}>
      <Space
        direction='vertical'
        style={{ width: "100%", marginBottom: "20px", alignItems: "center" }}>
        <Button
          onClick={handleBack}
          style={{ fontSize: "24px", height: "auto", padding: "10px 30px" }}>
          뒤로 가기
        </Button>
        <Text style={{ fontSize: "24px" }}>{breadcrumb.join(" > ")}</Text>
      </Space>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${currentStep === "main" ? 4 : subMenuItems[currentStep]?.length || 3}, 1fr)`, // gridTemplateColumns 조정
          gap: "20px",
          justifyContent: "center",
        }}>
        {renderButtons()}
      </div>

      <style>
        {`
          .easy-view-button:hover {
            background-color: #ffe58f !important;
            border-color: #ffd666 !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .easy-view-button:hover .anticon {
            color: #fa8c16;
          }
        `}
      </style>
    </div>
  );
};

export default EasyViewContent;
