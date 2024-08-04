import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

const RegisterButton = ({title, onClick}) => {
  return (
    <div>
      <Button 
        // type='primary' 
        icon={<PlusCircleOutlined  style={{fontWeight: 'bold' }}/>}
        style={{width: '110px', height: '55px', backgroundColor: '#FFFFFF', color: '#EF9C66', borderColor: '#EF9C66'}} 
        onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{title}</span> 
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>등록하기</span>
        </div>
      </Button>
    </div>
  );
};
export default RegisterButton
