import { Flex, Space, DatePicker } from 'antd'

import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import CommonSearchBar from '../../components/Searchbar/CommonSearchBar';

const { RangePicker } = DatePicker;

const Delivery = () => {
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
          <StatusCard title="배송준비" count={5}/>
          <StatusCard title="배송완료" count={4}/>
          <StatusCard title="환불" count={3}/>
        </Flex>
        <Flex gap="small" wrap>
          <Space align="center">배송상태변경</Space>
          <StatusChangeButton title={"배송완료"}/>
          <StatusChangeButton title={"환불신청"}/>
        </Flex>
      </Flex>
    </div>
  );
};

export default Delivery;
