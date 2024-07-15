import { fetchCustomerListById, updateMember } from '../../apis';
import { Flex, Tabs, Space, Form, Input, Button, Table } from 'antd';
import moment from 'moment';
import { LeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const { TabPane } = Tabs;

const MemberManageDetail = () => {
  const navigate = useNavigate();
  const {member_id} = useParams();
  const [productForm, setProductForm] = useState({}); // 각 필드별 상태 관리

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const { data: member, isLoading } = useQuery({
    queryKey: ["member", member_id],
    queryFn: () => fetchCustomerListById(member_id),
    enabled: !!member_id,
    staleTime: 60 * 1000,
  });

  // console.log("내가 뽑은:",member)

  useEffect(() => {
    if (member) { 
      setProductForm(member[0]);
    }
  }, [member]);

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
    console.log('무슨아이템을가지고있니?:',member_id)
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
          children: member && (
            <Flex gap="middle" vertical>
              <Input disabled addonBefore="회원 ID" value={member[0].member_id} />
              <Input disabled addonBefore="회원명" value={member[0].member_name} />
              <Input disabled addonBefore="성별" value={member[0].gender} />
              <Input disabled addonBefore="휴대전화" value={member[0].mobile_phone} />
              <Input disabled addonBefore="이메일" value={member[0].email} />
              {/* {addresses.length > 0 && (
                <Input disabled addonBefore="주소" value={addresses[0].address} style={{ width: 600 }} />
              )} */}
            </Flex>
          ),
        },
        {
          label: '주소 정보',
          key: '2',
          children: (
            <Flex gap="middle" vertical>
              {/* {addresses.map((address, index) => (
                <Input
                  key={address.id}
                  disabled
                  addonBefore={`주소지 ${index + 1}`}
                  value={address.address}
                  style={{ width: 600 }}
                />
              ))} */}
            </Flex>
          ),
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
