import {fetchMemberAddresses, fetchMemberPaymentCards} from '../../apis/apisMembers';
import { Flex, Tabs, Input, Tag, Avatar, List, Button } from 'antd';
import moment from 'moment';
import { LeftOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import './MemberManageDetailModule.css';

const { TabPane } = Tabs;

const MemberManageDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {member_id} = useParams();
  const [members, setMembers] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [productForm, setProductForm] = useState({}); // 각 필드별 상태 관리

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  useEffect(() => {
    if (location.state) {
      console.log('Received member data in detail page:', location.state);

      setMemberData(location.state)
    }
  }, [location.state]);

  
  // const { data: member, isLoading: memberIsLoading, refetch: refetchMember } = useQuery({
  //   queryKey: ["member", member_id],
  //   queryFn: () => fetchCustomerListById(member_id),
  //   enabled: !!member_id,
  //   staleTime: 60 * 1000
  // });

  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses", memberData?.memberId],
    queryFn: () => fetchMemberAddresses(memberData?.memberId),
    enabled: !!memberData?.memberId,
    staleTime: 60 * 1000,
  });
  
  const { data: paymentCards, isLoading: paymentCardsLoading } = useQuery({
    queryKey: ["paymentCards", memberData?.memberId],
    queryFn: () => fetchMemberPaymentCards(memberData?.memberId),
    enabled: !!memberData?.memberId,
    staleTime: 60 * 1000,
    
  });

  const renderAddresses = () => {
    if (addressesLoading) {
      return <div>주소 정보를 불러오고 있습니다...</div>;
    }
    if (!addresses) {
      return <div>주소 정보를 찾을 수 없습니다.</div>
    }

    // const sortedAddresses = [...addresses].sort((a, b) =>
    // b.isDefaultAddress.localeCompare(a.isDefaultAddress))

    const sortedAddresses = addresses ? [...addresses].sort((a, b) => {
    if (a.is_default_address === 'ACTIVE') return -1; // 'ACTIVE'인 항목을 앞으로
    if (b.is_default_address === 'ACTIVE') return 1; // 'ACTIVE'인 항목을 앞으로
    return 0; // 나머지 항목은 순서 유지
    }) : [];

    return (
      <List
        itemLayout="horizontal"
        dataSource={sortedAddresses}
        renderItem={(item) => (
          <List.Item className={item.isDefaultAddress === 'ACTIVE' ? 'list-item default' : 'list-item'}>
            <List.Item.Meta
              avatar={<HomeOutlined />}
              title={
                <Flex gap='middle'>
                  <span>{item.addressName}</span>
                  {item.isDefaultAddress === 'ACTIVE' && <Tag color="blue">기본 배송지</Tag>}
                </Flex>
              }
              description={
                <div>{item.generalAddress} {item.detailAddress}</div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const renderPaymentCards = () => {
    if (paymentCardsLoading) return <div>결제 수단 정보를 불러오는 중...</div>;
    if (!paymentCards) return <div>결제 수단 정보가 없습니다.</div>;

    const sortedCards = [...paymentCards].sort((a, b) => 
      b.isDefaultPaymentCard.localeCompare(a.isDefaultPaymentCard)
    );

    return (
      <List
        itemLayout="horizontal"
        dataSource={sortedCards}
        renderItem={(item) => (
          <List.Item className={item.isDefaultPaymentCard === 'ACTIVE' ? 'list-item default' : 'list-item'}>
            <List.Item.Meta
              avatar={<CreditCardOutlined />}
              title={
                <Flex gap='middle'>
                  <span>{item.cardCompany}</span>
                  {item.isDefaultPaymentCard === 'ACTIVE' && <Tag color="blue">기본 결제수단</Tag>}
                </Flex>
              }
              description={
                <div>카드번호: {item.cardNumber.replace(/\d{4}(?=.)/g, '****')}</div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  // // address 데이터 정렬
  // const sortedAddress = address ? [...address].sort((a, b) => {
  //   if (a.is_default_address === 'ACTIVE') return -1; // 'ACTIVE'인 항목을 앞으로
  //   if (b.is_default_address === 'ACTIVE') return 1; // 'ACTIVE'인 항목을 앞으로
  //   return 0; // 나머지 항목은 순서 유지
  // }) : [];

  // // address 데이터 정렬
  // const sortedCard = card ? [...card].sort((a, b) => {
  //   if (a.is_default_payment_card === 'ACTIVE') return -1; // 'ACTIVE'인 항목을 앞으로
  //   if (b.is_default_payment_card === 'ACTIVE') return 1; // 'ACTIVE'인 항목을 앞으로
  //   return 0; // 나머지 항목은 순서 유지
  // }) : [];
  

  // useEffect(() => {
  //   if (member_id) {
  //     refetchMember(); // member_id가 변경될 때마다 데이터 다시 가져오기
  //   }
  // }, [member_id]);

  // // useMutation을 사용하여 상품 정보 업데이트
  // const mutation = useMutation({
  //   mutationFn: (updatedMember) => updateMember(member_id, updatedMember),
  //   onSuccess: () => {
  //     alert('상품 정보가 성공적으로 수정되었습니다.');
  //     navigate('/manage');
  //   },
  //   onError: (error) => {
  //     console.error('Error updating member:', error);
  //     alert('상품 정보 수정에 실패했습니다. 다시 시도해주세요.');
  //   }
  // });

  // // 수정 버튼 클릭
  // const onHandleUpdateClick = async () => {
  //   try {
  //     // productForm 데이터 유효성 검증 로직 추가
  //     if (!productForm.productName || !productForm.productPrice || isNaN(productForm.productPrice)) {
  //       alert('필수 항목을 모두 입력하고, 가격은 숫자로 입력해주세요.');
  //       return;
  //     }
      
  //     mutation.mutate({ productId, ...productForm });
  //   } catch (error) {
  //     console.error('Error updating product:', error);

  //     // 에러 처리 세분화
  //     if (error.response) {
  //       switch (error.response.status) {
  //         case 400:
  //           alert('잘못된 요청입니다. 입력 값을 확인해주세요.');
  //           break;
  //         case 404:
  //           alert('해당 상품을 찾을 수 없습니다.');
  //           break;
  //         default:
  //           alert('상품 정보 수정에 실패했습니다. 다시 시도해주세요.');
  //       }
  //     } else {
  //       alert('상품 정보 수정 중 오류가 발생했습니다.');
  //     }
  //   }
  // };

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
          children: memberData ? (
            <Flex gap="middle" vertical>
              <Input disabled addonBefore="회원 ID" value={memberData.memberId} />
              <Input disabled addonBefore="회원명" value={memberData.memberName} />
              <Input disabled addonBefore="성별" value={memberData.gender} />
              <Input disabled addonBefore="휴대전화" value={memberData.memberPhoneNumber} />
              <Input disabled addonBefore="이메일" value={memberData.memberEmail} />
              <Input disabled addonBefore="생년월일" value={memberData.memberBirthday} />
            </Flex> 
          ) : ( // members 상태가 null인 경우 로딩 메시지 표시
            <div>Loading...</div>
          ),
          icon: <UserOutlined />
        },
        {
          label: '주소지 정보',
          key: '2',
          children: renderAddresses(),
          
          icon: <HomeOutlined />
        },
        {
          label: '결제수단 정보',
          key: '3',
          children: renderPaymentCards(),
          
          icon: <CreditCardOutlined />
        },
      ]} />
    </div>
  )
}

export default MemberManageDetail
