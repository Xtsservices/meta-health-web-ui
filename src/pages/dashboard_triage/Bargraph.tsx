import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

interface BarGraphProps {
  data: { x: string; y: number }[];
  colors: string;
  height?: number;
  barWidth: number;
}

const BarGraph: React.FC<BarGraphProps> = ({
  data,
  height = 280,
  barWidth,
  colors
}) => {

  const hasData = data.length > 0 && data.some((item) => item.y > 0);
  const yAxisTickValues = hasData ? undefined : [1, 2, 3, 4];

  return (
    <VictoryChart domainPadding={{ x: 10 }} height={height} width={900}>
      <VictoryAxis
        style={{
          grid: {
            stroke: '#EBEBEB', // Set the color of the grid lines
            strokeWidth: 1, // Set the width of the grid lines
          },
          axis: { stroke: 'transparent' },
          tickLabels: { fontSize: 10, fill: "black" },
          axisLabel: { fontSize: 12, padding: 30, fill: '#000000' },
        }}
        dependentAxis
        label="No. of Patients"
        crossAxis
        tickFormat={(t) => `${Math.round(t)}`}
        tickValues={yAxisTickValues}
      />
      <VictoryAxis
        tickFormat={data.map((item) => item.x)}
        style={{
          axis: { stroke: 'transparent' },
          tickLabels: { fontSize: 10, fill: 'black' },
          axisLabel: { fontSize: 12, padding: 30, fill: '#000000' },
        }}
        label="Days"
      />
      <VictoryBar
        data={data}
        x="x"
        y="y"
        style={{
          data: {
            fill: colors ,
            cursor: 'pointer',
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
              fill: 'white',
            }}
            flyoutStyle={{
              stroke: 'transparent',
              strokeWidth: 2,
              backgroundColor: 'red',
              fill: colors,
            }}
          />
        }
        events={[
          {
            target: 'data',
            eventHandlers: {
              onMouseEnter: () => {
                return [
                  {
                    target: 'data',
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
                    target: 'data',
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
  );
};

export default BarGraph;
