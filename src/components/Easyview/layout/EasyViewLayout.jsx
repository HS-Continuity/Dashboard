import React, { useState, useCallback, useRef, useEffect } from "react";
import { Layout, Button, message } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useFontSizeStore } from "../../../stores/fontSizeStore";
import { useLargeCursorStore } from "../../../stores/largeCursorStore";
import { useSpeechStore } from "../../../stores/speechStore";
import EasyViewHeader from "./EasyViewHeader";
import EasyViewContent from "./EasyViewContent";
import LargeCursor from "../LargeCursor";
import { mainMenuItems, subMenuItems } from "./MenuItems";
import VoiceWaveButton from "./VoiceWaveButton";

const { Content } = Layout;

const EasyViewLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState("main");
  const [breadcrumb, setBreadcrumb] = useState(["메인"]);
  const { isLargeCursor, setIsLargeCursor } = useLargeCursorStore();
  const { isSpeechEnabled, setIsSpeechEnabled } = useSpeechStore();
  const speechSynthesisRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const savedIsLargeCursor = localStorage.getItem("large-cursor-storage");
    if (savedIsLargeCursor) {
      setIsLargeCursor(JSON.parse(savedIsLargeCursor).state.isLargeCursor);
    }

    if (isSpeechEnabled && "speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    // Web Speech API 지원 확인 및 SpeechRecognition 객체 생성
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "ko-KR";

      recognitionRef.current.onresult = event => {
        const command = event.results[0][0].transcript.toLowerCase();
        message.info(`인식된 명령: ${command}`);
        handleVoiceCommand(command);
      };

      recognitionRef.current.onerror = event => {
        message.error("음성 인식 오류: " + event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      message.error("이 브라우저는 음성 인식을 지원하지 않습니다.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [setIsLargeCursor, isSpeechEnabled]);

  const speakText = useCallback(
    text => {
      if (isSpeechEnabled && speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ko-KR";
        speechSynthesisRef.current.speak(utterance);
      }
    },
    [isSpeechEnabled]
  );

  const handleMenuClick = useCallback(
    key => {
      if (subMenuItems[currentStep]) {
        navigate(`/easy/${currentStep}/${key}`);
        setIsContentVisible(false);
      } else if (subMenuItems[key]) {
        setCurrentStep(key);
        setBreadcrumb([...breadcrumb, mainMenuItems.find(item => item.key === key).label]);
      } else {
        navigate(`/easy/${key}`);
        setIsContentVisible(false);
      }
    },
    [currentStep, breadcrumb, navigate]
  );

  const handleBack = useCallback(() => {
    if (breadcrumb.length > 1) {
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      setCurrentStep(
        newBreadcrumb.length === 1
          ? "main"
          : mainMenuItems.find(item => item.label === newBreadcrumb[newBreadcrumb.length - 1]).key
      );
    }
  }, [breadcrumb]);

  const toggleContentVisibility = useCallback(() => {
    setIsContentVisible(prev => !prev);
  }, []);

  const handleVoiceCommand = useCallback(
    command => {
      const normalizedCommand = command.toLowerCase().replace(/\s+/g, "");

      switch (normalizedCommand) {
        case "회원":
        case "회웜":
        case "훼원":
        case "회운":
          navigate("/easy/member");
          setIsContentVisible(false);
          break;

        case "식품":
        case "식퓸":
        case "식픔":
        case "일반식품":
        case "일발식픔":
        case "일반식푼":
        case "이반식푼":
        case "릴반식푼":
          navigate("/easy/product/general");
          setIsContentVisible(false);
          break;

        case "친환경":
        case "칭환경":
        case "친한경":
        case "칭항경":
        case "친환경식품":
        case "칭환경식품":
        case "친한경식품":
        case "칭항경식품":
          navigate("/easy/product/eco");
          setIsContentVisible(false);
          break;

        case "타임세일":
        case "타임세인":
        case "타인세일":
        case "타임새일":
        case "타임셰일":
        case "타임쉐일":
        case "바짝":
        case "반짠":
        case "반짱":
        case "반짝":
        case "반짝할인":
        case "반짝하린":
        case "반짠하린":
          navigate("/easy/product/timesale");
          setIsContentVisible(false);
          break;

        case "주문":
        case "조문":
        case "주뭄":
        case "주뭉":
        case "일반주문":
        case "일반조문":
        case "일반주뭄":
        case "일반주뭉":
          navigate("/easy/order/general");
          setIsContentVisible(false);
          break;

        case "전기":
        case "정기":
        case "절기":
        case "전기주뭄":
        case "정기쥬문":
        case "정기주뭄":
        case "정기주문":
        case "전기주문":
          navigate("/easy/order/subscription");
          setIsContentVisible(false);
          break;

        case "재고":
        case "쟈고":
        case "자고":
        case "재꼬":
        case "제고":
          navigate("/easy/inventory");
          setIsContentVisible(false);
          break;

        case "배송":
        case "바송":
        case "배손":
        case "애송":
        case "배승":
        case "배성":
        case "배쏭":
        case "배숑":
          navigate("/easy/delivery");
          setIsContentVisible(false);
          break;

        case "출고":
        case "충고":
        case "출구":
        case "춘고":
        case "추고":
        case "촐고":
        case "충구":
        case "쭐고":
          navigate("/easy/shipment");
          setIsContentVisible(false);
          break;

        case "통계":
        case "통개":
        case "통게":
        case "통께":
        case "통예":
        case "톤계":
        case "톤게":
        case "톤개":
          navigate("/easy/statistics");
          setIsContentVisible(false);
          break;

        case "광고":
        case "광꼬":
        case "강고":
        case "강꼬":
        case "관고":
        case "관꼬":
          navigate("/easy/promotion");
          setIsContentVisible(false);
          break;

        default:
          console.log("인식되지 않은 명령어:", command);

          break;
      }
    },
    [navigate]
  );

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
      {isLargeCursor && <LargeCursor />}
      <EasyViewHeader
        isLargeCursor={isLargeCursor}
        setIsLargeCursor={setIsLargeCursor}
        isSpeechEnabled={isSpeechEnabled}
        setIsSpeechEnabled={setIsSpeechEnabled}
        speakText={speakText}
        navigate={navigate}
        location={location}
        isContentVisible={isContentVisible}
        toggleContentVisibility={toggleContentVisibility}
      />
      <Content style={{ position: "relative", overflow: "hidden" }}>
        {isContentVisible && (
          <EasyViewContent
            currentStep={currentStep}
            breadcrumb={breadcrumb}
            handleBack={handleBack}
            handleMenuClick={handleMenuClick}
            speakText={speakText}
            isSpeechEnabled={isSpeechEnabled}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              background: "#ffffff",
              overflowY: "auto",
            }}
          />
        )}
        <div style={{ padding: "24px 50px", backgroundColor: "white" }}>
          <Outlet />
        </div>
        <VoiceWaveButton
          isListening={isListening}
          onStart={startListening}
          onStop={stopListening}
        />
      </Content>
    </Layout>
  );
};

export default EasyViewLayout;
