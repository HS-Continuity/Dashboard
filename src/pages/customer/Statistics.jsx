import { Form, Card, Row, Col, Typography, Image, Button } from "antd";
import React, { useEffect, useState } from "react";
import { getProductByManTop3, getProductByWomanTop3 } from "../../apis/apisStatistics";
import useAuthStore from "../../stores/useAuthStore";
import PieChart from "../../components/Chart/PieChart";

const { Title } = Typography;

const Statistics = () => {
  const [form] = Form.useForm();
  const [manTop3, setManTop3] = useState([]);
  const [womanTop3, setWomanTop3] = useState([]);
  const [loading, setLoading] = useState(true);
  //const { customerId } = useAuthStore();
  const customerId = 1;

  const data = [
    { id: "java", label: "Java", value: 20 },
    { id: "javascript", label: "JavaScript", value: 40 },
    { id: "ruby", label: "Ruby", value: 10 },
    { id: "python", label: "Python", value: 30 },
  ];

  useEffect(() => {
    const fetchTop3Products = async () => {
      try {
        const [manTop3Response, womanTop3Response] = await Promise.all([
          getProductByManTop3(customerId),
          getProductByWomanTop3(customerId),
        ]);

        setManTop3(manTop3Response); // 상태를 직접 업데이트
        setWomanTop3(womanTop3Response); // 상태를 직접 업데이트
      } catch (error) {
        console.error("Error fetching top 3 products:", error);
      }
    };

    fetchTop3Products();
  }, []);

  console.log(manTop3);
  console.log(womanTop3);

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
              {/* 20대와 30대 */}
              <Row gutter={16}>
                {/* 20대 */}
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ ...boxStyle, backgroundColor: "#66CC66" }}>
                      <h3 style={{ fontSize: "15px", color: "white" }}>20대</h3>
                    </div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#f0f2f5" }}>Col 1</div>
                      </Col>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#d9d9d9" }}>Col 2</div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* 30대 */}
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ ...boxStyle, backgroundColor: "#339933" }}>
                      <h3 style={{ fontSize: "15px", color: "white" }}>30대</h3>
                    </div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#f0f2f5" }}>Col 1</div>
                      </Col>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#d9d9d9" }}>Col 2</div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              {/* 40대와 50대 */}
              <Row gutter={16}>
                {/* 40대 */}
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ ...boxStyle, backgroundColor: "#006600" }}>
                      <h3 style={{ fontSize: "15px", color: "white" }}>40대</h3>
                    </div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#f0f2f5" }}>Col 1</div>
                      </Col>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#d9d9d9" }}>Col 2</div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* 50대 */}
                <Col span={12}>
                  <div>
                    <div style={{ ...boxStyle, backgroundColor: "#003300" }}>
                      <h3 style={{ fontSize: "15px", color: "white" }}>50대</h3>
                    </div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#f0f2f5" }}>Col 1</div>
                      </Col>
                      <Col span={12}>
                        <div style={{ ...itemStyle, backgroundColor: "#d9d9d9" }}>Col 2</div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Card title='일반주문 판매량' style={cardStyle}>
              <PieChart data={data} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title='정기주문 판매량' style={cardStyle}>
              <PieChart data={data} />
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Statistics;
