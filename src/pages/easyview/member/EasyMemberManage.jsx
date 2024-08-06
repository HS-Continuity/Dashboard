import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Input,
  Space,
  Table,
  Button,
  Row,
  Col,
  Tabs,
  Typography,
  Descriptions,
  Card,
  List,
  Tag,
  Slider,
  message,
} from "antd";
import {
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  UserOutlined,
  IdcardOutlined,
  WomanOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStoreMembers,
  fetchMemberAddresses,
  fetchMemberPaymentCards,
} from "../../../apis/apisMembers";
import { useFontSizeStore } from "../../../stores/fontSizeStore";
import useAuthStore from "../../../stores/useAuthStore";

const { Text } = Typography;

const EasyMemberManage = () => {
  const searchInput = useRef(null);
  const { tableFontSize, setTableFontSize } = useFontSizeStore();
  const { username } = useAuthStore();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const getTableCellStyle = () => ({
    fontSize: `${tableFontSize}px`,
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: String(username),
        page: pagination.current - 1,
        size: pagination.pageSize,
      };

      const response = await fetchStoreMembers(params);

      const transformedMembers = response.content.map(member => ({
        memberId: member.memberId.toString(),
        memberName: member.memberName,
        memberPhoneNumber: member.memberPhoneNumber,
        memberEmail: member.memberEmail,
        gender: member.gender,
        memberBirthday: member.memberBirthday,
      }));

      setMembers(transformedMembers);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (error) {
      message.error("회원 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [pagination.current, pagination.pageSize]);

  const { data: addresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: ["address", selectedMemberId],
    queryFn: () => fetchMemberAddresses(selectedMemberId),
    enabled: !!selectedMemberId,
  });

  const { data: cards, isLoading: isCardsLoading } = useQuery({
    queryKey: ["card", selectedMemberId],
    queryFn: () => fetchMemberPaymentCards(selectedMemberId),
    enabled: !!selectedMemberId,
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPagination(pagination);
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setPagination({
      current: 1,
      pageSize: 5,
    });
    fetchMembers();
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const onRow = useCallback(
    record => ({
      onClick: () => {
        setSelectedMemberId(record.memberId);
      },
    }),
    []
  );

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`검색할 내용을 입력해 주세요.`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            검색
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}>
            초기화
          </Button>
          <Button type='link' size='small' onClick={close}>
            닫기
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumns = () => [
    {
      title: "회원 아이디",
      dataIndex: "memberId",
      key: "memberId",
      ...getColumnSearchProps("memberId"),
      filteredValue: filteredInfo.memberId || null,
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
    {
      title: "회원명",
      dataIndex: "memberName",
      key: "memberName",
      ...getColumnSearchProps("memberName"),
      filteredValue: filteredInfo.memberName || null,
      sorter: (a, b) => a.memberName.localeCompare(b.memberName),
      sortOrder: sortedInfo.columnKey === "memberName" && sortedInfo.order,
      onCell: () => ({
        style: getTableCellStyle(),
      }),
    },
  ];

  const maskCardNumber = number => {
    return `${"*".repeat(4)}-${"*".repeat(4)}-${"*".repeat(4)}-${number.slice(-4)}`;
  };

  const DefaultTag = ({ isDefault, text }) =>
    isDefault === "ACTIVE" && (
      <Tag color='blue' style={{ fontSize: "14px", padding: "0 8px" }}>
        {text}
      </Tag>
    );

  // Descriptions 컴포넌트에 적용할 스타일
  const getDescriptionsStyle = () => ({
    ...getTableCellStyle(),
    "& .ant-descriptions-item-label, & .ant-descriptions-item-content": {
      ...getTableCellStyle(),
    },
    "& .ant-descriptions-item-label *, & .ant-descriptions-item-content *": {
      fontSize: `${tableFontSize}px !important`,
    },
  });

  // 모든 텍스트 요소에 폰트 크기를 적용하는 함수
  const applyFontSize = node => {
    if (typeof node === "string" || typeof node === "number") {
      return <span style={getTableCellStyle()}>{node}</span>;
    }
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        style: { ...node.props.style, ...getTableCellStyle() },
        children: React.Children.map(node.props.children, applyFontSize),
      });
    }
    return node;
  };

  const AddressList = ({ addresses }) => (
    <List
      itemLayout='vertical'
      dataSource={addresses}
      renderItem={address => (
        <List.Item>
          <Card size='small' bodyStyle={{ padding: "12px" }}>
            <Descriptions
              column={1}
              size='small'
              colon={false}
              labelStyle={{
                ...getTableCellStyle(),
                fontWeight: "bold",
                width: "120px",
                display: "inline-block",
                verticalAlign: "top",
              }}
              contentStyle={{
                ...getTableCellStyle(),
                display: "inline-block",
                verticalAlign: "top",
              }}>
              <Descriptions.Item label='주소명'>
                <Space align='baseline'>
                  <span style={getTableCellStyle()}>{address.addressName}</span>
                  <DefaultTag isDefault={address.isDefaultAddress} text='기본 주소' />
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label='수령인'>{address.recipientName}</Descriptions.Item>
              <Descriptions.Item label='연락처'>{address.recipientPhoneNumber}</Descriptions.Item>
              <Descriptions.Item label='주소'>
                {address.generalAddress} {address.detailAddress}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </List.Item>
      )}
    />
  );

  const CardList = ({ cards }) => (
    <List
      itemLayout='vertical'
      dataSource={cards}
      renderItem={card => (
        <List.Item>
          <Card size='small' bodyStyle={{ padding: "12px" }}>
            <Descriptions
              column={1}
              size='small'
              colon={false}
              labelStyle={{
                ...getTableCellStyle(),
                fontWeight: "bold",
                width: "140px",
                display: "inline-block",
                verticalAlign: "top",
              }}
              contentStyle={{
                ...getTableCellStyle(),
                display: "inline-block",
                verticalAlign: "top",
              }}>
              <Descriptions.Item label='카드사'>
                <Space align='baseline'>
                  <span style={getTableCellStyle()}>{card.cardCompany}</span>
                  <DefaultTag isDefault={card.isDefaultPaymentCard} text='기본 결제 수단' />
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label='카드번호'>
                {maskCardNumber(card.cardNumber)}
              </Descriptions.Item>
              <Descriptions.Item label='유효기간'>{card.cardExpiration}</Descriptions.Item>
            </Descriptions>
          </Card>
        </List.Item>
      )}
    />
  );

  const selectedMember = members.find(m => m.memberId === selectedMemberId);

  const tabItems = [
    {
      label: "개인 정보",
      key: "1",
      children: selectedMemberId ? (
        <Descriptions
          bordered
          column={{ xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          labelStyle={getTableCellStyle()}
          contentStyle={getTableCellStyle()}
          style={getDescriptionsStyle()}>
          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined style={getTableCellStyle()} /> 회원 ID
              </Space>
            }>
            {applyFontSize(selectedMemberId)}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <UserOutlined style={getTableCellStyle()} /> 회원명
              </Space>
            }>
            {applyFontSize(selectedMember?.memberName)}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                {selectedMember?.gender === "MALE" ? (
                  <ManOutlined style={getTableCellStyle()} />
                ) : (
                  <WomanOutlined style={getTableCellStyle()} />
                )}{" "}
                성별
              </Space>
            }>
            {applyFontSize(selectedMember?.gender === "MALE" ? "남" : "여")}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <PhoneOutlined style={getTableCellStyle()} /> 휴대전화
              </Space>
            }>
            {applyFontSize(selectedMember?.memberPhoneNumber)}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <MailOutlined style={getTableCellStyle()} /> 이메일
              </Space>
            }>
            {applyFontSize(selectedMember?.memberEmail)}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined style={getTableCellStyle()} /> 생년월일
              </Space>
            }>
            {applyFontSize(selectedMember?.memberBirthday)}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Text style={getTableCellStyle()}>회원을 선택하면 상세 정보가 표시됩니다.</Text>
      ),
    },
    {
      label: "주소지 정보",
      key: "2",
      children: isAddressesLoading ? (
        <div style={getTableCellStyle()}>주소 정보를 불러오는 중...</div>
      ) : (
        <AddressList addresses={addresses} />
      ),
    },
    {
      label: "결제 수단 정보",
      key: "3",
      children: isCardsLoading ? (
        <div style={getTableCellStyle()}>카드 정보를 불러오는 중...</div>
      ) : (
        <CardList cards={cards} />
      ),
    },
  ];

  return (
    <div style={getTableCellStyle()}>
      <Row gutter={32}>
        <Col span={12}>
          <Card
            title={"회원 목록"}
            style={{ marginBottom: 16 }}
            extra={
              <Row gutter={16} align='middle' justify='start'>
                <Text strong>글꼴 크기:</Text>
                <Col style={{ marginRight: "80px" }}>
                  <Slider
                    min={12}
                    max={30}
                    value={tableFontSize}
                    onChange={setTableFontSize}
                    style={{ width: 200, marginBottom: 12 }}
                  />
                </Col>
                <Col>
                  <Button onClick={clearAll} style={getTableCellStyle()}>
                    정렬 초기화
                  </Button>
                </Col>
              </Row>
            }>
            <Table
              columns={getColumns()}
              dataSource={members}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
                style: getTableCellStyle(),
              }}
              onChange={handleTableChange}
              onRow={onRow}
              rowKey='memberId'
              loading={loading}
              style={getTableCellStyle()}
            />
          </Card>
        </Col>
        <Col span={12}>
          {selectedMemberId ? (
            <Tabs
              defaultActiveKey='1'
              items={tabItems}
              style={getTableCellStyle()}
              tabBarStyle={getTableCellStyle()}
            />
          ) : (
            <Text style={getTableCellStyle()}>
              왼쪽에서 회원을 선택하면 상세 정보가 표시됩니다.
            </Text>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default EasyMemberManage;
