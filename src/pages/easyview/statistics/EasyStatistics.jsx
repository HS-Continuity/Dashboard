import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Typography, Image, Button, ConfigProvider } from "antd";
import {
  getProductByAgeRange,
  getProductByGeneral,
  getProductByManTop3,
  getProductByRegular,
  getProductByWomanTop3,
} from "../../../apis/apisStatistics";
import useAuthStore from "../../../stores/useAuthStore";
import PieChart from "../../../components/Chart/PieChart";

const { Text } = Typography;

const EasyStatistics = () => {
  const [form] = Form.useForm();
  const [currentMonth, setCurrentMonth] = useState(3);
  const [manTop3, setManTop3] = useState([]);
  const [womanTop3, setWomanTop3] = useState([]);
  const [productsByAge, setProductsByAge] = useState({});
  const [productsByGeneral, setProductsByGeneral] = useState([]);
  const [productsByRegular, setProductsByRegular] = useState([]);
  const { username } = useAuthStore();
  const customerId = String(username);

  const transformData = data => {
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
          getProductByManTop3(customerId, currentMonth),
          getProductByWomanTop3(customerId, currentMonth),
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
        ageRanges.map(ageRange => getProductByAgeRange(customerId, ageRange, currentMonth))
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
          getProductByGeneral(customerId, currentMonth),
          getProductByRegular(customerId, currentMonth),
        ]);
        setProductsByGeneral(generalResponse);
        setProductsByRegular(regularResponse);
      } catch (error) {
        console.error("Error fetching products by order type:", error);
      }
    };

    fetchTop3Products();
    fetchProductsByAge();
    fetchProductsByOrderType();
  }, [currentMonth, customerId]);

  const handleMonthChange = month => {
    setCurrentMonth(month);
  };

  const cardStyle = {
    marginBottom: "24px",
    border: "1px solid #e8e8e8",
    borderRadius: "4px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    padding: "12px 16px",
    backgroundColor: "#f0f2f5",
    marginBottom: "16px",
    borderRadius: "4px",
  };

  const renderProduct = (product, index) => {
    const rankEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

    return (
      <Col span={8}>
        <Card
          hoverable
          style={{ height: "100%" }}
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
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <Text style={{ fontSize: "24px", marginRight: "8px" }}>{rankEmoji}</Text>
                <Text style={{ fontSize: "16px", fontWeight: "bold" }}>{product.productName}</Text>
              </div>
            }
            description={
              <>
                <Text style={{ display: "block" }}>상품ID: {product.productId}</Text>
                <Text style={{ display: "block" }}>{product.categoryName}</Text>
                <Text style={{ display: "block" }}>주문수: {product.orderCount}</Text>
                <Text style={{ display: "block" }}>⭐ {product.averageScore}</Text>
              </>
            }
          />
        </Card>
      </Col>
    );
  };

  const renderAgeRangeProduct = (ageRange, products) => {
    const ageRangeColors = {
      20: "#a0d911",
      30: "#1890ff",
      40: "#fa8c16",
      50: "#f5222d",
    };

    if (!products || products.length === 0) {
      return (
        <Col span={24}>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ ...sectionTitleStyle, color: ageRangeColors[ageRange] }}>
              {ageRange}대 - 데이터 없음
            </Text>
          </div>
        </Col>
      );
    }

    return (
      <Col span={24} style={{ marginBottom: "24px" }}>
        <Text style={{ ...sectionTitleStyle, color: ageRangeColors[ageRange] }}>{ageRange}대</Text>
        <Row gutter={[16, 16]}>
          {products.map(product => (
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
                    <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {formatProductName(product.productName)}
                    </Text>
                  }
                  description={
                    <>
                      <Text style={{ display: "block" }}>주문수: {product.orderCount}</Text>
                      <Text style={{ display: "block" }}>⭐ {product.averageScore}</Text>
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
          fontSize: 14,
          colorPrimary: "#1890ff",
        },
      }}>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Form form={form} layout='vertical'>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginBottom: "24px",
            }}>
            <Button onClick={() => handleMonthChange(1)}>최근 1개월</Button>
            <Button onClick={() => handleMonthChange(3)}>최근 3개월</Button>
          </div>

          <Card title={<Text style={titleStyle}>남성 선호 식품</Text>} style={cardStyle}>
            <Row gutter={[16, 16]}>
              {manTop3.map((product, index) => renderProduct(product, index))}
            </Row>
          </Card>

          <Card title={<Text style={titleStyle}>여성 선호 식품</Text>} style={cardStyle}>
            <Row gutter={[16, 16]}>
              {womanTop3.map((product, index) => renderProduct(product, index))}
            </Row>
          </Card>

          <Card title={<Text style={titleStyle}>연령대별 선호 식품</Text>} style={cardStyle}>
            {[20, 30, 40, 50].map(ageRange =>
              renderAgeRangeProduct(ageRange, productsByAge[ageRange])
            )}
          </Card>

          <Row gutter={16}>
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
