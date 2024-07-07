import { Card } from 'antd';

const { Meta } = Card;

const StatusCard = ({ title, count }) => {
  return (
    <Card hoverable style={{ width: 150 }}>
      <Meta title={title} />
      {count}건
    </Card>
  );
};

export default StatusCard
