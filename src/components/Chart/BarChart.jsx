// import * as React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const BarChart = ({ data, keys, indexBy }) => {
  const handle = {
    barClick: function (data) {
      console.log(data);
    },
    legendClick: function (data) {
      console.log(data);
    },
  };

  return (
    <div style={{ width: '100%', height: '350px', margin: '0 auto' }}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        layout="vertical"           // 바를 세로로 표시
        margin={{ top: 0, right: 130, bottom: 130, left: 70 }} // 여백 조정
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        colorBy="id"
        theme={{
          labels: {
            text: {
              fontSize: 10,
              fill: '#000000',
            },
          },
          legends: {
            text: {
              fontSize: 15,
              fill: '#000000',
            },
          },
          axis: {
            legend: {
              text: {
                fontSize: 15,
                fill: '#000000',
              },
            },
            ticks: {
              text: {
                fontSize: 16,
                fill: '#000000',
              },
            },
          },
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 15,
          tickRotation: 0,
          //legend: 'Month',             // x축 레전드 수정
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 15,
          tickRotation: 0,
          legend: '판매량',            // y축 레전드 수정
          legendPosition: 'middle',
          legendOffset: -65,
        }}
        labelSkipWidth={12}           // 레이블이 바의 너비가 이 값보다 작으면 표시되지 않음
        labelSkipHeight={12}          // 레이블이 바의 높이가 이 값보다 작으면 표시되지 않음
        labelPosition="end"           // 레이블을 바 끝에 위치
        labelOffset={-10}             // 레이블과 바 사이의 거리
        groupMode="grouped"           // 그룹 모드로 설정
        onClick={handle.barClick}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
            onClick: handle.legendClick,
          },
        ]}
        animate={true}
        //motionStiffness={90}
       // motionDamping={15}
      />
    </div>
  );
};

export default BarChart;
