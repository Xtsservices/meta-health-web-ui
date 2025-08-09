import { VictoryPie, VictoryTooltip } from "victory";
import styles from "./doughnut-chart.module.scss";
import React from "react";

const colors = ["#ed4f4f", "#56f869", "#ffdf76"];

type DataType = {
  x: string;
  y: number;
};

type DoughnutChartProps = {
  className?: string;
  data: DataType[];
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({ className, data }) => {
  const renderLegend = () => {
    const columns = 1; // Number of columns
    const legendSize = 18; // Size of the legend item (circle)
    const horizontalSpacing = 160; // Increased horizontal spacing between columns

    return (
      <g transform={`translate(60, 340)`}>
        {data.map((item, index) => {
          const row = Math.floor(index / columns); // Calculate the row number (0-based) for each element
          const col = index % columns; // Calculate the column number (0-based) for each element
          const xOffset = col * horizontalSpacing; // Adjusted horizontal spacing between columns
          const yOffset = row * 30;

          return (
            <g
              key={item.x}
              transform={`translate(${xOffset}, ${yOffset})`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <circle
    r={legendSize / 2}
    fill={
      item.x.toLowerCase() === "red" ? "#ed4f4f" :
      item.x.toLowerCase() === "green" ? "#56f869" :
      item.x.toLowerCase() === "yellow" ? "#ffdf76" :
      "#ccc" // Default color if no match
    }
  />
              <text
                x={legendSize + 4}
                y={legendSize / 2}
                style={{ fontSize: 12 }}
              >
                {`${item.x.charAt(0).toUpperCase() + item.x.slice(1)} (${Number(
                  item.y
                )})`}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className={`${styles.doughnutChart} ${className}`}>
      <svg viewBox="0 0 400 700">
        <VictoryPie
          standalone={false}
          width={400}
          height={350}
          data={data}
          innerRadius={60}
          colorScale={colors}
          labels={({ datum }) =>
            `${datum.x.charAt(0).toUpperCase() + datum.x.slice(1)}: ${datum.y}`
          }
          style={{
            labels: {
              fill: "transparent"
            }
          }}
          labelComponent={
            <VictoryTooltip
              style={{ fill: "white" }}
              flyoutStyle={{ fill: "black" }}
              renderInPortal={false}
              constrainToVisibleArea
            />
          }
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: "labels",
                      mutation: () => ({ active: true })
                    }
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: "labels",
                      mutation: () => ({ active: false })
                    }
                  ];
                }
              }
            }
          ]}
        />
        {renderLegend()}
      </svg>
    </div>
  );
};

export default DoughnutChart;
