import { Button } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

const PromotionApplyButton = ({title, onClick}) => {
  return (
    <div>
      <Button 
        icon={<ThunderboltOutlined  style={{fontWeight: 'bold' }}/>}
        style={{width: '160px', height: '95px', backgroundColor: '#B3E0F2'}} 
        onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</span> 
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>신청하기</span>
        </div>
      </Button>
    </div>
  );
}

export default PromotionApplyButton
