import React from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
  // VictoryCursorContainer,
  VictoryBar,
} from 'victory';
import {
  Reminder,
  useMedicineStore,
  useVitalsStore,
} from '../../../../store/zustandstore';
import { vitalsType } from '../../../../types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../../store/user/user.selector';
import { selectTimeline } from '../../../../store/currentPatient/currentPatient.selector';
import { authFetch } from '../../../../axios/useAuthFetch';

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
  medicine: Reminder[];
}

const LineChart = ({ category = 'bp', unit }: logsType) => {
  // const [hoveredData] = useState<DataPoint | null>(null);
  const { vitals } = useVitalsStore();
  const [date, setDate] = React.useState('');
  const [rows, setRows] = React.useState<DataPoint[]>([]);
  const [rowsLow, setRowsLow] = React.useState<DataPoint[]>([]);
  const [medRows, setMedRows] = React.useState<DataPoint[]>([]);

  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const { medicineReminder, setMedicineReminder } = useMedicineStore();

  const minY = Math.min(
    ...rows.filter((el) => el.y != 0).map((data) => data.y)
  );
  const maxY = Math.max(...rows.map((data) => data.y));

  const [groupMedicine, setGroupMedicine] = React.useState<GroupedReminder[]>(
    []
  );
  const getMedicineReminder = React.useCallback(async () => {
    const response = await authFetch(
      `medicine/${timeline.id}/reminders/all`,
      user.token
    );
    // console.log("all medicine response", response);
    if (response.message == 'success') {
      setMedicineReminder(response.reminders.sort(compareDates));
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
                label: data.medicine.map((med) => med.medicineName).join(','),
                category: 'medicine',
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

  const setRowsFunction = React.useCallback(
    (newVitals: vitalsType[] = []) => {
      const timeVar: keyof vitalsType = (category + 'Time') as keyof vitalsType;
      if (newVitals.length && category !== 'bp') {
        setRows(() => {
          if (newVitals.length) {
            return newVitals?.map((vital) => {
              if (category === 'temperature' && vital.device) {
                const newTime = String(
                  new Date(vital.deviceTime ? vital.deviceTime * 1000 : '')
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
      if (newVitals.length && category === 'bp') {
        setRows(() => {
          if (newVitals.length) {
            return newVitals?.map((vital) => {
              return {
                y: Number(vital.bp?.split('/')[0]),
                x: String(vital[timeVar]),
              };
            });
          } else return [];
        });
        setRowsLow(() => {
          if (newVitals.length) {
            return newVitals?.map((vital) => {
              return {
                y: Number(vital.bp?.split('/')[1]),
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
    console.log('response for single vital data', response);
    if (response.message == 'success' && response)
      setRowsFunction(response.vitals);
  }, [
    category,
    date,
    setRowsFunction,
    timeline.patientID,
    user.hospitalID,
    user.token,
  ]);

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
    if (groupMedicine.length) {
      setMedChartRows(groupMedicine);
    }
  }, [groupMedicine, date, setMedChartRows]);

  function compareDates(a: DataPoint, b: DataPoint) {
    return new Date(a.x).valueOf() - new Date(b.x).valueOf();
  }

  console.log(rows, medRows);
  const combinedData = [...rows, ...medRows];
  combinedData.sort(
    (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()
  );
  console.log(combinedData);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
      <input
        type="date"
        style={{
          alignSelf: 'flex-end',
          padding: '0.2rem',
          borderRadius: '6px',
          border: 'none',
          color: '#1977f3',

          // border: "1px solid black",
        }}
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <div style={{ position: 'relative' }}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={600}
          height={400}
          domainPadding={20}
          // domain={{ y: [0, 100] }}
          domain={{ y: [minY, maxY] }}
        >
          {/* <VictoryAxis
            dependentAxis
            style={{ axis: { stroke: "none" } }}
            tickValues={medRows.map((item) => new Date(item.x).getTime())}
            tickFormat={(x) => ""}
          /> */}
          <VictoryAxis
            tickFormat={(x: string | number | Date) =>
              vitals.length === 1
                ? new Date(x).toLocaleTimeString()
                : new Date(x).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
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
              category !== 'bp'
                ? category.slice(0, 1).toUpperCase() +
                  category.slice(1).toLowerCase()
                : 'Blood Pressure'
            } (${unit})`}
            x={6}
            y={200}
            textAnchor="middle"
            angle={-90}
            style={{ fontSize: 14 }}
          />
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
                  datum.category !== 'medicine' ? 'transparent' : 'black',
                width: 2,
              },
            }}
            labels={({ datum }) =>
              `${datum.category == 'medicine' ? datum.label : ''}`
            }
          />
          <VictoryLine
            standalone={false}
            data={combinedData.filter(
              (el) => (el.y ? true : false) && el.category != 'medicine'
            )}
            x="x"
            y="y"
            style={{
              data: {
                stroke: 'black',
                strokeWidth: 1,
              },
            }}
          />
          <VictoryLine
            data={rowsLow
              .filter(
                (el) => (el.y ? true : false) && el.category != 'medicine'
              )
              .sort(compareDates)}
            x="x"
            y="y"
            style={{
              data: {
                stroke: 'black',
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
