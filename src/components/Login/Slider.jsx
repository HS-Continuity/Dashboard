import { useEffect, useState } from "react";
import styles from "./slider.module.css";
import styled from "styled-components";
const data = [
  {
    icon: "🍆",
    title: "그린농장",
    description: "김상덕 사장님",
  },
  {
    icon: "🍒",
    title: "신선수확",
    description: "이영희 사장님",
  },
  {
    icon: "🍎",
    title: "농부시장",
    description: "박재원 사장님",
  },
  {
    icon: "🫒",
    title: "채소마을",
    description: "정민석 사장님",
  },
  {
    icon: "🥝",
    title: "유기농식료품점",
    description: "최승호 사장님",
  },
  {
    icon: "🍓",
    title: "그린농장",
    description: "한지민 사장님",
  },
  {
    icon: "🍉",
    title: "신선수확",
    description: "오지훈 사장님",
  },
  {
    icon: "🍅",
    title: "농부시장",
    description: "임소라 사장님",
  },
  {
    icon: "🍇",
    title: "채소마을",
    description: "윤성준 사장님",
  },
  {
    icon: "🌽",
    title: "유기농식료품점",
    description: "강은지 사장님",
  },
  {
    icon: "",
    title: "그린농장",
    description: "조상호 사장님",
  },
  {
    icon: "2",
    title: "신선수확",
    description: "권미선 사장님",
  },
  {
    icon: "3",
    title: "농부시장",
    description: "서진우 사장님",
  },
  {
    icon: "4",
    title: "채소마을",
    description: "문하늘 사장님",
  },
  {
    icon: "5",
    title: "유기농식료품점",
    description: "배진수 사장님",
  },
  {
    icon: "🍆",
    title: "그린농장",
    description: "김하늘 사장님",
  },
  {
    icon: "🍒",
    title: "신선수확",
    description: "김태호 사장님",
  },
  {
    icon: "🍎",
    title: "농부시장",
    description: "이서연 사장님",
  },
  {
    icon: "🫒",
    title: "채소마을",
    description: "최유리 사장님",
  },
  {
    icon: "🥝",
    title: "유기농식료품점",
    description: "홍준호 사장님",
  },
];

const Slider = () => {
  const [card, setCard] = useState([
    {
      icon: "",
      title: "",
      description: "",
    },
  ]);
  useEffect(() => {
    setCard([...data, ...data]);
    // try {
    //   const response = fetch("http://localhost/api/cardproduct/list", {
    //     method: "GET",
    //     credentials: "include",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //     .then(resp => resp.json())
    //     .then(resp => {
    //       console.log(resp);
    //       setCard([...resp, ...resp]);
    //     });
    //   // if (!response.ok) {
    //   //   throw new Error('Network response was not ok');
    //   // } else {
    //   //   console.log('통신됨');
    //   //   response
    //   //     .then(resp => resp.json())
    //   //     .then(resp => {
    //   //       setCard({ ...resp, ...resp });
    //   //       console.log(resp);
    //   //     });
    //   // }
    // } catch (error) {
    //   alert("통신안됨");
    // }
  }, []);

  const dataChunks = [card.slice(0, 20), card.slice(0, 20)];

  return (
    <StyledSection className={styles.section}>
      {dataChunks.map((chunk, chunkIndex) => (
        <StyleDiv key={chunkIndex} className={styles.div}>
          <StyledUl className={chunkIndex === 0 ? styles.cardList : styles.cardListDynamic}>
            {chunk.map(list => (
              <StyledLi key={list.id + chunkIndex * 10}>
                <StyledCardIcon>
                  {list.icon} {list.title}{" "}
                </StyledCardIcon>
                <StyledCardName>
                  <br></br>
                </StyledCardName>
                <StyledCardDetails>👩‍🌾 {list.description}</StyledCardDetails>
              </StyledLi>
            ))}
          </StyledUl>
        </StyleDiv>
      ))}
    </StyledSection>
  );
};
const StyledCardIcon = styled.div`
  font-size: 19px;
  color: RGB(100, 100, 100);
  font-weight: bold;
  margin-left: 10px;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const StyledCardName = styled.div`
  font-size: 28px;
  color: RGB(100, 100, 100);
  font-weight: bold;
  margin-left: 10px;
`;

const StyledCardDetails = styled.div`
  font-size: 15px;
  color: RGB(150, 150, 150);
  margin-right: 12px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 90%;
  margin: 0px;
  justify-content: space-around;
  padding-left: 0px;
`;

const StyledLi = styled.li`
  width: 240px;
  height: 120px;
  border-radius: 5px;
  list-style: none;
  margin-left: 13px;
  background-color: white;
  border: 1px solid RGB(222, 222, 222);
  box-shadow: 2px 0px 2px 0px RGB(150, 150, 150);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 0px;
`;

const StyleDiv = styled.div`
  width: 5060px;
  height: 90%;
  padding: 0;
`;

const StyledSection = styled.section`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 60px;
  padding-top: 74px;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    to bottom,
    rgba(2, 0, 36, 1) 0%,
    rgba(74, 120, 12, 1) 0%,
    rgba(65, 131, 42, 1) 0%,
    rgba(234, 255, 233, 0.0453054971988795) 0%,
    rgba(103, 210, 125, 0.20858280812324934) 50%,
    rgba(234, 255, 243, 0.114297093837535) 100%,
    rgba(0, 212, 255, 1) 100%
  );
`;
export default Slider;
