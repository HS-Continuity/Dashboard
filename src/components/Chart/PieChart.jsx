import React from "react";
import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data /* 차트 데이터 */ }) => (
  <div style={{ height: 400 }}>
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: "nivo" }}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      radialLabelsSkipAngle={10}
      radialLabelsTextColor='#333333'
      radialLabelsLinkColor={{ from: "color" }}
      sliceLabelsSkipAngle={10}
      sliceLabelsTextColor='#333333'
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  </div>
);

export default PieChart;
