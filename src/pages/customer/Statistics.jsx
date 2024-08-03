import { Form, Card, Row, Col, Typography } from "antd";
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
  const { customerId } = useAuthStore();

  const data = [
    { id: "java", label: "Java", value: 20 },
    { id: "javascript", label: "JavaScript", value: 40 },
    { id: "ruby", label: "Ruby", value: 10 },
    { id: "python", label: "Python", value: 30 },
  ];

  console.log(customerId);

  useEffect(() => {
    const fetchTop3Products = async () => {
      try {
        if (1) {
          const [manTop3Response, womanTop3Response] = await Promise.all([
            getProductByManTop3(1),
            getProductByWomanTop3(1),
          ]);

          setManTop3(manTop3Response.data);
          setWomanTop3(womanTop3Response.data);
        }
      } catch (error) {
        console.error("Error fetching top 3 products:", error);
      }
    };

    fetchTop3Products();
  }, [customerId]);

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

  const itemStyle = {
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    color: "#333",
  };
  return (
    <div style={{ padding: "16px", fontSize: "14px" }}>
      <Title level={3} style={{ marginBottom: "30px" }}>
        통계관리
      </Title>
      <Form form={form} layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Card title='성별 선호 식품 TOP 3' style={cardStyle}>
              <Row gutter={16}>
                <Col span={24}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={boxStyle}>
                      <h3 style={titleStyle}>남성</h3>
                    </div>
                    <Row gutter={16}>
                      <Col span={8}>
                        <div style={{ backgroundColor: "#f0f2f5", height: "100px" }}>Col 1</div>
                      </Col>
                      <Col span={8}>
                        <div style={{ backgroundColor: "#d9d9d9", height: "100px" }}>Col 2</div>
                      </Col>
                      <Col span={8}>
                        <div style={{ backgroundColor: "#f0f2f5", height: "100px" }}>Col 3</div>
                      </Col>
                    </Row>
                  </div>
                  <div style={cardStyle}></div>
                  <div>
                    <div style={boxStyle}>
                      <h3 style={titleStyle}>여성</h3>
                    </div>
                    <Row gutter={16}>
                      <Col span={8}>
                        <div style={{ backgroundColor: "#f0f2f5", height: "100px" }}>Col 1</div>
                      </Col>
                      <Col span={8}>
                        <div style={{ backgroundColor: "#d9d9d9", height: "100px" }}>Col 2</div>
                      </Col>
                      <Col span={8}>
                        <div style={{ backgroundColor: "#f0f2f5", height: "100px" }}>Col 3</div>
                      </Col>
                    </Row>
                  </div>
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
                    <div style={boxStyle}>
                      <h3 style={titleStyle}>20대</h3>
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
                    <div style={boxStyle}>
                      <h3 style={titleStyle}>30대</h3>
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
                    <div style={boxStyle}>
                      <h3 style={titleStyle}>40대</h3>
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
                    <div style={boxStyle}>
                      <h3 style={titleStyle}>50대</h3>
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

        <Row gutter={16}>
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
