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
  VictoryLegend,
} from "victory";
import {
  Reminder,
  useMedicineStore,
  useVitalsStore,
} from "../../../../store/zustandstore";
import { vitalsType } from "../../../../types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectCurrPatient, selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useLocation } from "react-router-dom";

interface DataPoint {
  x: string; // timestamp (e.g., "2023-07-21T04:45:00.000Z")
  y: number; // value
  label?: string;
  category?: string;
}

type logsType = {
  category: keyof vitalsType;
  unit: string;
  vitals?: vitalsType[]; // Optional vitals prop for homecarepatient
};

interface GroupedReminder {
  dosageTime: string;
  medicine: Reminder[];
}

const LineChart = ({ category = "bp", unit, vitals }: logsType) => {
  const today = new Date();
  const formattedDateShow = today.toISOString().split("T")[0];
  const { vitals: storeVitals } = useVitalsStore();
  const [date, setDate] = React.useState(formattedDateShow);
  const [rows, setRows] = React.useState<DataPoint[]>([]);
  const [rowsLow, setRowsLow] = React.useState<DataPoint[]>([]);
  const [medRows, setMedRows] = React.useState<DataPoint[]>([]);
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const { medicineReminder, setMedicineReminder } = useMedicineStore();
  const currentPatient = useSelector(selectCurrPatient);
  const minY = Math.min(
    ...rows.filter((el) => el.y != 0).map((data) => data.y)
    // ...medRows.map((data) => data.y)
  );
  const maxY = Math.max(
    ...rows.map((data) => data.y)
    // ...medRows.map((data) => data.y)
  );

  const [groupMedicine, setGroupMedicine] = React.useState<GroupedReminder[]>([]);

  // Map vital sign categories only for homecarepatient
  const getMappedCategory = (originalCategory: string) => {
    if (currentPatient?.role === "homecarepatient") {
      const mappings: Record<string, string> = {
        hrv: "heartRateVariability",
        heartRateVariability: "hrv",
        pulse: "heartRate",
        heartRate: "pulse",
        oxygen: "spo2",
        spo2: "oxygen",
      };
      return mappings[originalCategory] || originalCategory;
    }
    return originalCategory; // No mapping for default patient
  };

  const effectiveCategory = getMappedCategory(category);

  const getMedicineReminder = React.useCallback(async () => {
    const response = await authFetch(
      `medicine/${timeline.id}/reminders/all`,
      user.token
    );
    if (response.message == "success") {
      const medicationGiven = response.reminders.filter(
        (each: Reminder) => each.givenTime
      );
      setMedicineReminder(medicationGiven.sort(compareDates));
    }
  }, [setMedicineReminder, timeline.id, user.token]);

  React.useEffect(() => {
    if (user.token && timeline.id) {
      getMedicineReminder();
    }
  }, [user, timeline, getMedicineReminder]);

  React.useEffect(() => {
    if (medicineReminder.length) {
      const groupedReminders: GroupedReminder[] = medicineReminder.reduce<
        GroupedReminder[]
      >((acc: GroupedReminder[], reminder: Reminder) => {
        const dosageTime = reminder.dosageTime;
        const existingReminder = acc.find(
          (group) => group.dosageTime === dosageTime
        );

        if (existingReminder) {
          existingReminder.medicine.push(reminder);
        } else {
          acc.push({
            dosageTime: dosageTime,
            medicine: [reminder],
          });
        }

        return acc;
      }, []);

      setGroupMedicine(groupedReminders);
    }
  }, [medicineReminder]);
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
                  selectedDate.getMonth() == doseDate.getMonth() &&
                  selectedDate.getDate() == doseDate.getDate() &&
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
                label: data.medicine.map((med) => med.medicineName).join(","),
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

const setRowsFunction = React.useCallback(
  (newVitals: vitalsType[] = []) => {
    // Mapping of vital categories to their respective time fields
    const timeFieldMap: Record<string, keyof vitalsType> = {
      bp: "bpTime",
      temperature: "temperatureTime",
      pulse: "pulseTime",
      heartRate: "pulseTime",
      oxygen: "oxygenTime",
      spo2: "oxygenTime",
      hrv: "hrvTime",
      heartRateVariability: "hrvTime",
      respiratoryRate:"respiratoryRateTime",
    };

    // Get the appropriate time field for the current category
    const timeField = timeFieldMap[effectiveCategory] || "givenTime";

    if (newVitals.length && effectiveCategory !== "bp") {
      setRows(() => {
        return newVitals
          .map((vital) => {
            const value = vital[effectiveCategory as keyof vitalsType];
            const label = `${Number(value)}`;

            // Handle temperature with deviceTime
            if (effectiveCategory === "temperature" && vital.device && vital.deviceTime) {
              const newTime = String(new Date(vital.deviceTime * 1000));
              return {
                y: Number(value) || 0,
                x: newTime,
                label: label,
              };
            }

            // Use the mapped time field, fallback to givenTime or addedOn
            const timeValue = vital[timeField] || vital.givenTime || vital.addedOn;
            return {
              y: Number(value) || 0,
              x: String(timeValue),
              label: label,
            };
          })
          .filter((row) => row.y !== 0);
      });
    }

    if (newVitals.length && effectiveCategory === "bp") {
      setRows(() => {
        return newVitals
          .map((vital) => {
            const value = vital.bp?.split("/")[0];
            const label = `${value}/${vital.bp?.split("/")[1]}`;
            const timeValue = vital[timeField] || vital.givenTime || vital.addedOn;
            return {
              y: Number(value) || 0,
              x: String(timeValue),
              label: label,
            };
          })
          .filter((row) => row.y !== 0);
      });
      setRowsLow(() => {
        return newVitals
          .map((vital) => {
            const value = vital.bp?.split("/")[1];
            const label = `${vital.bp?.split("/")[0]}/${value}`;
            const timeValue = vital[timeField] || vital.givenTime || vital.addedOn;
            return {
              y: Number(value) || 0,
              x: String(timeValue),
              label: label,
            };
          })
          .filter((row) => row.y !== 0);
      });
    }

    if (!newVitals.length) {
      setRows([]);
      setRowsLow([]);
    }
  },
  [effectiveCategory, unit]
);

  const getFilteredData = React.useCallback(async () => {
    let response;

    if (currentPatient?.role === "homecarepatient") {
      response = await authFetch(
        `vitals/getHomeCarePatient/${currentPatient?.id}/single?vital=${effectiveCategory}&date=${date}`,
        user.token
      );
    } else {
      response = await authFetch(
        `vitals/${user.hospitalID}/${timeline.patientID}/single?vital=${effectiveCategory}&date=${date}`,
        user.token
      );
    }
    if (response.message === "success" && response) {
      setRowsFunction(response.vitals);
    }
  }, [effectiveCategory, date, setRowsFunction, timeline.id, user.hospitalID, user.token, currentPatient]);

  React.useEffect(() => {
    if (currentPatient?.role === "homecarepatient" && date) {
      getFilteredData();
    } else if (date) {
      getFilteredData();
    } else {
      setRowsFunction(storeVitals);
    }
  }, [vitals, storeVitals, effectiveCategory, date, getFilteredData, setRowsFunction, currentPatient?.role]);

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

  const chartTitle = React.useMemo(() => {
    const displayNames: Record<string, string> = {
      hrv: "HRV",
      heartRateVariability: "HRV",
      pulse: "Heart Rate",
      heartRate: "Heart Rate",
      oxygen: "SpO2",
      spo2: "SpO2",
      bp: "Blood Pressure",
    };

    const displayName = displayNames[effectiveCategory] ||
                      effectiveCategory.slice(0, 1).toUpperCase() +
                      effectiveCategory.slice(1).toLowerCase();

    return `${displayName} (${unit})`;
  }, [effectiveCategory, unit]);

  const isOpdInPath = location.pathname.includes("opd");
  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <input
        type="date"
        style={{
          alignSelf: "flex-end",
          borderRadius: "12px",
          background: "#F6F6F6",
          padding: "0.4rem",
          // border: "none",
          color: "#1977f3",
          width: "130px"
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
          domain={{ y: [Math.min(50, minY), Math.max(150, maxY)] }}
        // domain={{ y: [minY, maxY] }}
        >
          {/* <VictoryAxis
            dependentAxis
            style={{ axis: { stroke: "none" } }}
            tickValues={medRows.map((item) => new Date(item.x).getTime())}
            tickFormat={(x) => ""}
          /> */}
          <VictoryAxis
            tickFormat={(x: string | number | Date) =>
              (vitals?.length === 1 || storeVitals.length === 1)
                ? new Date(x).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  })
                : new Date(x).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                    timeZone: "Asia/Kolkata",
                  })
            }
            style={{
              tickLabels: { fontSize: 10, padding: 5 },
            }}
            fixLabelOverlap={true}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(y: number) => ((vitals?.length === 1 || storeVitals.length === 1) ? y : y.toFixed(2))}
            style={{ tickLabels: { fontSize: 10, padding: 5 } }}
            tickCount={(vitals?.length === 1 || storeVitals.length === 1) ? 1 : undefined}
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
            text={chartTitle}
            x={6}
            y={200}
            textAnchor="middle"
            angle={-90}
            style={{ fontSize: 14 }}
          />

          {effectiveCategory !== "bp" ? (
            <VictoryLegend
              x={125}
              y={10}
              orientation="horizontal"
              gutter={20}
              style={{
                border: { stroke: "none" },
                title: { fontSize: 14 },
              }}
              data={[
                ...(isOpdInPath === false && currentPatient?.role !== "homecarepatient" && currentPatient.ptype !== 21
                  ? [{ name: "Medication", symbol: { fill: "orange" } }]
                  : []),
                { name: `${effectiveCategory}`, symbol: { fill: "black" } },
              ]}
            />
          ) : (
            <VictoryLegend
              x={125}
              y={10}
              orientation="horizontal"
              gutter={20}
              style={{
                border: { stroke: "none" },
                title: { fontSize: 14 },
              }}
              data={[
                ...(isOpdInPath === false && currentPatient?.role !== "homecarepatient"
                  ? [{ name: "Medication", symbol: { fill: "orange" } }]
                  : []),
                { name: "High Bp", symbol: { fill: "black" } },
                { name: "Low Bp", symbol: { fill: "blue" } },
              ]}
            />
          )}

          <VictoryBar
            labelComponent={<VictoryTooltip />}
            // data={[{ ...item, y: maxY }]}
            data={combinedData}
            standalone={false}
            style={{
              data: {
                // fill: (datum: any) =>
                //   datum.category !== "medicine" ? "transparent" : "tomato",
                fill: ({ datum }) =>
                  datum.category !== "medicine" ? "transparent" : "orange",
                width: 2,
              },
            }}
            labels={({ datum }) =>
              `${datum.category == "medicine" ? datum.label : ""}`
            }
          />
          <VictoryLine
            standalone={false}
            data={combinedData.filter(
              (el) => (el.y ? true : false) && el.category != "medicine"
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
                (el) => (el.y ? true : false) && el.category != "medicine"
              )
              .sort(compareDates)}
            x="x"
            y="y"
            style={{
              data: {
                stroke: "blue",
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
