import { Card, List, Typography, Space, Tag } from "antd";
import { HomeOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Text } = Typography;

const AddressList = ({ addresses }) => {
  if (!addresses || addresses.length === 0) {
    return <Text>주소지 정보가 없습니다.</Text>;
  }

  return (
    // <Card>
    <List
      itemLayout='vertical'
      dataSource={addresses}
      renderItem={item => (
        <List.Item key={item.member_address_id}>
          <List.Item.Meta
            avatar={
              item.is_default_shipping_address === "O" ? (
                <HomeOutlined style={{ fontSize: "24px", color: "##db1b7c" }} />
              ) : (
                <EnvironmentOutlined style={{ fontSize: "24px" }} />
              )
            }
            title={
              <Space>
                <Text strong>{item.address}</Text>
                {item.is_default_shipping_address === "O" && <Tag color='#db1b7c'>대표 주소지</Tag>}
              </Space>
            }
            description={
              <Space direction='vertical'>
                <Text type='secondary'>회원명: {item.member_name}</Text>
              </Space>
            }
          />
        </List.Item>
      )}
    />
    // </Card>
  );
};

export default AddressList;
