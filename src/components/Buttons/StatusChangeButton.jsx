import { Button } from 'antd';

const StatusChangeButton = ({title, onClick}) => {
  return (
    <div>
      <Button  style={{ color: 'green', borderColor: 'green' }} size={'medium'} onClick={onClick}>
        {title}
      </Button>
    </div>
  );
};

export default StatusChangeButton
