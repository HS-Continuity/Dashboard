import { Form, Card, Row, Col, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getProductByManTop3, getProductByWomanTop3 } from "../../apis/apisStatistics";
import useAuthStore from "../../stores/useAuthStore";
const { Title } = Typography;

const Statistics = () => {
  const [form] = Form.useForm();
  const [manTop3, setManTop3] = useState([]);
  const [womanTop3, setWomanTop3] = useState([]);
  const { username } = useAuthStore();
  console.log(username);

  useEffect(() => {
    const fetchTop3Products = async () => {
      try {
        const customerId = String(username); // 고객 ID 가져오기
        const [manTop3Response, womanTop3Response] = await Promise.all([
          getProductByManTop3(customerId),
          getProductByWomanTop3(customerId),
        ]);

        setManTop3(manTop3Response.data);
        setWomanTop3(womanTop3Response.data);
      } catch (error) {
        console.error("Error fetching top 3 products:", error);
      }
    };

    fetchTop3Products();
  }, []);

  const cardStyle = {
    marginBottom: "16px",
    border: "1px solid #d9d9d9",
    borderRadius: "2px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  };

  const titleStyle = {
    fontSize: "16px",
  };

  //타이틀 박스
  const boxStyle = {
    display: "inline-block",
    padding: "4px 8px",
    border: "1px solid #d9d9d9",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    marginBottom: "12px",
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
      </Form>
    </div>
  );
};

export default Statistics;
