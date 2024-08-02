import { Card } from 'antd';

const { Meta } = Card;

const StatusCard = ({ title, count }) => {
  return (
    <Card style={{ width: '115px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{title}</span> 
        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{count}건</span> 
        
      </div>
      {/* <Meta  style={{ fontSize: '15px', fontWeight: 'bold' }}title={title} /> */}
      {/* {count}건 */}
    </Card>
  );
};

export default StatusCard
