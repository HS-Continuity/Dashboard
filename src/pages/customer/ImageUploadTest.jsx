
import { Flex, Radio, Upload, Breadcrumb, Input, Button, Form } from 'antd';
const { Dragger } = Upload;

const ImageUploadTest = () => {


  const [fileList, setFileList] = useState([]);
  const meta = {
     title: 'title 1',
       contents: 'contents 1',
  }
  
  const handleUpload = () => {
     const formData = new FormData();
       fileList.forEach(file => formData.append('files', file));
       
       // FormData의 append의 경우 value에 매개변수로 JSON Object를 받지 않음.
       // JSON Object의 값들을 일일히 string으로 설정해주어야함.
       // string 데이터 입력(metadata)
       for(let key in meta) {
         formData.append(key, meta[key]);
      }
    
       axios.post('http://localhost:5000/api/board', formData, {
         header: { 'Content-Type': 'multipart/form-data'}
      });
  }

  const props = {
    name: 'files',
    multiple: true,
    action: 'http://localhost:5000/api/board/',
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false; // 파일 선택 시 바로 업로드 하지 않고 후에 한꺼번에 전송하기 위함
    },
    fileList,
  };
  



  return (
    <div>
      <Dragger {...props}></Dragger>
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  )
}

export default ImageUploadTest
