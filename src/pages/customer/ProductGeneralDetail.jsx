import { Flex, Tag, DatePicker, Form, Input, Button, Table } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProductGeneralDetail = () => {
  return (
    <div>
      <Flex gap="small" justify='flex-start'> 
        <Flex gap="small" wrap>
        {/* <LeftOutlined  onClick={onHandleBackClick}/> */}
        </Flex>
        <Flex gap="small" wrap>
          <h2>일반식품상세</h2>
        </Flex>
      </Flex>
    </div>
  )
}

export default ProductGeneralDetail
