import { Button } from 'antd';

const StatusChangeButton = ({title}) => {
  return (
    <div>
      <Button type='primary' size={'medium'}>
        {title}
      </Button>
    </div>
  );
};

export default StatusChangeButton
