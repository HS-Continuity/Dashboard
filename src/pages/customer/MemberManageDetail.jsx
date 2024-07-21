import { fetchCustomerListById, fetchCustomerAddressListById, fetchCustomerCardListById, updateMember } from '../../apis';
import { Flex, Tabs, Input, Tag, Avatar, List } from 'antd';
import moment from 'moment';
import { LeftOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import './MemberManageDetailModule.css';

const { TabPane } = Tabs;

const MemberManageDetail = () => {
  const navigate = useNavigate();
  const {member_id} = useParams();
  const [members, setMembers] = useState(null);
  const [productForm, setProductForm] = useState({}); // 각 필드별 상태 관리

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  
  const { data: member, isLoading: memberIsLoading, refetch: refetchMember } = useQuery({
    queryKey: ["member", member_id],
    queryFn: () => fetchCustomerListById(member_id),
    enabled: !!member_id,
    staleTime: 60 * 1000
  });

  const { data: address, isLoading } = useQuery({
    queryKey: ["address", member_id],
    queryFn: () => fetchCustomerAddressListById(member_id),
    enabled: !!member_id,
    staleTime: 60 * 1000,
  });
  
  const { data: card } = useQuery({
    queryKey: ["card", member_id],
    queryFn: () => fetchCustomerCardListById(member_id),
    enabled: !!member_id,
    staleTime: 60 * 1000,
    
  });

  // address 데이터 정렬
  const sortedAddress = address ? [...address].sort((a, b) => {
    if (a.is_default_address === 'ACTIVE') return -1; // 'ACTIVE'인 항목을 앞으로
    if (b.is_default_address === 'ACTIVE') return 1; // 'ACTIVE'인 항목을 앞으로
    return 0; // 나머지 항목은 순서 유지
  }) : [];

  // address 데이터 정렬
  const sortedCard = card ? [...card].sort((a, b) => {
    if (a.is_default_payment_card === 'ACTIVE') return -1; // 'ACTIVE'인 항목을 앞으로
    if (b.is_default_payment_card === 'ACTIVE') return 1; // 'ACTIVE'인 항목을 앞으로
    return 0; // 나머지 항목은 순서 유지
  }) : [];
  

  useEffect(() => {
    if (member_id) {
      refetchMember(); // member_id가 변경될 때마다 데이터 다시 가져오기
    }
  }, [member_id]);

  // useMutation을 사용하여 상품 정보 업데이트
  const mutation = useMutation({
    mutationFn: (updatedMember) => updateMember(member_id, updatedMember),
    onSuccess: () => {
      alert('상품 정보가 성공적으로 수정되었습니다.');
      navigate('/manage');
    },
    onError: (error) => {
      console.error('Error updating member:', error);
      alert('상품 정보 수정에 실패했습니다. 다시 시도해주세요.');
    }
  });

  // 수정 버튼 클릭
  const onHandleUpdateClick = async () => {
    try {
      // productForm 데이터 유효성 검증 로직 추가
      if (!productForm.productName || !productForm.productPrice || isNaN(productForm.productPrice)) {
        alert('필수 항목을 모두 입력하고, 가격은 숫자로 입력해주세요.');
        return;
      }
      
      mutation.mutate({ productId, ...productForm });
    } catch (error) {
      console.error('Error updating product:', error);

      // 에러 처리 세분화
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert('잘못된 요청입니다. 입력 값을 확인해주세요.');
            break;
          case 404:
            alert('해당 상품을 찾을 수 없습니다.');
            break;
          default:
            alert('상품 정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        alert('상품 정보 수정 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <Flex gap="small" justify="flex-start">
        <LeftOutlined onClick={onHandleBackClick} />
        <h2>회원 상세 정보</h2>
      </Flex>

      <Tabs defaultActiveKey="1" items={[
        {
          label: '개인 정보',
          key: '1',
          children: member ? (
            <Flex gap="middle" vertical>
              <Input disabled addonBefore="회원 ID" value={member_id} />
              <Input disabled addonBefore="회원명" value={member.member_name} />
              <Input disabled addonBefore="성별" value={member.gender} />
              <Input disabled addonBefore="휴대전화" value={member.member_phone_number} />
              <Input disabled addonBefore="이메일" value={member.member_email} />
            </Flex> 
          ) : ( // members 상태가 null인 경우 로딩 메시지 표시
            <div>Loading...</div>
          ),
          icon: <UserOutlined />
        },
        {
          label: '주소지 정보',
          key: '2',
          children: address && (
            <Flex gap="middle" vertical>
              <List
                itemLayout="horizontal"
                dataSource={sortedAddress.map((item) => ({ ...item, key: item.member_address_id }))}
                renderItem={(item, index) => (
                  <List.Item className={item.is_default_address === 'ACTIVE' ? 'list-item default' : 'list-item'}>
                    <List.Item.Meta
                      avatar={<HomeOutlined />}
                      title={
                        <Flex gap='middle'>
                          <a>{item.address_name}</a>
                          
                          {item.is_default_address === 'ACTIVE' && <Tag color="blue">기본 배송지</Tag>}
                        </Flex>
                      }
                      description={
                          <div>{item.detail_address}</div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Flex>
          ),
          icon: <HomeOutlined />
        },
        {
          label: '결제수단 정보',
          key: '3',
          children: card && (
            <Flex gap="middle" vertical>
              <List
                itemLayout="horizontal"
                dataSource={sortedCard.map((item) => ({ ...item, key: item.member_payment_card_id }))}
                renderItem={(item, index) => (
                  <List.Item className={item.is_default_payment_card === 'ACTIVE' ? 'list-item default' : 'list-item'}>
                    <List.Item.Meta
                      avatar={<CreditCardOutlined />}
                      title={
                        <Flex gap='middle'>
                          <a>{item.card_company}</a>
                          
                          {item.is_default_payment_card === 'ACTIVE' && <Tag color="blue">기본 결제수단</Tag>}
                        </Flex>
                      }
                      description={
                          <div>카드번호: {item.card_number.slice(0, 12).replace(/./g, '*') + item.card_number.slice(14)}</div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Flex>
          ),
          icon: <CreditCardOutlined />
        },
      ]} />

      {/* <Flex className='form5' justify='flex-end' gap="middle">
        <Button 
          type="primary" 
          shape="round" 
          icon={<EditOutlined />}
          onClick={onHandleUpdateClick}>
            수정하기
        </Button>
      </Flex> */}
    </div>
  )
}

export default MemberManageDetail
