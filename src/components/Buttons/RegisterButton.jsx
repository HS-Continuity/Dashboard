import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

const RegisterButton = ({title, onClick}) => {
  return (
    <div>
      <Button 
        type='primary' 
        icon={<PlusCircleOutlined  style={{fontWeight: 'bold' }}/>}
        style={{width: '150px', height: '95px'}} 
        onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</span> 
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>등록하기</span>
        </div>
      </Button>
    </div>
  );
};
export default RegisterButton
