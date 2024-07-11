import { Flex, Tag, DatePicker, Form, Input, Button, Table } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProductCreate = () => {

  const navigate = useNavigate();

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
          <h2>식품 등록</h2>
        </Flex>
      </Flex>
    </div>
  )
}

export default ProductCreate
