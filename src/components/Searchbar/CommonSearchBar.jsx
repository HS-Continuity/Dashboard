import { Input, Space } from 'antd'

const { Search } = Input;

// const onSearch = (value, _e, info);

const CommonSearchBar = ({title, onSearch}) => {  //  prop 추가
  const handleSearch = (value) => {
    if (onSearch) {
      onSearch(value);  // 부모 component의 onSearch 함수 호출
    }
  };
  return (
    <Space direction="vertical">
      <Search placeholder={title} // placeholder prop 연결
              onSearch={handleSearch} // onSearch prop 연결
              style={{ width: 200 }} />
    </Space>
  );
};

export default CommonSearchBar
