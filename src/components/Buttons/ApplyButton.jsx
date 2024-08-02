import { Button } from 'antd';
import { HourglassOutlined } from '@ant-design/icons';

const ApplyButton = ({title, onClick}) => {
  return (
    <div>
      <Button 
        icon={<HourglassOutlined  style={{fontWeight: 'bold' }}/>}
        style={{width: '110px', height: '55px', backgroundColor: '#ffa39e'}} 
        onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{title}</span> 
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>신청하기</span>
        </div>
      </Button>
    </div>
  );
};
export default ApplyButton
