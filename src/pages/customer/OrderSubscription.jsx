import { Flex, Space, DatePicker } from 'antd'

import StatusCard from '../../components/Cards/StatusCard';


const OrderSubscription = () => {
  return (
    <Flex gap='small' align='flex-end' vertical>
      <Flex gap="small" wrap>
        <StatusCard title="결제완료" count={5}/>
        <StatusCard title="주문승인" count={4}/>
        <StatusCard title="배송준비중" count={3}/>
        <StatusCard title="배송중" count={2}/>
        <StatusCard title="배송완료" count={1}/>
      </Flex>
    </Flex>
  );
};

export default OrderSubscription;
