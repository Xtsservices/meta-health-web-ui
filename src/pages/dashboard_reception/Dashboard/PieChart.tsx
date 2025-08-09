import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from "recharts";

interface PieChartComponentProps {
  filled: number;
  notFilled: number;
}

const PieChart: React.FC<PieChartComponentProps> = ({ filled, notFilled }) => {
  const data = [
    { name: "Filled", value: filled },
    { name: "Not filled", value: notFilled },
  ];

  const COLORS = ["#4CAF50", "#C4C4C4"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        padding: "5px",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p
        style={{ marginBottom: "-40px", fontSize: "16px", fontWeight: "bold" }}
      >
        Occupancy
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RechartsPieChart width={300} height={300}>
          <Pie
            data={data}
            cx={150}
            cy={150}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <LabelList
              dataKey="value"
              position="inside"
              fill="#fff"
              fontSize={18}
            />
          </Pie>
          <Legend align="right" layout="vertical" />
        </RechartsPieChart>
      </div>
    </div>
  );
};

export default PieChart;
