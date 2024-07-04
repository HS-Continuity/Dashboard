import { Flex, Space, DatePicker } from 'antd'

import StatusCard from '../../components/Cards/StatusCard';


const Delivery = () => {
  return (
    <Flex gap='small' align='flex-end' vertical>
      <Flex gap="small" wrap>
        <StatusCard title="배송준비" count={5}/>
        <StatusCard title="배송완료" count={4}/>
        <StatusCard title="환불" count={3}/>
      </Flex>
    </Flex>
  );
};

export default Delivery;
