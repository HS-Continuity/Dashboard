import { Link } from "react-router-dom";
import { Button, Result } from 'antd';



const NotFound = () => {
  return (
    <Result
    status="404"
    title="404"
    subTitle="죄송합니다. 요청하신 페이지를 찾을 수 없습니다."
    // <Link to = '/'>처음으로 돌아가기</Link>
    extra={<Button type="primary">처음으로 돌아가기</Button>}
  />
  )
}

export default NotFound
