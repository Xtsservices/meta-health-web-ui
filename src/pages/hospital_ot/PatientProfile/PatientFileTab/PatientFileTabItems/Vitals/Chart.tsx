import React, { useState } from "react";
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
import { useVitalsStore } from "../../../../../../store/zustandstore";
import { vitalsType, medicineChart } from "../../../../../../types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../../store/user/user.selector";
import { selectTimeline } from "../../../../../../store/currentPatient/currentPatient.selector";
import { authFetch } from "../../../../../../axios/useAuthFetch";

interface DataPoint {
  x: string; // timestamp (e.g., "2023-07-21T04:45:00.000Z")
  y: number; // value
}

type logsType = {
  category: keyof vitalsType;
  unit: string;
};

const LineChart = ({ category = "bp", unit }: logsType) => {
  const [hoveredData] = useState<DataPoint | null>(null);
  const { vitals } = useVitalsStore();
  const [date, setDate] = React.useState("");
  const [rows, setRows] = React.useState<DataPoint[]>([]);
  const [rowsLow, setRowsLow] = React.useState<DataPoint[]>([]);
  const [medRows, setMedRows] = React.useState<DataPoint[]>([]);
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);

  const setMedChartRows = (medicines: medicineChart[] = []) => {
    if (setRows.length > 0) {
      setMedRows(() => {
        if (medicines.length) {
          return medicines?.map((data) => {
            return {
              y: 40,
              x: String(data?.givenTime),
              label: String(data.medicineName),
            };
          });
        } else {
          return [];
        }
      });
    }
  };

  const setRowsFunction = React.useCallback(
    (newVitals: vitalsType[] = []) => {
      const timeVar: keyof vitalsType = (category + "Time") as keyof vitalsType;
      if (newVitals.length && category !== "bp") {
        setRows(() => {
          if (newVitals.length) {
            return newVitals?.map((vital) => {
              if (category === "temperature" && vital.device) {
                const newTime = String(
                  new Date(vital.deviceTime ? vital.deviceTime * 1000 : "")
                );
                return {
                  y: Number(vital[category]),
                  x: newTime,
                };
              } else {
                return {
                  y: Number(vital[category]),
                  x: String(vital[timeVar]),
                };
              }
            });
          } else return [];
        });
      }
      if (newVitals.length && category === "bp") {
        setRows(() => {
          if (newVitals.length) {
            return newVitals?.map((vital) => {
              return {
                y: Number(vital.bp?.split("/")[0]),
                x: String(vital[timeVar]),
              };
            });
          } else return [];
        });
        setRowsLow(() => {
          if (newVitals.length) {
            return newVitals?.map((vital) => {
              return {
                y: Number(vital.bp?.split("/")[1]),
                x: String(vital?.[timeVar]),
              };
            });
          } else return [];
        });
      }
      if (!newVitals.length) {
        setRows([]);
        setRowsLow([]);
      }
    },
    [category]
  );

  const getFilteredData = React.useCallback(async () => {
    const response = await authFetch(
      `vitals/${user.hospitalID}/${timeline.patientID}/single?vital=${category}&date=${date}`,
      user.token
    );
    if (response.message == "success" && response)
      setRowsFunction(response.vitals);
  }, [
    category,
    date,
    setRowsFunction,
    timeline.patientID,
    user.hospitalID,
    user.token,
  ]);

  const getMedicineChart = React.useCallback(async () => {
    const response = await authFetch(
      `medicine/${timeline.id}/chart?date=${date}`,
      user.token
    );
    if (response.message == "success" && response) {
      setMedChartRows(response.result);
    }
  }, [date, timeline.id, user.token]);

  React.useEffect(() => {
    if (date) {
      getFilteredData();
    }
    if (!date) {
      // console.log("vitalsss", vitals);
      setRowsFunction(vitals);
    }
  }, [vitals, category, date, getFilteredData, setRowsFunction]);

  React.useEffect(() => {
    if (date) {
      getMedicineChart();
    }
  }, [date, getMedicineChart]);

  function compareDates(a: DataPoint, b: DataPoint) {
    return new Date(a.x).valueOf() - new Date(b.x).valueOf();
  }

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
        >
          <VictoryAxis
            tickFormat={(x: string | number | Date) =>
              vitals.length === 1
                ? new Date(x).toLocaleTimeString()
                : new Date(x).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  })
            }
            style={{
              tickLabels: { fontSize: 10, padding: 5 },
            }}
            fixLabelOverlap={true}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(y: number) => (vitals.length === 1 ? y : y.toFixed(2))}
            style={{ tickLabels: { fontSize: 10, padding: 5 } }}
            tickCount={vitals.length === 1 ? 1 : undefined}
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
          <VictoryLine
            data={rows.filter((el) => (el.y ? true : false)).sort(compareDates)}
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
              .filter((el) => (el.y ? true : false))
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
          {/* Vertical Line */}

          {medRows.map((item) => {
            return (
              <VictoryBar
                labelComponent={<VictoryTooltip />}
                data={[item]}
                style={{
                  data: { fill: "tomato", width: 2 },
                }}
              />
            );
          })}
        </VictoryChart>
        {hoveredData && (
          <VictoryTooltip
            renderInPortal
            cornerRadius={5}
            flyoutStyle={{
              stroke: "black",
              strokeWidth: 1,
              fill: "white",
              color: "red", // Change font color to red
            }}
            flyoutWidth={100}
            flyoutHeight={50}
            text={`Y: ${hoveredData.y.toFixed(2)}`}
            style={{ fill: "red", fontSize: 12, fontWeight: "bold" }}
            x={20}
            y={20}
          />
        )}
      </div>
    </div>
  );
};

export default LineChart;
