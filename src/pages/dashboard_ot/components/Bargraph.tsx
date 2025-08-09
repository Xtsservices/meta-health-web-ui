import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from "victory";

interface BarGraphProps {
  data: { x: string; y: number }[];
  colors: string[];
  height?: number;
  barWidth: number;
}

const BarGraph: React.FC<BarGraphProps> = ({
  data,
  height = 280,
  barWidth,
}) => {
  // console.log("dataaa", data);
  const [width, setWidth] = React.useState(1000);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      const screenWidth = window.screen.width;
      if (screenWidth > 1150) {
        setWidth(900);
      } else {
        setWidth(700);
      }
    });
  }, []);
  return (
    <div style={{ width, height }}>
      <VictoryChart
        // theme={VictoryTheme.material}
        domainPadding={{ x: 10 }}
        width={width}
        height={height}
      >
        <VictoryAxis
          style={{
            grid: {
              stroke: "#EBEBEB", // Set the color of the grid lines
              strokeWidth: 1, // Set the width of the grid lines
            },
            axis: { stroke: "transparent" },
            tickLabels: { fontSize: 10, fill: "#C4C4C4" },
          }}
          dependentAxis
          crossAxis
          tickFormat={(t) => `${Math.round(t)}`}
          // tickCount={2}
        />
        <VictoryAxis
          tickFormat={data.map((item) => item.x)}
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fontSize: 10, fill: "black" },
          }}
        />
        <VictoryBar
          data={data}
          x="x"
          y="y"
          style={{
            data: {
              fill: " #C5D8FF",
              cursor: "pointer",
            },
          }}
          // padding={{ top: 50, bottom: 50, left: 30 }}
          barWidth={barWidth}
          barRatio={0.9}
          cornerRadius={{ top: 6 }}
          labels={({ datum }) => `${datum.y}`}
          labelComponent={
            <VictoryTooltip
              style={{
                fill: "white",
              }}
              flyoutStyle={{
                stroke: "transparent",
                strokeWidth: 2,
                backgroundColor: "red",
                fill: "#6B9DFE",
              }}
            />
          }
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseEnter: () => {
                  return [
                    {
                      target: "data",
                      mutation: () => {
                        return {
                          style: {
                            fill: "#6B9DFE",
                          },
                        };
                      },
                    },
                  ];
                },
                onMouseLeave: () => {
                  return [
                    {
                      target: "data",
                      mutation: () => {
                        return {
                          style: {
                            fill: " #C5D8FF",
                          },
                        };
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
      </VictoryChart>
    </div>
  );
};

export default BarGraph;
