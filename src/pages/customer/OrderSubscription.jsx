import { Flex, Space, DatePicker, Table, Tag } from 'antd'

import StatusCard from '../../components/Cards/StatusCard';
import StatusChangeButton from '../../components/Buttons/StatusChangeButton';
import CommonSearchBar from '../../components/Searchbar/CommonSearchBar';

const { RangePicker } = DatePicker;
const orderStatusTags = ['결제완료', '주문승인', '배송준비중','배송중', '배송완료'];
const tagColors = {
  '결제완료': 'green',
  '주문승인': 'blue',
  '배송준비중': 'orange',
  '배송중': 'purple',
  '배송완료': 'cyan',
};

const columns = [
  {
    title: 'NO.',
    dataIndex: 'no',  // 해당 데이터가 어떤 필드에 있는지
    key: 'no',
    fixed: 'left'
  },
  {
    title: '주문번호',
    dataIndex: '주문번호',
    key: '주문번호',
    fixed: 'left'
  },
  {
    title: '회원ID',
    dataIndex: '회원ID',
    key: '회원ID',
    fixed: 'left'
  },
  {
    title: '회원명',
    dataIndex: '회원명',
    key: '회원명',
    fixed: 'left'
  },
  {
    title: '휴대전화번호',
    dataIndex: '휴대전화번호',
    key: '휴대전화번호',
    fixed: 'left'
  },
  {
    title: '배송시작일',
    dataIndex: '배송시작일',
    key: '배송시작일',
    fixed: 'left'
  },
  {
    title: '상품',
    dataIndex: '상품',
    key: '상품',
    fixed: 'left'
  },
  {
    title: '출고상태',
    dataIndex: 'tags',  //  밑에 데이터에서 'tags' 필드를 사용하므로
    key: 'tags',
    render: (_, {tags}) => (
      <>
        {tags.map((tag) => {  //  출고상태정보가 출고상태 필드에 저장되어 있으므로
          // if (!orderStatusTags.includes(tag)) {  //  배열에 tag 값 있는지 확인
          //   return null;  // 유효하지 않은 태그는 표시 X
          // }

          let color = tagColors[tag] || 'default';  //  tagColors 객체에 해당 tag의 색상이 없으면 'default' 색상 사용
          return (
            <Tag color={color} key={tag}>
              {tag}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const data = [
  {
    key: '1',
    no: 1,
    주문번호: 100001,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['배송완료']
  },
  {
    key: '2',
    no: 2,
    주문번호: 100001,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['결제완료']
  },
  {
    key: '3',
    no: 3,
    주문번호: 100001,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['주문승인']},
  {
    key: '4',
    no: 4,
    주문번호: 100001,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['배송중']
  },
  {
    key: '5',
    no: 5,
    주문번호: 100001,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['결제완료']
  },
  {
    key: '6',
    no: 6,
    주문번호: 100001,
    회원ID: 'C00001',
    회원명: '김김김',
    휴대전화번호: '010-1111-1111',
    배송시작일: '2024-01-01',
    상품: '오이 외 1건',
    tags: ['배송준비중']
  },
];

const OrderSubscription = () => {

  // status별 개수 세기
  // 1. 빈 객체 생성하기 (태그별 개수 저장)
  const statusCounts = {};
  // 2. forEach 사용해서 orderStatusTags 배열 순회하기
  orderStatusTags.forEach((tag) => {
    // 옵셔널 체이닝(?.) 사용해서 item.tags가 존재하는 경우에만 includes(tag) 호출하기
    // 태그가 key, 개수가 value
    statusCounts[tag] = data.filter((item) => item.tags?.includes(tag)).length;
  });

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
          {orderStatusTags.map((tag) => (
            <StatusCard key={tag} title={tag} count={statusCounts[tag]} />
          ))}
        </Flex>
        <Flex gap="small" wrap>
          <Space align="center">출고상태변경</Space>
          <StatusChangeButton title={"주문승인"}/>
          <StatusChangeButton title={"배송준비중"}/>
          <StatusChangeButton title={"배송중"}/>
          <StatusChangeButton title={"배송완료"}/>
        </Flex>
      </Flex>
      <br />
      <br />
      <Table
        columns={columns}
        rowSelection={{}}  // 체크박스
        dataSource={data}
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default OrderSubscription;
