import { Form, Card, Row, Col, Typography, Image, Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  getProductByAgeRange,
  getProductByGeneral,
  getProductByManTop3,
  getProductByRegular,
  getProductByWomanTop3,
} from "../../apis/apisStatistics";
import useAuthStore from "../../stores/useAuthStore";
import PieChart from "../../components/Chart/PieChart";
import BarChart from "../../components/Chart/BarChart";

const { Title } = Typography;

const Statistics = () => {
  const [form] = Form.useForm();
  const [manTop3, setManTop3] = useState([]);
  const [womanTop3, setWomanTop3] = useState([]);
  const [productsByAge, setProductsByAge] = useState({});
  const [productsByGeneral, setProductsByGeneral] = useState([]);
  const [productsByRegular, setProductsByRegular] = useState([]);
  //const { customerId } = useAuthStore();
  const customerId = 1;

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
    marginBottom: "16px",
    border: "1px solid #d9d9d9",
    borderRadius: "2px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  };

  const titleStyle = {
    fontSize: "16px",
  };

  const boxStyle = {
    display: "inline-block",
    padding: "4px 8px",
    border: "1px solid #d9d9d9",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    marginBottom: "12px",
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
            border: "1px solid #d9d9d9",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            height: "270px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <p style={{ margin: "0", fontSize: "28px" }}>{rankEmoji}</p>
            <div style={boxStyle}>
              <p style={{ margin: "0", fontSize: "13px" }}>상품ID: {product.productId}</p>
            </div>
          </div>
          <Image
            src={product.image}
            height={145}
            style={{
              width: "90%",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              alignSelf: "center",
              marginLeft: "5%", // 이미지가 중앙에서 시작하도록 marginLeft를 5%로 설정
              marginRight: "5%",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "80px",
              marginLeft: "5%", // 이미지 시작점과 일치하도록 marginLeft 조정
              marginRight: "5%",
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                fontSize: "14px",
                marginTop: "5px",
                marginBottom: "5px",
              }}>
              <p style={{ fontSize: "16px", fontWeight: "bold", margin: "5px 0" }}>
                {product.productName}
              </p>
              <div style={boxStyle2}>
                <p style={{ fontSize: "13px" }}>{product.categoryName}</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                fontSize: "14px",
                fontWeight: "normal",
              }}>
              <p>주문수: {product.orderCount}</p>
              <p>⭐{product.averageScore}</p>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  const renderAgeRangeProduct = (ageRange, products, isLastColumn) => {
    const ageRangeColors = {
      20: "#66CC66",
      30: "#339933",
      40: "#006600",
      50: "#003300",
    };

    if (!products || products.length === 0) {
      return (
        <Col span={12}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ ...boxStyle, backgroundColor: ageRangeColors[ageRange] }}>
              <h3 style={{ fontSize: "15px", color: "white" }}>{ageRange}대 - 데이터 없음</h3>
            </div>
          </div>
        </Col>
      );
    }

    return (
      <Col
        span={12}
        style={{
          borderRight: isLastColumn ? "none" : "1px solid #e8e8e8",
          padding: "10px",
        }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ ...boxStyle, backgroundColor: ageRangeColors[ageRange] }}>
            <h3 style={{ fontSize: "15px", color: "white" }}>{ageRange}대</h3>
          </div>

          <Row gutter={16}>
            {products.map((product, index) => (
              <Col span={12} key={product.productId}>
                <div
                  style={{
                    ...itemStyle,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}>
                  <div style={{ flex: "1", height: "100%", display: "flex" }}>
                    <Image
                      src={product.image}
                      alt={product.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: "2",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      paddingLeft: "10px",
                    }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>
                      {formatProductName(product.productName)}
                    </p>
                    <p style={{ margin: "0", fontSize: "15px" }}>주문수: {product.orderCount}</p>
                    <p style={{ margin: "0", fontSize: "15px" }}>⭐ {product.averageScore}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
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
    <div style={{ padding: "16px", fontSize: "14px" }}>
      <Title level={3} style={{ marginBottom: "30px" }}>
        통계관리
      </Title>
      <Form form={form} layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Card
              title='성별 선호 식품 TOP 3'
              style={{
                marginBottom: "16px",
                border: "1px solid #d9d9d9",
                borderRadius: "2px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}>
              <Row gutter={16}>
                <Col span={24}>
                  <div style={{ ...boxStyle, backgroundColor: "#2A52BE" }}>
                    <h3 style={{ fontSize: "15px", color: "white" }}>남성 선호 식품</h3>
                  </div>
                  <Row gutter={16}>
                    {manTop3.map((product, index) => renderProduct(product, index))}
                  </Row>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <div
                    style={{
                      ...boxStyle,
                      marginTop: "10px",
                      backgroundColor: "#FF5C5C",
                    }}>
                    <h3 style={{ fontSize: "15px", color: "white" }}>여성 선호 식품</h3>
                  </div>
                  <Row gutter={16}>
                    {womanTop3.map((product, index) => renderProduct(product, index))}
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Card title='연령대별 선호 식품' style={cardStyle}>
              <Row gutter={16} style={{ borderBottom: "1px solid #e8e8e8" }}>
                {renderAgeRangeProduct(20, productsByAge[20])}
                {renderAgeRangeProduct(30, productsByAge[30])}
              </Row>
              <Row gutter={16}>
                {renderAgeRangeProduct(40, productsByAge[40])}
                {renderAgeRangeProduct(50, productsByAge[50])}
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Card title='일반주문 판매량' style={cardStyle}>
              <PieChart data={transformData(productsByGeneral)} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title='정기주문 판매량' style={cardStyle}>
              <PieChart data={transformData(productsByRegular)} />
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Statistics;
