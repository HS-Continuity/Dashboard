import styled from "styled-components";
import Slider from "./Slider";

const MainPages = () => {
  return (
    <Container>
      <TextContainer>
        <MainContainer>연이은 배송, 그 연을 잇다.</MainContainer>
        <SubTextContainer>약 10,000여 명의 회원과, 농업인이 연을 잇고 있습니다.</SubTextContainer>
        <FooterTextContainer>플랫폼으로 배송 사업의 모든 과정을 한 번에.</FooterTextContainer>
      </TextContainer>

      <Slider></Slider>
    </Container>
  );
};

const TextContainer = styled.div`
  width: 100%;
  height: 45%;
  flex-direction: column;
  jusify-content: center;
  align-items: center;
  text-align: center;
  color: grey;
`;

const SubTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-size: 18px;
  font-weight: bold;
`;

const FooterTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-size: 12px;
  font-weight: bold;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  jusify-content: center;
  align-items: center;
  padding: 0px 8px;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 50%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 44px;
  font-weight: bold;

  background: #7ebaff;
  background: background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(74,120,12,1) 0%, rgba(65,131,42,1) 0%, rgba(106,214,102,0.6559217436974789) 0%, rgba(85,189,106,0.7427564775910365) 35%, rgba(22,159,81,1) 100%, rgba(0,212,255,1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  // background: #677cff;
  // background: linear-gradient(to right, #677cff 0%, #5869ff 50%, #7306b1 100%);
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
`;

export default MainPages;
