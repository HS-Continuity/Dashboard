import React, { useState, useEffect } from "react";
import { Button, Flex } from "antd";
import { AudioOutlined } from "@ant-design/icons";

const VoiceWaveButton = ({ isListening, onStart, onStop }) => {
  const [waveHeights, setWaveHeights] = useState([10, 10, 10, 10, 10]);

  useEffect(() => {
    let animationFrame;
    if (isListening) {
      const animate = () => {
        setWaveHeights(prevHeights =>
          prevHeights.map(height => {
            const newHeight = height + (Math.random() - 0.5) * 2;
            return Math.max(5, Math.min(15, newHeight));
          })
        );
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isListening]);

  return (
    <Button
      icon={<AudioOutlined />}
      onMouseDown={onStart}
      onMouseUp={onStop}
      onTouchStart={onStart}
      onTouchEnd={onStop}
      type={isListening ? "primary" : "default"}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
        padding: "8px 15px",
        height: "auto",
        minWidth: "120px",
      }}>
      <Flex vertical align='center' style={{ gap: "5px" }}>
        <span>{isListening ? "음성 인식 중" : "음성 명령"}</span>
        {isListening && (
          <svg width='50' height='20' viewBox='0 0 50 20'>
            {waveHeights.map((height, index) => (
              <rect
                key={index}
                x={index * 10}
                y={10 - height / 2}
                width='8'
                height={height}
                fill={isListening ? "white" : "#1890ff"}
              />
            ))}
          </svg>
        )}
      </Flex>
    </Button>
  );
};

export default VoiceWaveButton;
