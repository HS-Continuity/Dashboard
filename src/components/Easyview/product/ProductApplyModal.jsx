import React, { useState } from "react";
import {
  Modal,
  Flex,
  Radio,
  Upload,
  message,
  Input,
  Button,
  Form,
  Card,
  Typography,
  Collapse,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const props = {
  beforeUpload: file => {
    const isPNG = file.type === "image/png";
    if (!isPNG) {
      message.error(`${file.name}은 PNG 파일이 아닙니다.`);
    }
    return isPNG || Upload.LIST_IGNORE;
  },
  onChange: info => {
    console.log(info.fileList);
  },
};

const ProductApplyModal = ({ isProductModalOpen, setIsProductModalOpen }) => {
  const [selectedFoodType, setSelectedFoodType] = useState("일반식품");
  const [form] = Form.useForm();

  const handleRadioChange = e => {
    setSelectedFoodType(e.target.value);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        console.log("Form values:", values);
        setIsProductModalOpen(false);
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsProductModalOpen(false);
  };

  return (
    <Modal
      // title={
      //   <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
      //     식품 등록
      //   </Title>
      // }
      open={isProductModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width='90%'
      bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      footer={[
        <Button key='back' onClick={handleCancel}>
          취소
        </Button>,
        <Button key='submit' type='primary' onClick={handleOk}>
          등록하기
        </Button>,
      ]}>
      <Form form={form} layout='vertical' size='middle'>
        <Flex gap='small' vertical>
          <Card size='small' style={{ marginBottom: 0, background: "#f0f2f5" }}>
            <Flex justify='center' align='center'>
              <Radio.Group
                onChange={handleRadioChange}
                value={selectedFoodType}
                style={{ width: "auto" }}>
                <Radio.Button value='일반식품'>일반 식품</Radio.Button>
                <Radio.Button value='친환경식품'>친환경 식품</Radio.Button>
              </Radio.Group>
            </Flex>
          </Card>

          <Flex gap='middle'>
            <Card size='small' style={{ width: "20%" }}>
              <Title level={5}>이미지 업로드</Title>
              <Flex vertical gap='small'>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />} size='middle'>
                    식품 이미지
                  </Button>
                </Upload>
                <Upload {...props} maxCount={5}>
                  <Button icon={<UploadOutlined />} size='middle'>
                    상세 이미지 (최대 5개)
                  </Button>
                </Upload>
              </Flex>
            </Card>

            <Card size='small' style={{ width: "80%" }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Collapse defaultActiveKey={["1"]} ghost>
                    <Panel header={<Title level={5}>기본 정보</Title>} key='1'>
                      <Form layout='vertical'>
                        <Form.Item
                          name='customerId'
                          label='고객 ID'
                          style={{ width: "100%", marginBottom: 8 }}>
                          <Input disabled placeholder='자동 입력' />
                        </Form.Item>
                        <Form.Item
                          name='categoryMain'
                          label='식품 대분류'
                          style={{ width: "100%", marginBottom: 8 }}>
                          <Input placeholder='예: 과일, 채소, 육류' />
                        </Form.Item>
                        <Form.Item
                          name='categorySub'
                          label='식품 소분류'
                          style={{ width: "100%", marginBottom: 8 }}>
                          <Input placeholder='예: 사과, 당근, 소고기' />
                        </Form.Item>
                      </Form>
                    </Panel>
                  </Collapse>
                </Col>
                <Col span={8}>
                  <Collapse defaultActiveKey={["2"]} ghost>
                    <Panel header={<Title level={5}>상품 정보</Title>} key='2'>
                      <Form layout='vertical'>
                        <Form.Item
                          name='productName'
                          label='상품명'
                          style={{ width: "100%", marginBottom: 8 }}>
                          <Input placeholder='상품의 이름' />
                        </Form.Item>
                        <Form.Item
                          name='productPrice'
                          label='상품 가격'
                          style={{ width: "100%", marginBottom: 8 }}>
                          <Input type='number' placeholder='가격 (숫자만)' addonAfter='원' />
                        </Form.Item>
                        <Form.Item
                          name='productOrigin'
                          label='원산지'
                          style={{ width: "100%", marginBottom: 8 }}>
                          <Input placeholder='상품의 원산지' />
                        </Form.Item>
                        <Form.Item
                          name='discountRate'
                          label='할인율'
                          style={{ width: "100%", marginBottom: 8 }}>
                          <Input type='number' placeholder='할인율 (0-100)' addonAfter='%' />
                        </Form.Item>
                      </Form>
                    </Panel>
                  </Collapse>
                </Col>
                <Col span={8}>
                  {selectedFoodType === "친환경식품" && (
                    <Collapse defaultActiveKey={["3"]} ghost>
                      <Panel header={<Title level={5}>친환경 인증 정보</Title>} key='3'>
                        <Form layout='vertical'>
                          <Form.Item
                            name='certName'
                            label='인증서 이름'
                            style={{ width: "100%", marginBottom: 8 }}>
                            <Input placeholder='인증서 이름' />
                          </Form.Item>
                          <Form.Item
                            name='certNumber'
                            label='인증서 번호'
                            style={{ width: "100%", marginBottom: 8 }}>
                            <Input placeholder='인증서 번호' />
                          </Form.Item>
                          <Form.Item
                            name='certFile'
                            label='인증서 파일'
                            style={{ width: "100%", marginBottom: 8 }}>
                            <Upload {...props}>
                              <Button icon={<UploadOutlined />}>인증서 파일 업로드</Button>
                            </Upload>
                          </Form.Item>
                        </Form>
                      </Panel>
                    </Collapse>
                  )}
                </Col>
              </Row>
            </Card>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ProductApplyModal;
