import { Button } from 'antd';

const RegisterButton = ({title, onClick}) => {
  return (
    <div>
      <Button 
        type='primary' 
        style={{width: '150px', height: '95px'}} 
        onClick={onClick}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</div>
      </Button>
    </div>
  );
};
export default RegisterButton
