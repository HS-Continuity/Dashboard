import { useState, useEffect } from "react";
import { Button, Modal, Input, Form, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";
import { addTimeAttackItems } from "../../../apis";
import locale from "antd/es/date-picker/locale/ko_KR";

// 월 이름과 요일을 한글로 변경
const koLocale = { ...locale };
koLocale.lang = {
  ...koLocale.lang,
  monthFormat: "M월",
  monthSelect: "월 선택",
  shortMonths: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  shortWeekDays: ["일", "월", "화", "수", "목", "금", "토"],
  weekdays: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
};

const TimeSaleApplyModal = ({ isModalOpen, selectedProductIds, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const [newTimeSaleId, setNewTimeSaleId] = useState(400013);
  const [newServiceStatusIds, setNewServiceStatusIds] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchNewTimeSaleId = async () => {
      try {
        const response = await axios.get("http://localhost:3001/timeAttack");
        const timeAttackData = response.data;
        const lastTimeAttack = timeAttackData[timeAttackData.length - 1];
        setNewTimeSaleId(lastTimeAttack ? lastTimeAttack.timeAttackSaleId + 1 : 400013);

        const usedServiceStatusIds = timeAttackData.map(item => item.additionalServiceStatusId);
        const availableServiceStatusIds = Array.from({ length: 201 }, (_, i) => 500 + i).filter(
          id => !usedServiceStatusIds.includes(id)
        );
        setNewServiceStatusIds(availableServiceStatusIds.slice(0, selectedProductIds.length));
      } catch (error) {
        console.error("Error fetching new time attack ID:", error);
        setNewServiceStatusIds(
          Array.from({ length: selectedProductIds.length }, (_, i) => 500 + i)
        );
      }
    };

    fetchNewTimeSaleId();
  }, [selectedProductIds]);

  const onFinish = async values => {
    setLoading(true);
    const newTimeAttackEntries = selectedProductIds.map((productId, index) => ({
      타임어택세일ID: newTimeSaleId + index,
      식품ID: productId,
      부가서비스상태ID: newServiceStatusIds[index],
      시작시간: moment(values.startTime).format("YYYY-MM-DD HH:mm:ss"),
      종료시간: moment(values.startTime).add(3, "hours").format("YYYY-MM-DD HH:mm:ss"),
      할인율: values.discountRate,
    }));

    try {
      await addTimeAttackItems(newTimeAttackEntries);
      message.success("타임어택 신청이 완료되었습니다.");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding time attack entries:", error);
      message.error("타임어택 신청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      title='타임어택 신청서'
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <Button key='cancel' onClick={() => setIsModalOpen(false)}>
          취소
        </Button>,
        <Button key='submit' type='primary' loading={loading} onClick={form.submit}>
          제출
        </Button>,
      ]}>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        {selectedProductIds.map(productId => (
          <Form.Item key={productId} label='식품ID'>
            <Input disabled value={productId} />
          </Form.Item>
        ))}
        <Form.Item
          label='시작시간'
          name='startTime'
          rules={[{ required: true, message: "시작 시간을 입력하세요" }]}>
          <DatePicker showTime format='YYYY-MM-DD HH' locale={koLocale} />
        </Form.Item>
        <Form.Item
          label='타임어택 할인율'
          name='discountRate'
          rules={[{ required: true, message: "할인율을 입력하세요" }]}>
          <Input type='number' suffix='%' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TimeSaleApplyModal;
