import * as React from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ data }) => {
  const handle = {
    barClick: function (data) {
      console.log(data);
    },

    legendClick: function (data) {
      console.log(data);
    },
  };

  return (
    <div style={{ width: "800px", height: "500px", margin: "0 auto" }}>
      <ResponsiveBar
        data={data}
        keys={["cola", "cidar", "fanta"]}
        indexBy='bottle'
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={["olive", "brown", "orange"]}
        colorBy='id'
        theme={{
          labels: {
            text: {
              fontSize: 14,
              fill: "#000000",
            },
          },
          legends: {
            text: {
              fontSize: 12,
              fill: "#000000",
            },
          },
          axis: {
            legend: {
              text: {
                fontSize: 20,
                fill: "#000000",
              },
            },
            ticks: {
              text: {
                fontSize: 16,
                fill: "#000000",
              },
            },
          },
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "bottle",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "price",
          legendPosition: "middle",
          legendOffset: -60,
        }}
        labelSkipWidth={36}
        labelSkipHeight={12}
        onClick={handle.barClick}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
            onClick: handle.legendClick,
          },
        ]}
      />
    </div>
  );
};

export default BarChart;
