import { Flex, Space, DatePicker } from 'antd'

import StatusCard from '../../components/Cards/StatusCard';


const Promotion = () => {
  return (
    <Flex gap='small' align='flex-end' vertical>
      <Flex gap="small" wrap>
        <StatusCard title="광고진행중" count={5}/>
        <StatusCard title="광고마감" count={4}/>
      </Flex>
    </Flex>
  );
};

export default Promotion;
