import { Flex, Space, DatePicker } from 'antd'

import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import CommonSearchBar from '../../components/Searchbar/CommonSearchBar';

const { RangePicker } = DatePicker;

const OrderSubscription = () => {
  return (
    <div>
      <Flex gap="small" align="flex-start" vertical>
        <Flex gap="small" wrap>
          <Space align="center">검색기간</Space>
          <RangePicker /> {/* start - end date 검색 */}
          <Space align="center"><span></span>|<span></span></Space>
          <CommonSearchBar title={"회원번호/회원명"}/>
        </Flex>
      </Flex>
      <br />
      <Flex gap='small' align='flex-end' vertical>
        <Flex gap="small" wrap>
          <StatusCard title="결제완료" count={1}/>
          <StatusCard title="주문승인" count={2}/>
          <StatusCard title="배송준비중" count={3}/>
          <StatusCard title="배송중" count={4}/>
          <StatusCard title="배송완료" count={5}/>
        </Flex>
        <Flex gap="small" wrap>
          <Space align="center">출고상태변경</Space>
          <StatusChangeButton title={"주문승인"}/>
          <StatusChangeButton title={"배송준비중"}/>
          <StatusChangeButton title={"배송중"}/>
          <StatusChangeButton title={"배송완료"}/>
        </Flex>
      </Flex>
    </div>
  );
};

export default OrderSubscription;
