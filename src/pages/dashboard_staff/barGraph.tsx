import React, { useState, useEffect } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from "victory";

interface BarGraphProps {
  data: { x: string; y: number }[];
  colors: string;
  height?: number;
  barWidth: number;
}

  
  const BarGraph: React.FC<BarGraphProps> = ({ data, height = 260, colors, barWidth }) => {
  const [width, setWidth] = useState(900);
  const [isXaxisVisible, setIsAaxisVisible] = useState<boolean>(false);

  const handleResize = () => {
    const screenWidth = window.innerWidth; // Use innerWidth for better accuracy
    setWidth(screenWidth > 1150 ? 850 : 700);
  };

  const hasData = data.length > 0 && data.some((item) => item.y > 0);
  const yAxisTickValues = hasData ? undefined : [1, 2, 3, 4];


  useEffect(() => {
    // Set initial width
    handleResize();

    // Check if any data is greater than 0
    const result = data.filter((each) => each.y > 0);
    setIsAaxisVisible(result.length > 0);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data]); // Include 'data' as dependency to re-run effect if it changes

  return (
    <div style={{ width, height }}>
      <VictoryChart
        domainPadding={{ x: 10 }}
        width={width}
        height={height}
      >
        <VictoryAxis
          style={{
            grid: {
              stroke: "#EBEBEB",
              strokeWidth: 1,
            },
            axis: { stroke: "transparent" },
            tickLabels: { fontSize: 10, fill: 'black' },
            axisLabel: { fontSize: 12, padding: 30, fill: '#000000' },
          }}
          dependentAxis
          label="No. of Patients"
          crossAxis
          tickValues={yAxisTickValues}
        />
        <VictoryAxis
          tickFormat={data.map((item) => item.x)}
          label="Days"
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fontSize: 10, fill: 'black' },
            axisLabel: { fontSize: 12, padding: 30, fill: '#000000' },
          }}
        />
        {isXaxisVisible && (
          <VictoryBar
            data={data}
            x="x"
            y="y"
            style={{
              data: {
                fill: colors,
                cursor: "pointer",
              },
            }}
            // barWidth={30}
            barWidth={barWidth}
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
                  fill: colors,
                }}
              />
            }
            events={[
              {
                target: "data",
                eventHandlers: {
                  onMouseEnter: () => ({
                    target: "data",
                    mutation: () => ({
                      style: {
                        fill: colors,
                      },
                    }),
                  }),
                  onMouseLeave: () => ({
                    target: "data",
                    mutation: () => ({
                      style: {
                        fill: colors,
                      },
                    }),
                  }),
                },
              },
            ]}
          />
        )}
      </VictoryChart>
    </div>
  );
};

export default BarGraph;
