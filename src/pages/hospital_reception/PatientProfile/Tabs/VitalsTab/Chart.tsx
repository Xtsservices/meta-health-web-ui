import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
  // VictoryCursorContainer,
  VictoryBar,
} from "victory";
import { vitalsType } from "../../../../../types";

interface DataPoint {
  x: string; // timestamp (e.g., "2023-07-21T04:45:00.000Z")
  y: number; // value
  label?: string;
  category?: string;
}

type logsType = {
  category: keyof vitalsType;
  unit: string;
};

interface GroupedReminder {
  dosageTime: string;
}

const LineChart = ({ category = "bp", unit }: logsType) => {
  const [date, setDate] = React.useState("");
  const [rows] = React.useState<DataPoint[]>([]);
  const [rowsLow] = React.useState<DataPoint[]>([]);
  const [medRows, setMedRows] = React.useState<DataPoint[]>([]);

  const minY = Math.min(
    ...rows.filter((el) => el.y !== 0).map((data) => data.y)
  );
  const maxY = Math.max(...rows.map((data) => data.y));

  const [groupMedicine] = React.useState<GroupedReminder[]>([]);

  // console.log("group reminder-----------", groupMedicine);
  const setMedChartRows = React.useCallback(
    (medicines: GroupedReminder[] = []) => {
      setMedRows(() => {
        // console.log("medicines length", medicines, groupMedicine);
        if (medicines.length) {
          return medicines
            ?.filter((med) => {
              const selectedDate = new Date(date);
              const doseDate = new Date(med.dosageTime);
              if (date) {
                return (
                  selectedDate.getMonth() === doseDate.getMonth() &&
                  selectedDate.getDate() === doseDate.getDate() &&
                  doseDate < new Date()
                );
              } else {
                return doseDate < new Date();
              }
            })
            .map((data) => {
              return {
                y: maxY,
                x: String(data?.dosageTime),
                category: "medicine",
              };
            });
        } else {
          return [];
        }
      });
    },
    [date, maxY]
  );

  // console.log(medRows);

  React.useEffect(() => {
    if (groupMedicine.length) {
      setMedChartRows(groupMedicine);
    }
  }, [groupMedicine, date, setMedChartRows]);

  function compareDates(a: DataPoint, b: DataPoint) {
    return new Date(a.x).valueOf() - new Date(b.x).valueOf();
  }

  const combinedData = [...rows, ...medRows];
  combinedData.sort(
    (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()
  );

  console.log("combinedData", combinedData);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <input
        type="date"
        style={{
          alignSelf: "flex-end",
          padding: "0.2rem",
          borderRadius: "6px",
          border: "none",
          color: "#1977f3",

          // border: "1px solid black",
        }}
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <div style={{ position: "relative" }}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={600}
          height={400}
          domainPadding={20}
          // domain={{ y: [0, 100] }}
          domain={{ y: [minY, maxY] }}
        >
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 10, padding: 5 },
            }}
            fixLabelOverlap={true}
          />
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fontSize: 10, padding: 5 } }}
            fixLabelOverlap={true}
          />
          <VictoryLabel
            text="Time"
            x={300}
            y={390}
            textAnchor="middle"
            style={{ fontSize: 14 }}
          />

          {/* Y-axis label */}
          <VictoryLabel
            text={`${
              category !== "bp"
                ? category.slice(0, 1).toUpperCase() +
                  category.slice(1).toLowerCase()
                : "Blood Pressure"
            } (${unit})`}
            x={6}
            y={200}
            textAnchor="middle"
            angle={-90}
            style={{ fontSize: 14 }}
          />
          <VictoryBar
            labelComponent={<VictoryTooltip />}
            data={combinedData}
            standalone={false}
            style={{
              data: {
                fill: ({ datum }) =>
                  datum.category !== "medicine" ? "transparent" : "black",
                width: 2,
              },
            }}
            labels={({ datum }) =>
              `${datum.category === "medicine" ? datum.label : ""}`
            }
          />
          <VictoryLine
            standalone={false}
            data={combinedData.filter(
              (el) => (el.y ? true : false) && el.category !== "medicine"
            )}
            x="x"
            y="y"
            style={{
              data: {
                stroke: "black",
                strokeWidth: 1,
              },
            }}
          />
          <VictoryLine
            data={rowsLow
              .filter(
                (el) => (el.y ? true : false) && el.category !== "medicine"
              )
              .sort(compareDates)}
            x="x"
            y="y"
            style={{
              data: {
                stroke: "black",
                strokeWidth: 1,
              },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default LineChart;
