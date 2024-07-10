import { Button } from 'antd';

const StatusChangeButton = ({title, onClick}) => {
  return (
    <div>
      <Button type='primary' size={'medium'} onClick={onClick}>
        {title}
      </Button>
    </div>
  );
};

export default StatusChangeButton
