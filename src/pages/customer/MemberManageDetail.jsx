import { Flex, Tag, DatePicker, Form, Input, Button, Table } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const MemberManageDetail = () => {
  
  const location = useLocation();
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberGender, setMemberGender] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setMemberId(location.state?.selectedMemberId || '');
    setMemberName(location.state?.selectedMemberName || '');
    setMemberGender(location.state?.selectedMemberGender || '');
    setMemberPhone(location.state?.selectedMemberPhone || '');
    setMemberEmail(location.state?.selectedMemberEmail || '');
  }, [location.state]);

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };


  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        <LeftOutlined  onClick={onHandleBackClick}/>
        </Flex>
        <Flex gap="small" wrap>
          <h2>회원상세정보</h2>
        </Flex>
      </Flex>
      
      <Flex 
        gap="5rem" 
        vertical>
        <Flex gap="3rem">
          <Form>
            <h3>회원아이디</h3>
            <Input disabled placeholder={memberId}  />
          </Form>
          <Form>
            <h3>회원명</h3>
            <Input disabled placeholder={memberName}  />
          </Form>
          <Form>
            <h3>성별</h3>
            <Input disabled placeholder={memberGender}  />
          </Form>
        </Flex>
        <Flex gap="3rem">
          <Form>
            <h3>휴대전화번호</h3>
            <Input disabled placeholder={memberPhone}  />
          </Form>
          
        </Flex>
        <Flex gap="3rem">
          <Form>
            <h3>이메일</h3>
            <Input 
              disabled 
              placeholder={memberEmail}
              style={{ width: 500 }}  />
          </Form>
        </Flex>
        <Flex gap="middle">
          <Form>
            <h3>주소</h3>
            <Form.Item style={{ marginBottom: '1rem'}}>
              <Input 
                disabled 
                placeholder="우편번호" 
                style={{width: 200}}
                />
            </Form.Item>
            <Form.Item style={{ marginBottom: '1rem' }}>
              <Input 
                disabled 
                placeholder="주소" 
                style={{width: 600}}
                />
            </Form.Item>
            <Form.Item>
              <Input 
                disabled 
                placeholder="상세주소" 
                style={{width: 600}}
                />
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
        
    </div>
  )
}

export default MemberManageDetail
