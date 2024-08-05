import { Form, Card, Row, Col, Typography, Image, Button, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import {
  getProductByAgeRange,
  getProductByGeneral,
  getProductByManTop3,
  getProductByRegular,
  getProductByWomanTop3,
} from "../../../apis/apisStatistics";
import useAuthStore from "../../../stores/useAuthStore";
import PieChart from "../../../components/Chart/PieChart";
import BarChart from "../../../components/Chart/BarChart";

const { Title, Text } = Typography;

const EasyStatistics = () => {
  const [form] = Form.useForm();
  const [manTop3, setManTop3] = useState([]);
  const [womanTop3, setWomanTop3] = useState([]);
  const [productsByAge, setProductsByAge] = useState({});
  const [productsByGeneral, setProductsByGeneral] = useState([]);
  const [productsByRegular, setProductsByRegular] = useState([]);
  const { username } = useAuthStore();
  const customerId = String(username);
  console.log(customerId);

  //파이차트 데이터
  const transformData = data => {
    const total = data.reduce((acc, item) => acc + item.orderCount, 0);
    return data.map(item => ({
      id: item.productName,
      label: item.productName,
      value: item.orderCount,
    }));
  };

  useEffect(() => {
    const fetchTop3Products = async () => {
      try {
        const [manTop3Response, womanTop3Response] = await Promise.all([
          getProductByManTop3(customerId),
          getProductByWomanTop3(customerId),
        ]);

        setManTop3(manTop3Response);
        setWomanTop3(womanTop3Response);
      } catch (error) {
        console.error("Error fetching top 3 products:", error);
      }
    };

    const fetchProductsByAge = async () => {
      const ageRanges = [20, 30, 40, 50];
      const responses = await Promise.all(
        ageRanges.map(ageRange => getProductByAgeRange(customerId, ageRange))
      );
      const products = ageRanges.reduce((acc, ageRange, index) => {
        acc[ageRange] = responses[index];
        return acc;
      }, {});
      setProductsByAge(products);
    };

    const fetchProductsByOrderType = async () => {
      try {
        const [generalResponse, regularResponse] = await Promise.all([
          getProductByGeneral(customerId),
          getProductByRegular(customerId),
        ]);

        setProductsByGeneral(generalResponse);
        setProductsByRegular(regularResponse);
      } catch (error) {
        console.error("Error fetching top 3 products:", error);
      }
    };

    fetchTop3Products();
    fetchProductsByAge();
    fetchProductsByOrderType();
  }, []);

  console.log(productsByGeneral);
  console.log(productsByRegular);

  const cardStyle = {
    marginBottom: "32px",
    border: "2px solid #d9d9d9",
    borderRadius: "8px",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
  };

  const boxStyle = {
    display: "inline-block",
    padding: "8px 16px",
    border: "2px solid #d9d9d9",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    marginBottom: "16px",
    fontSize: "18px",
  };

  const boxStyle2 = {
    display: "inline-block",
    padding: "4px",
    border: "1px solid #d9d9d9",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    height: "fit-content",
  };

  const itemStyle = {
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    color: "#333",
  };

  const renderProduct = (product, index) => {
    const rankEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

    return (
      <Col span={8}>
        <div
          style={{
            border: "2px solid #d9d9d9",
            borderRadius: "16px",
            // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            marginBottom: "16px",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "16px",
            }}>
            <Text style={{ fontSize: "36px", marginRight: "16px" }}>{rankEmoji}</Text>
            <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
              상품ID: {product.productId}
            </Text>
          </div>
          <Image
            src={product.image}
            height={200}
            style={{
              width: "100%",
              borderRadius: "16px",
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginBottom: "16px",
              objectFit: "cover",
            }}
          />
          <div style={{ fontSize: "18px" }}>
            <Text
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
              }}>
              {product.productName}
            </Text>
            <Text style={{ display: "block", marginBottom: "8px" }}>{product.categoryName}</Text>
            <Text style={{ display: "block", marginBottom: "8px" }}>
              주문수: {product.orderCount}
            </Text>
            <Text style={{ display: "block" }}>⭐ {product.averageScore}</Text>
          </div>
        </div>
      </Col>
    );
  };

  const renderAgeRangeProduct = (ageRange, products, isLastColumn) => {
    const ageRangeColors = {
      20: "#006400", // 진한 녹색
      30: "#00008B", // 진한 파란색
      40: "#8B4513", // 갈색
      50: "#800000", // 진한 빨간색
    };

    if (!products || products.length === 0) {
      return (
        <Col span={24}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...boxStyle, backgroundColor: ageRangeColors[ageRange], color: "white" }}>
              <Text style={{ fontSize: "22px", fontWeight: "bold", color: "white" }}>
                {ageRange}대 - 데이터 없음
              </Text>
            </div>
          </div>
        </Col>
      );
    }

    return (
      <Col span={24} style={{ marginBottom: "32px" }}>
        <div
          style={{
            ...boxStyle,
            backgroundColor: ageRangeColors[ageRange],
            color: "white",
            marginBottom: "16px",
          }}>
          <Text style={{ fontSize: "22px", fontWeight: "bold", color: "white" }}>{ageRange}대</Text>
        </div>
        <Row gutter={[24, 24]}>
          {products.map((product, index) => (
            <Col span={12} key={product.productId}>
              <Card
                hoverable
                cover={
                  <Image
                    src={product.image}
                    alt={product.productName}
                    style={{
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                }>
                <Card.Meta
                  title={
                    <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                      {formatProductName(product.productName)}
                    </Text>
                  }
                  description={
                    <>
                      <Text style={{ fontSize: "18px", display: "block" }}>
                        주문수: {product.orderCount}
                      </Text>
                      <Text style={{ fontSize: "18px", display: "block" }}>
                        ⭐ {product.averageScore}
                      </Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    );
  };

  //상품이름 내려쓰기
  function formatProductName(name) {
    const parts = name.split(/([,!~])/g);
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {part === "," || part === "!" ? <br /> : ""}
      </React.Fragment>
    ));
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 18,
          colorPrimary: "#1890ff",
        },
      }}>
      <div style={{ padding: "32px", fontSize: "18px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* <Title level={2} style={{ marginBottom: "32px", fontSize: "36px" }}>
          통계 관리
        </Title> */}
        <Form form={form} layout='vertical'>
          <div
            style={{
              ...boxStyle,
              backgroundColor: "#2A52BE",
              color: "white",
              marginBottom: "24px",
            }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
              남성 선호 식품
            </Text>
          </div>
          <Row gutter={[24, 24]}>
            {manTop3.map((product, index) => renderProduct(product, index))}
          </Row>
          <div
            style={{
              ...boxStyle,
              backgroundColor: "#FF5C5C",
              color: "white",
              marginTop: "32px",
              marginBottom: "24px",
            }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
              여성 선호 식품
            </Text>
          </div>
          <Row gutter={[24, 24]} style={{ marginBottom: "50px" }}>
            {womanTop3.map((product, index) => renderProduct(product, index))}
          </Row>

          <Card title={<Text style={titleStyle}>연령대별 선호 식품</Text>} style={cardStyle}>
            {[20, 30, 40, 50].map(ageRange =>
              renderAgeRangeProduct(ageRange, productsByAge[ageRange])
            )}
          </Card>

          <Row gutter={32}>
            <Col span={24} lg={12}>
              <Card title={<Text style={titleStyle}>일반주문 판매량</Text>} style={cardStyle}>
                <PieChart data={transformData(productsByGeneral)} />
              </Card>
            </Col>
            <Col span={24} lg={12}>
              <Card title={<Text style={titleStyle}>정기주문 판매량</Text>} style={cardStyle}>
                <PieChart data={transformData(productsByRegular)} />
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default EasyStatistics;
