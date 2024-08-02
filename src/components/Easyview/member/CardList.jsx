import { List, Typography, Space, Tag, Avatar } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CardList = ({ cards }) => {
  if (!cards || cards.length === 0) {
    return <Text>등록된 카드 정보가 없습니다.</Text>;
  }

  const maskCardNumber = number => {
    const parts = number.split("-");
    return `${parts[0]}-****-****-${parts[3]}`;
  };

  return (
    <List
      itemLayout='horizontal'
      dataSource={cards}
      renderItem={item => (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar icon={<CreditCardOutlined />} style={{ backgroundColor: "#db1b7c" }} />}
            title={
              <Space>
                <Text strong>{item.card_company}</Text>
                <Text type='secondary'>{maskCardNumber(item.card_number)}</Text>
                {item.is_simple_payment_agreed === 1 && <Tag color='green'>간편결제 동의</Tag>}
              </Space>
            }
            description={
              <Space direction='vertical'>
                <Text>유효기간: {item.card_expiration}</Text>
                <Text type='secondary'>카드 비밀번호: {item.card_password.substr(0, 2)}**</Text>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default CardList;
