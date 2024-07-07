import { Flex, Space, DatePicker } from 'antd'

import StatusCard from '../../components/Cards/StatusCard';


const ProductTimesale = () => {
  return (
    <Flex gap='small' align='flex-end' vertical>
      <Flex gap="small" wrap>
        <StatusCard title="진행중" count={5}/>
        <StatusCard title="마감" count={4}/>
      </Flex>
    </Flex>
  );
};

export default ProductTimesale;
