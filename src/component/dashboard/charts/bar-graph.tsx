/**
 * BarGraph Component
 * A customizable bar chart component built using the `victory` library.
 *
 * Props:
 * - data: Array of objects representing the data points, each with shape { x: string; y: number }.
 * - colors: Array of strings for bar colors (currently unused).
 * - height: Number for the height of the chart (default is 280).
 * - barWidth: Number for the width of each bar.
 *
 * Example Usage:
 * <BarGraph data={[{ x: 'Category 1', y: 10 }, { x: 'Category 2', y: 15 }]} barWidth={20} />
 */

import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

export interface BarGraphProps {
  data: { x: string; y: number }[];
  colors: string;
  height?: number;
  barWidth: number;
}

const BarGraph: React.FC<BarGraphProps> = ({
  data,
  height = 280,
  barWidth,
  colors,
}) => {

  const [width, setWidth] = React.useState(900);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      const screenWidth = window.screen.width;
      if (screenWidth > 1150) {
        setWidth(600);
      } else {
        setWidth(700);
      }
    });
  }, []);

  const hasData = data.length > 0 && data.some((item) => item.y > 0);
  const yAxisTickValues = hasData ? undefined : [1, 2, 3, 4];


  return (
    <div style={{ width, height }}>
 <VictoryChart domainPadding={{ x: 10 }} height={height} width={width}>
      <VictoryAxis
        style={{
          grid: {
            stroke: '#EBEBEB', //Set the color of the grid lines
            strokeWidth: 1, // Set the width of the grid lines
          },
          axis: { stroke: 'transparent' },
          tickLabels: { fontSize: 10, fill: '#C4C4C4' },
          axisLabel: { fontSize: 12, padding: 20, fill: '#000000' },
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
            fill: colors,
            cursor: 'pointer',
          },
        }}
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
    </div>
   
  );
};

export default BarGraph;
