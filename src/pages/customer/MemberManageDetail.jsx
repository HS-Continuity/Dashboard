import { Flex, Tabs, Space, Form, Input, Button, Table } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { TabPane } = Tabs;

const MemberManageDetail = () => {
  
  // const location = useLocation();
  // const [memberId, setMemberId] = useState('');
  // const [memberName, setMemberName] = useState('');
  // const [memberGender, setMemberGender] = useState('');
  // const [memberPhone, setMemberPhone] = useState('');
  // const [memberEmail, setMemberEmail] = useState('');

  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // useEffect(() => {
  //   setMemberId(location.state?.selectedMemberId || '');
  //   setMemberName(location.state?.selectedMemberName || '');
  //   setMemberGender(location.state?.selectedMemberGender || '');
  //   setMemberPhone(location.state?.selectedMemberPhone || '');
  //   setMemberEmail(location.state?.selectedMemberEmail || '');
  // }, [location.state]);



  // useEffect(() => {
  //   axios.get(`http://localhost:3001/member/${customerId}`)
  //     .then(res => setCustomer(res.data))
  //     .catch(err => console.error(err));

  //   axios.get(`http://localhost:3001/address?member_id=${customerId}`)
  //     .then(res => setAddresses(res.data))
  //     .catch(err => console.error(err));
  // }, [customerId]);

  // const onHandleBackClick = () => {
  //   navigate(-1); // 이전 페이지로 이동
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
          children: customer && (
            <Flex gap="middle" vertical>
              <Input disabled addonBefore="회원 ID" value={customer.member_id} />
              <Input disabled addonBefore="회원명" value={customer.member_name} />
              <Input disabled addonBefore="성별" value={customer.gender} />
              <Input disabled addonBefore="휴대전화" value={customer.mobile_phone} />
              <Input disabled addonBefore="이메일" value={customer.email} style={{ width: 500 }} />
              {addresses.length > 0 && (
                <Input disabled addonBefore="주소" value={addresses[0].address} style={{ width: 600 }} />
              )}
            </Flex>
          ),
        },
        {
          label: '주소 정보',
          key: '2',
          children: (
            <Flex gap="middle" vertical>
              {addresses.map((address, index) => (
                <Input
                  key={address.id}
                  disabled
                  addonBefore={`주소지 ${index + 1}`}
                  value={address.address}
                  style={{ width: 600 }}
                />
              ))}
            </Flex>
          ),
        },
      ]} />

      <Space style={{ marginTop: 16 }}>
        <Button onClick={onHandleBackClick}>목록</Button>
        {/* 수정, 삭제 등 추가 버튼 */}
      </Space>
    </div>
  )
}

export default MemberManageDetail
