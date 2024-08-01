import { Button } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

const PromotionApplyButton = ({title, onClick}) => {
  return (
    <div>
      <Button 
        icon={<ThunderboltOutlined  style={{fontWeight: 'bold' }}/>}
        style={{width: '110px', height: '55px', backgroundColor: '#B3E0F2'}} 
        onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{title}</span> 
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>신청하기</span>
        </div>
      </Button>
    </div>
  );
}

export default PromotionApplyButton
