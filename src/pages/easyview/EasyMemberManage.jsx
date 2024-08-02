import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Input,
  Flex,
  Space,
  Table,
  Button,
  Row,
  Col,
  Tabs,
  Typography,
  Descriptions,
  Card,
  message,
  List,
  Tag,
} from "antd";
import {
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  UserOutlined,
  IdcardOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";
import AddressList from "../../components/Easyview/member/AddressList";
import CardList from "../../components/Easyview/member/CardList";
import {
  fetchStoreMembers,
  fetchMemberAddresses,
  fetchMemberPaymentCards,
} from "../../apis/apisMembers";
import Title from "antd/es/skeleton/Title";

const { TabPane } = Tabs;
const { Text } = Typography;

const EasyMemberManage = () => {
  const searchInput = useRef(null);

  // State management
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

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {
        customerId: 1,
        page: pagination.current - 1,
        size: pagination.pageSize,
      };

      const response = await fetchStoreMembers(params);

      const transformedMembers = response.content.map(member => ({
        member_id: member.memberId.toString(),
        member_name: member.memberName,
        mobile_phone: member.memberPhoneNumber,
        email: member.memberEmail,
        gender: member.gender === "MALE" ? "남" : "여",
        birthday: member.memberBirthday,
      }));

      setMembers(transformedMembers);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch members:", error);
      message.error("회원 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [pagination.current, pagination.pageSize]);

  // Fetch member addresses
  const { data: addresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: ["address", selectedMemberId],
    queryFn: () => fetchMemberAddresses(selectedMemberId),
    enabled: !!selectedMemberId,
  });

  // Fetch member payment cards
  const { data: cards, isLoading: isCardsLoading } = useQuery({
    queryKey: ["card", selectedMemberId],
    queryFn: () => fetchMemberPaymentCards(selectedMemberId),
    enabled: !!selectedMemberId,
  });

  // Table related functions
  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPagination(pagination);
  };

  const clearFilters = () => {
    setFilteredInfo({});
    fetchMembers();
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
        setSelectedMemberId(record.member_id);
      },
    }),
    []
  );

  // Search and filtering related functions
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button type='link' size='small' onClick={close}>
            close
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

  // Column definitions
  const getColumns = () => [
    {
      title: "회원 아이디",
      dataIndex: "member_id",
      key: "member_id",
      ...getColumnSearchProps("member_id"),
      filteredValue: filteredInfo.member_id || null,
    },
    {
      title: "회원명",
      dataIndex: "member_name",
      key: "member_name",
      ...getColumnSearchProps("member_name"),
      filteredValue: filteredInfo.member_name || null,
      sorter: (a, b) => a.member_name.localeCompare(b.member_name),
      sortOrder: sortedInfo.columnKey === "member_name" && sortedInfo.order,
    },
  ];

  const AddressList = ({ addresses }) => (
    <List
      itemLayout='vertical'
      dataSource={addresses}
      renderItem={address => (
        <List.Item>
          <Card>
            <Descriptions
              column={1}
              labelStyle={{ fontSize: "18px" }}
              contentStyle={{ fontSize: "18px" }}>
              <Descriptions.Item label='주소명'>{address.addressName}</Descriptions.Item>
              <Descriptions.Item label='수령인'>{address.recipientName}</Descriptions.Item>
              <Descriptions.Item label='연락처'>{address.recipientPhoneNumber}</Descriptions.Item>
              <Descriptions.Item label='주소'>
                {address.generalAddress} {address.detailAddress}
              </Descriptions.Item>
              <Descriptions.Item>
                {address.isDefaultAddress === "ACTIVE" && (
                  <Tag color='blue' style={{ fontSize: "16px" }}>
                    기본 주소
                  </Tag>
                )}
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
          <Card>
            <Descriptions
              column={1}
              labelStyle={{ fontSize: "18px" }}
              contentStyle={{ fontSize: "18px" }}>
              <Descriptions.Item label='카드사'>{card.cardCompany}</Descriptions.Item>
              <Descriptions.Item label='카드번호'>{card.cardNumber}</Descriptions.Item>
              <Descriptions.Item label='유효기간'>{card.cardExpiration}</Descriptions.Item>
              <Descriptions.Item>
                {card.isDefaultPaymentCard === "ACTIVE" && (
                  <Tag color='blue' style={{ fontSize: "16px" }}>
                    기본 결제 수단
                  </Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </List.Item>
      )}
    />
  );

  const tabItems = [
    {
      label: "개인 정보",
      key: "1",
      children: selectedMemberId ? (
        <Descriptions
          bordered
          column={{ xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          labelStyle={{ fontSize: "20px" }}
          contentStyle={{ fontSize: "20px" }}>
          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined /> 회원 ID
              </Space>
            }>
            {selectedMemberId}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <UserOutlined /> 회원명
              </Space>
            }>
            {members.find(m => m.member_id === selectedMemberId)?.member_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                {members.find(m => m.member_id === selectedMemberId)?.gender === "남" ? (
                  <ManOutlined />
                ) : (
                  <WomanOutlined />
                )}{" "}
                성별
              </Space>
            }>
            {members.find(m => m.member_id === selectedMemberId)?.gender}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <PhoneOutlined /> 휴대전화
              </Space>
            }>
            {members.find(m => m.member_id === selectedMemberId)?.mobile_phone}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <MailOutlined /> 이메일
              </Space>
            }>
            {members.find(m => m.member_id === selectedMemberId)?.email}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Text style={{ fontSize: "20px" }}>회원을 선택하면 상세 정보가 표시됩니다.</Text>
      ),
    },
    {
      label: "주소지 정보",
      key: "2",
      children: isAddressesLoading ? (
        <div style={{ fontSize: "20px" }}>주소 정보를 불러오는 중...</div>
      ) : (
        <AddressList addresses={addresses} />
      ),
    },
    {
      label: "결제 수단 정보",
      key: "3",
      children: isCardsLoading ? (
        <div style={{ fontSize: "20px" }}>카드 정보를 불러오는 중...</div>
      ) : (
        <CardList cards={cards} />
      ),
    },
  ];

  return (
    <Row gutter={32}>
      <Col span={12}>
        <Card
          title={"회원 이름"}
          style={{ marginBottom: 16 }}
          extra={
            <Button onClick={clearAll} size='large' style={{ fontSize: "18px" }}>
              정렬 초기화
            </Button>
          }>
          <Flex gap='small' justify='end' style={{ marginBottom: "20px" }}>
            {/* <Button onClick={clearFilters} size='large' style={{ fontSize: "18px" }}>
            정렬 제거
          </Button> */}
            {/* <Button onClick={clearAll} size='large' style={{ fontSize: "18px" }}>
              정렬 초기화
            </Button> */}
          </Flex>
          <Table
            columns={getColumns()}
            dataSource={members}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
            }}
            onChange={handleTableChange}
            onRow={onRow}
            rowKey='member_id'
            loading={loading}
            style={{ fontSize: "16px" }}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title={"회원 상세 정보"} style={{ marginBottom: 16 }}>
          {selectedMemberId ? (
            <Tabs defaultActiveKey='1' items={tabItems} style={{ fontSize: "18px" }} />
          ) : (
            <Text style={{ fontSize: "20px" }}>
              왼쪽 테이블에서 회원을 선택하면 상세 정보가 표시됩니다.
            </Text>
          )}
        </Card>
      </Col>
    </Row>
  );
};
export default EasyMemberManage;
