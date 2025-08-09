import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from "victory";

interface BarGraphProps {
  data: { x: string; y: number }[];
  colors: string;
  height?: number;
  barWidth: number;
}

const BarGraph: React.FC<BarGraphProps> = ({
  data,
  colors,
  height = 280,
  barWidth,
}) => {
  const [width, setWidth] = React.useState(900);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      const screenWidth = window.screen.width;
      if (screenWidth > 1150) {
        setWidth(800);
      } else {
        setWidth(700);
      }
    });
  }, []);

  const hasData = data.length > 0 && data.some((item) => item.y > 0);
  const yAxisTickValues = hasData ? undefined : [1, 2, 3, 4];


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
            tickLabels: { fontSize: 10, fill: 'black' },
            axisLabel: { fontSize: 12, padding: 30, fill: '#000000' },
          }}
          dependentAxis
          crossAxis
          label="No. of Patients"
          tickFormat={(t) => `${Math.round(t)}`}
          tickValues={yAxisTickValues}
          // tickCount={2}
        />
        <VictoryAxis
          tickFormat={data.map((item) => item.x)}
          label="Days"
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fontSize: 10, fill: "black" },
            axisLabel: { fontSize: 12, padding: 30, fill: '#000000' },
          }}
        />
        <VictoryBar
          data={data}
          x="x"
          y="y"
          style={{
            data: {
              // fill: " #C5D8FF",
              fill: colors,
            
    
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
                // fill: "#6B9DFE",
                fill: colors
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
                             fill: colors,
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
                            fill: colors,
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
