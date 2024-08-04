import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Space, Table, Button, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import Highlighter from "react-highlight-words";

import RegisterButton from "../../components/Buttons/RegisterButton";
import ApplyButton from "../../components/Buttons/ApplyButton";
import TimeSaleApplyModal from "../../components/Easyview/product/TimeSaleApplyModal";
import ProductApplyModal from "../../components/Easyview/product/ProductApplyModal";
import { fetchProductItems } from "../../apis/apisProducts";

const EasyProductGeneral = () => {
  const navigate = useNavigate();
  const searchInput = useRef(null);

  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
    selectedRowKeys: [],
    filteredInfo: {},
    isModalOpen: false,
    lastClickedRow: null,
    lastClickedTime: null,
    tableParams: {
      pagination: { current: 1, pageSize: 20 },
    },
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const showProductModal = () => {
    setIsProductModalOpen(true);
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: fetchProductItems,
  });

  const updateState = useCallback(updates => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    updateState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    updateState({ searchText: "" });
  };

  const handleTableChange = (pagination, filters) => {
    updateState({ filteredInfo: filters, tableParams: { pagination } });
  };

  const showModal = () => {
    if (state.selectedRowKeys.length === 0) {
      message.warning("타임어택을 신청할 상품을 선택하세요.");
      return;
    }
    updateState({ isModalOpen: true });
  };

  const handleCloseModal = () => {
    updateState({ isModalOpen: false });
  };

  const handleRowClick = (record, rowIndex) => {
    const currentTime = new Date().getTime();
    if (state.lastClickedRow === rowIndex && currentTime - state.lastClickedTime < 300) {
      navigate(`${record.productId}`);
    }
    updateState({
      lastClickedRow: rowIndex,
      lastClickedTime: currentTime,
    });
  };

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
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "식품ID",
      dataIndex: "productId",
      key: "productId",
      ...getColumnSearchProps("productId"),
    },
    {
      title: "고객ID",
      dataIndex: "customerId",
      key: "customerId",
      ...getColumnSearchProps("customerId"),
    },
    {
      title: "식품상세카테고리ID",
      dataIndex: "productDetailCategoryId",
      key: "productDetailCategoryId",
      ...getColumnSearchProps("productDetailCategoryId"),
    },
    {
      title: "식품명",
      dataIndex: "productName",
      key: "productName",
      ...getColumnSearchProps("productName"),
    },
    {
      title: "판매타입코드",
      dataIndex: "saleTypeCode",
      key: "saleTypeCode",
      ...getColumnSearchProps("saleTypeCode"),
    },
    {
      title: "식품가격",
      dataIndex: "productPrice",
      key: "productPrice",
      render: price => price.toLocaleString("ko-KR", { style: "currency", currency: "KRW" }),
      ...getColumnSearchProps("productPrice"),
    },
    {
      title: "기본할인율",
      dataIndex: "defaultDiscountPrice",
      key: "defaultDiscountPrice",
      render: value => `${value}%`,
      ...getColumnSearchProps("defaultDiscountPrice"),
    },
    {
      title: "정기배송할인율",
      dataIndex: "regularDeliveryDiscountPrice",
      key: "regularDeliveryDiscountPrice",
      render: value => `${value}%`,
      ...getColumnSearchProps("regularDeliveryDiscountPrice"),
    },
    {
      title: "페이지노출여부",
      dataIndex: "pageExposureStatus",
      key: "pageExposureStatus",
      filters: [
        { text: "노출", value: "O" },
        { text: "미노출", value: "X" },
      ],
      onFilter: (value, record) => record.pageExposureStatus === value,
      width: 100,
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Flex gap='small' align='center' justify='space-between'>
        <h2>일반식품관리</h2>
        <Flex gap='small' wrap>
          {/* <RegisterButton title='식품 등록' onClick={() => navigate("../create")} /> */}
          <Button onClick={showProductModal}>식품 등록</Button>
          <ProductApplyModal
            isProductModalOpen={isProductModalOpen}
            setIsProductModalOpen={setIsProductModalOpen}
          />
          <ApplyButton title='타임어택' onClick={showModal} />
          <ApplyButton title='친환경 전환' onClick={() => navigate("../create")} />
        </Flex>
      </Flex>
      <Button onClick={() => updateState({ filteredInfo: {} })}>Clear Filters</Button>
      <Table
        columns={columns}
        rowSelection={{
          selectedRowKeys: state.selectedRowKeys,
          onChange: selectedRowKeys => updateState({ selectedRowKeys }),
        }}
        dataSource={product}
        pagination={state.tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ y: 600 }}
        onRow={(record, rowIndex) => ({
          onClick: () => handleRowClick(record, rowIndex),
        })}
        rowKey='productId'
      />
      <TimeSaleApplyModal
        isModalOpen={state.isModalOpen}
        setIsModalOpen={handleCloseModal}
        selectedProductIds={state.selectedRowKeys}
      />
    </div>
  );
};

export default EasyProductGeneral;
