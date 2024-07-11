import { useState, useEffect } from 'react';
import { Button, Modal, Input, Form, TimePicker, message } from 'antd';
import axios from "axios";
import moment from 'moment';

const TimeAttackApplyModal = ({isModalOpen, onHandleExit, loading, selectedProductIds, setIsModalOpen, setLoading}) => {

  // -----------------------------------------------------------------
  //const [loading, setLoading] = useState(false);
  const [newTimeAttackId, setNewTimeAttackId] = useState(null);
  const [form] = Form.useForm();
  const [newServiceStatusIds, setNewServiceStatusIds] = useState([]);


  useEffect(() => {
    const fetchNewTimeAttackId = async () => {
      try {
        const response = await axios.get('http://localhost:3001/timeAttack');
        const timeAttackData = response.data;

        // 타임어택세일ID 생성
        const lastTimeAttack = response.data[response.data.length - 1];
        setNewTimeAttackId(lastTimeAttack ? lastTimeAttack.타임어택세일ID + 1 : 400013);

        // 부가서비스상태ID 생성
        const usedServiceStatusIds = timeAttackData.map(item => item.부가서비스상태ID);
        const availableServiceStatusIds = Array.from({ length: 201 }, (_, i) => 500 + i).filter(id => !usedServiceStatusIds.includes(id));
      } catch (error) {
        console.error('Error fetching new time attack ID:', error);
        setNewTimeAttackId(400013); // 기본값으로 설정
        setNewServiceStatusIds(Array.from({ length: selectedProductIds.length }, (_, i) => 500 + i));
      }
    };

    if (isModalOpen) {
      fetchNewTimeAttackId();
    }
  }, [isModalOpen, selectedProductIds.length]);

  const onFinish = async (values) => {
    //setLoading(true);

    const newTimeAttackEntries = selectedProductIds.map(productId => (
      {
        타임어택세일ID: newTimeAttackId++,
        식품ID: productId,
        부가서비스상태ID: newServiceStatusIds[index], // 필요에 따라 수정
        시작시간: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        종료시간: values.startTime.add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        할인율: values.discountRate,
      }
    ));

    try {
      const response = await axios.post('http://localhost:3001/timeAttack', newTimeAttackEntries);
      console.log('Time attack entries added:', response.data);
      message.success('타임어택 신청이 완료되었습니다.');
      handleOk();
    } catch (error) {
      console.error('Error adding time attack entries:', error);
      message.error('타임어택 신청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onFinish(values); // onFinish 함수 호출
        setIsModalOpen(false); // 모달 닫기 (선택 사항)
      })
  };

  return (
    <div>
      <Modal
        open={isModalOpen}
        // title="타임어택 신청서"
        onOk={handleOk}
        onCancel={onHandleExit}
        footer={[
          <Button key="back" onClick={onHandleExit}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={form.submit}>
            Submit
          </Button>
        ]}
      >
        <h2>타임어택 신청서</h2>
        <Form form={form} onFinish={onFinish}>
          {selectedProductIds.map(productId => (
            <Form.Item key={productId} label="식품ID" disabled>
              <Input disabled placeholder={productId} />
            </Form.Item>
          ))}
          <Form.Item 
            label="시작시간" 
            name="startTime"
            rules={[{ required: true, message: '시작시간을 입력하세요' }]}>
            {/* <TimePicker value={value} onChange={onChange} /> */}
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item 
            label="타임어택 할인율" 
            name="discountRate"
            rules={[{ required: true, message: '할인율을 입력하세요' }]}
            >
            <Input type="number" suffix="%" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
};

export default TimeAttackApplyModal
