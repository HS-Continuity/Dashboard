import { Input, Space } from 'antd'

const { Search } = Input;

// const onSearch = (value, _e, info);

const CommonSearchBar = ({title}) => {
  return (
    <Space direction="vertical">
      <Search placeholder={title} 
              // onSearch={onSearch} 
              style={{ width: 200 }} />
    </Space>
  );
};

export default CommonSearchBar
