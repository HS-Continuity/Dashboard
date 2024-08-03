import {fetchMemberAddresses, fetchMemberPaymentCards} from '../../apis/apisMembers';
import { Flex, Tabs, Input, Tag, Space, List, Typography, Card, Row, Col } from 'antd';
import { LeftOutlined, UserOutlined, HomeOutlined, CreditCardOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import './MemberManageDetailModule.css';

const { TabPane } = Tabs;
const { Title } = Typography;

const MemberManageDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {member_id} = useParams();
  //const [members, setMembers] = useState(null);
  const [memberData, setMemberData] = useState(null);

  const onHandleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  useEffect(() => {
    if (location.state) {
      setMemberData(location.state)
    }
  }, [location.state]);

  // 회원 주소 정보 가져오기
  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses", memberData?.memberId],
    queryFn: () => fetchMemberAddresses(memberData?.memberId),
    enabled: !!memberData?.memberId,
    staleTime: 60 * 1000,
  });
  
  // 회원 결제수단 정보 가져오기
  const { data: paymentCards, isLoading: paymentCardsLoading } = useQuery({
    queryKey: ["paymentCards", memberData?.memberId],
    queryFn: () => fetchMemberPaymentCards(memberData?.memberId),
    enabled: !!memberData?.memberId,
    staleTime: 60 * 1000,
    
  });


  // 회원 개인 정보 렌더링
  const renderPersonalInfo = () => {
    if (!memberData) return <div>Loading...</div>;

    const cardStyle = {
      marginBottom: '16px',
      border: '1px solid #d9d9d9',
      borderRadius: '2px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      width: '66%',
      //height: '100%'
    };

    const cardStyles = {
      head: {
        padding: '16px 24px'
      },
      body: {
        padding: '24px'
      }
    };

    const formItemStyle = {
      //marginTop: '20px',
      marginBottom: '24px',
      
    };

    const inputStyle = {
      fontSize: '14px',
      height: '32px',
      backgroundColor: 'white', // 비활성화된 입력 필드의 배경색 변경
      color: 'black', // 비활성화된 입력 필드의 텍스트 색상 변경
      opacity: 1, // 비활성화된 입력 필드의 투명도 설정
      border: '1px solid #d9d9d9', // 비활성화된 입력 필드의 테두리 설정
    };

    const labelStyle = {
      marginRight: '16px',
      fontWeight: 'bold',
    };
  
    const iconStyle = {
      fontSize: '18px',
      marginRight: '8px',
      color: '#1890ff',
    };
  
    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px', // 여백 추가
    };
  
    return (
      <div style={containerStyle}>
        <Card 
          title="회원 정보" 
          style={cardStyle} 
          styles={cardStyles}
        >
          <Row gutter={48}>
            <Col span={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={formItemStyle}>
                  <Space>
                    <IdcardOutlined style={iconStyle} />
                    <span style={labelStyle}>회원 ID:</span>
                    <Input disabled value={memberData.memberId} style={inputStyle} />
                  </Space>
                </div>
                <div style={formItemStyle}>
                  <Space>
                    <UserOutlined style={iconStyle} />
                    <span style={labelStyle}>회원명:</span>
                    <Input disabled value={memberData.memberName} style={inputStyle} />
                  </Space>
                </div>
                <div style={formItemStyle}>
                  <Space>
                    <UserOutlined style={iconStyle} />
                    <span style={labelStyle}>성별:</span>
                    <Input disabled value={memberData.gender} style={inputStyle} />
                  </Space>
                </div>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={formItemStyle}>
                  <Space>
                    <PhoneOutlined style={iconStyle} />
                    <span style={labelStyle}>휴대전화:</span>
                    <Input disabled value={memberData.memberPhoneNumber} style={inputStyle} />
                  </Space>
                </div>
                <div style={formItemStyle}>
                  <Space>
                    <MailOutlined style={iconStyle} />
                    <span style={labelStyle}>이메일:</span>
                    <Input disabled value={memberData.memberEmail} style={inputStyle} />
                  </Space>
                </div>
                <div style={formItemStyle}>
                  <Space>
                    <CalendarOutlined style={iconStyle} />
                    <span style={labelStyle}>생년월일:</span>
                    <Input disabled value={memberData.memberBirthday} style={inputStyle} />
                  </Space>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  // 회원 주소 정보 렌더링
  const renderAddresses = () => {
    if (addressesLoading) {
      return <div>주소 정보를 불러오고 있습니다...</div>;
    }
    if (!addresses) {
      return <div>주소 정보를 찾을 수 없습니다.</div>
    }

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


  // 회원 결제 수단 정보 렌더링
  const renderPaymentCards = () => {
    if (paymentCardsLoading) return <div>결제 수단 정보를 불러오는 중...</div>;
    if (!paymentCards) return <div>결제 수단 정보가 없습니다.</div>;

    const sortedCards = [...paymentCards].sort((a, b) => {
      if (a.isDefaultPaymentCard === 'ACTIVE') return -1; // 'ACTIVE'인 항목을 앞으로
      if (b.isDefaultPaymentCard === 'ACTIVE') return 1; // 'ACTIVE'인 항목을 앞으로
      return 0; // 나머지 항목은 순서 유지
    });
  

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
          children: renderPersonalInfo(),
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
