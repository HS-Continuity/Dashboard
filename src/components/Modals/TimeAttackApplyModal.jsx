import { addTimeAttackItems } from '../../apis';
import { useState, useEffect } from 'react';
import { Button, Modal, Input, Form, DatePicker, message } from 'antd';
import axios from "axios";
import moment from 'moment';

const TimeAttackApplyModal = ({isModalOpen, loading, selectedProductIds, setIsModalOpen, setLoading}) => {

  // -----------------------------------------------------------------
  //const [loading, setLoading] = useState(false);
  const [newTimeSaleId, setNewTimeSaleId] = useState(null);
  const [form] = Form.useForm();
  const [newServiceStatusIds, setNewServiceStatusIds] = useState([]);

  const onHandleExit = () => {
    setIsModalOpen(false); // 모달 상태 변경
    form.resetFields(); // 폼 초기화 (선택 사항)
  };

  useEffect(() => {
    const fetchNewTimeSaleId = async () => {
      try {
        const response = await axios.get('http://localhost:3001/timeSale');
        const timeAttackData = response.data;
        // console.log("데이터:", timeAttackData)

        // 타임어택세일ID 생성 (서버에서 생성된 값을 사용하는 것이 더 안전합니다.)
        const lastTimeAttack = timeAttackData[timeAttackData.length - 1];
        setNewTimeSaleId(lastTimeAttack ? lastTimeAttack.timeAttackSaleId + 1 : 400013);

        // 부가서비스상태ID 생성
        const usedServiceStatusIds = timeAttackData.map(item => item.additionalServiceStatusId);
        const availableServiceStatusIds = Array.from({ length: 201 }, (_, i) => 500 + i).filter(id => !usedServiceStatusIds.includes(id));
        setNewServiceStatusIds(availableServiceStatusIds.slice(0, selectedProductIds.length));
      } catch (error) {
        console.error('Error fetching new time attack ID:', error);
        setNewTimeSaleId(400013); // 기본값으로 설정
        setNewServiceStatusIds(Array.from({ length: selectedProductIds.length }, (_, i) => 500 + i));
      }
    };

    fetchNewTimeSaleId();
  }, [selectedProductIds.length]);

  const onFinish = async (values) => {
    setLoading(true);

    const newTimeAttackEntries = selectedProductIds.map((productId, index) => ({
      타임어택세일ID: newTimeSaleId++,
      식품ID: productId,
      부가서비스상태ID: newServiceStatusIds[index],
      시작시간: moment(values.startTime).format('YYYY-MM-DD HH:mm:ss'),
      종료시간: moment(values.startTime).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      할인율: values.discountRate,
    }));

    try {
      // 별도 파일에서 가져온 addTimeAttackItems 함수 호출
      const response = await addTimeAttackItems(newTimeAttackEntries);
      console.log('Time attack entries added:', response);

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
            {/* <TimePicker format="HH:mm" /> */}
            <DatePicker
              showTime
              size='large'
              onChange={(value, dateString) => {
                console.log('Selected Time: ', value);
                console.log('Formatted Selected Time: ', dateString);
              }}
              // onOk={onOk}
            />
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
