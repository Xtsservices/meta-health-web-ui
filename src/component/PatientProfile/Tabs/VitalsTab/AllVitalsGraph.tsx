
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Stack,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { selectCurrPatient, selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";

// Type definitions
interface FormDialogProps {
  openAllGraphs: boolean;
  setOpenAllGraphs: Dispatch<SetStateAction<boolean>>;
}

interface VitalData {
  time: string;
  timestamp: number;
  pulse: number | null;
  Temp: number | null;
  Spo2: number | null;
  HighBp: number | null;
  LowBp: number | null;
  RR: number | null;
  HRV: number | null;
}

interface ApiVital {
  id: number;
  timeLineID: number;
  userID: number;
  pulse: number;
  hrv: number;
  hrvTime: string | null;
  temperature: number;
  oxygen: number;
  bp: string | null;
  addedOn: string;
  pulseTime: string | null;
  oxygenTime: string | null;
  temperatureTime: string | null;
  bpTime: string | null;
  givenTime: string | null;
  device: number;
  deviceTime: number;
  battery: number | null;
  respiratoryRate: number;
  respiratoryRateTime: string | null;
  patientID: number;
}

interface ApiResponse {
  message: string;
  vitals: ApiVital[];
  data: HomecareApiVital[];
  success: boolean;
}

interface HomecareApiVital {
  patientID: number;
  spo2: string;
  heartRate: string;
  heartRateVariability: string;
  respiratoryRate: string;
  temperature: string;
  givenTime: string;
  addedOn: string;
}

const useStyles = makeStyles({
  dialogPaper: {
    width: "1000px",
    minWidth: "1000px",
  },
  blueDialogTitle: {
    color: "#000000",
  },
  noData: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "500px",
  },
});

// ... (imports remain the same)

const AllVitalsGraph = ({ openAllGraphs, setOpenAllGraphs }: FormDialogProps) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [filteredData, setFilteredData] = useState<VitalData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [maxYValue, setMaxYValue] = useState<number>(200);
  const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);

  const today = new Date().toISOString().split("T")[0];

  const getDateRange = (range: string): { startDate: string | null; endDate: string | null } => {
    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    if (range === "1d") {
      return { startDate: endDate, endDate };
    } else if (range === "1w") {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      return { startDate: startDate.toISOString().split("T")[0], endDate };
    } else if (range === "1m") {
      const startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      return { startDate: startDate.toISOString().split("T")[0], endDate };
    } else if (range === "1y") {
      const startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      return { startDate: startDate.toISOString().split("T")[0], endDate };
    }
    return { startDate: null, endDate: null };
  };

useEffect(() => {
    const fetchVitalsData = async () => {
      setLoading(true);
      try {
        if (!user?.token || (!timeline?.patientID && !currentPatient?.id)) {
          console.warn("Missing token or patientID");
          setFilteredData([]);
          return;
        }

        let url: string;
        let dateParams = "";
        if (selectedDate) {
          dateParams = `?startDate=${selectedDate}&endDate=${selectedDate}`;
        } else {
          const { startDate, endDate } = getDateRange(timeRange);
          if (startDate && endDate) {
            dateParams = `?startDate=${startDate}&endDate=${endDate}`;
          }
        }

        if (currentPatient?.role === "homecarepatient") {
          url = `alerts/getIndividualHomeCarePatientsVitails/${currentPatient.id}${dateParams}`;
        } else {
          url = `vitals/getallvitalsbypatientid/${timeline?.patientID || currentPatient?.id}${dateParams}`;
        }

        const response: ApiResponse = await authFetch(url, user.token);

        let data: VitalData[] = [];

        if (response?.vitals?.length > 0 || response?.data?.length > 0) {
          if (currentPatient?.role === "homecarepatient" && response?.data?.length > 0) {
            data = response.data.map((item: HomecareApiVital): VitalData => ({
              time: item.givenTime || item.addedOn,
              timestamp: new Date(item.givenTime || item.addedOn).getTime(),
              pulse: item.heartRate ? parseFloat(item.heartRate) || null : null,
              Temp: item.temperature ? parseFloat(item.temperature) || null : null,
              Spo2: item.spo2 ? parseFloat(item.spo2) || null : null,
              HighBp: null,
              LowBp: null,
              RR: item.respiratoryRate ? parseFloat(item.respiratoryRate) || null : null,
              HRV: item.heartRateVariability ? parseFloat(item.heartRateVariability) || null : null,
            }));
          } else {
            data = response.vitals.reduce((acc: VitalData[], item: ApiVital) => {
              const bp = item.bp && item.bp !== "" ? item.bp.split("/") : [null, null];
              const vitals: VitalData[] = [];

              if (item.pulseTime && item.pulse !== 0) {
                vitals.push({
                  time: item.pulseTime,
                  timestamp: new Date(item.pulseTime).getTime(),
                  pulse: item.pulse,
                  Temp: null,
                  Spo2: null,
                  HighBp: null,
                  LowBp: null,
                  RR: null,
                  HRV: null,
                });
              }

              if (item.temperatureTime && item.temperature !== 0) {
                vitals.push({
                  time: item.temperatureTime,
                  timestamp: new Date(item.temperatureTime).getTime(),
                  pulse: null,
                  Temp: item.temperature,
                  Spo2: null,
                  HighBp: null,
                  LowBp: null,
                  RR: null,
                  HRV: null,
                });
              }

              if (item.oxygenTime && item.oxygen !== 0) {
                vitals.push({
                  time: item.oxygenTime,
                  timestamp: new Date(item.oxygenTime).getTime(),
                  pulse: null,
                  Temp: null,
                  Spo2: item.oxygen,
                  HighBp: null,
                  LowBp: null,
                  RR: null,
                  HRV: null,
                });
              }

              if (item.bpTime && bp[0]) {
                vitals.push({
                  time: item.bpTime,
                  timestamp: new Date(item.bpTime).getTime(),
                  pulse: null,
                  Temp: null,
                  Spo2: null,
                  HighBp: bp[0] ? parseInt(bp[0]) : null,
                  LowBp: bp[1] ? parseInt(bp[1]) : null,
                  RR: null,
                  HRV: null,
                });
              }

              if (item.respiratoryRateTime && item.respiratoryRate !== 0) {
                vitals.push({
                  time: item.respiratoryRateTime,
                  timestamp: new Date(item.respiratoryRateTime).getTime(),
                  pulse: null,
                  Temp: null,
                  Spo2: null,
                  HighBp: null,
                  LowBp: null,
                  RR: item.respiratoryRate,
                  HRV: null,
                });
              }

              if (item.hrvTime && item.hrv !== 0) {
                vitals.push({
                  time: item.hrvTime,
                  timestamp: new Date(item.hrvTime).getTime(),
                  pulse: null,
                  Temp: null,
                  Spo2: null,
                  HighBp: null,
                  LowBp: null,
                  RR: null,
                  HRV: item.hrv,
                });
              }

              return [...acc, ...vitals];
            }, []);
          }

          // Aggregate data by time (round to nearest minute)
          const aggregatedData: { [time: string]: VitalData } = {};
          data.forEach((item) => {
            if (!item.time) return;
            const date = new Date(item.time);
            date.setSeconds(0, 0);
            const timeKey = date.toISOString();

            if (!aggregatedData[timeKey]) {
              aggregatedData[timeKey] = {
                time: timeKey,
                timestamp: date.getTime(),
                pulse: null,
                Temp: null,
                Spo2: null,
                HighBp: null,
                LowBp: null,
                RR: null,
                HRV: null,
              };
            }

            aggregatedData[timeKey] = {
              ...aggregatedData[timeKey],
              pulse: item.pulse ?? aggregatedData[timeKey].pulse,
              Temp: item.Temp ?? aggregatedData[timeKey].Temp,
              Spo2: item.Spo2 ?? aggregatedData[timeKey].Spo2,
              HighBp: item.HighBp ?? aggregatedData[timeKey].HighBp,
              LowBp: item.LowBp ?? aggregatedData[timeKey].LowBp,
              RR: item.RR ?? aggregatedData[timeKey].RR,
              HRV: item.HRV ?? aggregatedData[timeKey].HRV,
            };
          });

          const validData = Object.values(aggregatedData)
            .filter(
              (item) =>
                (item.pulse != null && item.pulse !== 0) ||
                (item.Temp != null && item.Temp !== 0) ||
                (item.Spo2 != null && item.Spo2 !== 0) ||
                item.HighBp != null ||
                item.LowBp != null ||
                (item.RR != null && item.RR !== 0) ||
                (item.HRV != null && item.HRV !== 0)
            )
            .sort((a, b) => a.timestamp - b.timestamp);

          const maxValue = validData.reduce((max, item) => {
            const values = [
              item.pulse,
              item.Temp,
              item.Spo2,
              item.HighBp,
              item.LowBp,
              item.RR,
              item.HRV,
            ].filter((v): v is number => v != null && v !== 0);
            return Math.max(max, ...values);
          }, 200);

          setMaxYValue(maxValue);
          setFilteredData(validData);
        } else {
          console.warn("No vitals data in response");
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching vitals:", error);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVitalsData();
  }, [
    timeline?.patientID,
    currentPatient?.id,
    currentPatient?.role,
    user?.token,
    selectedDate,
    timeRange,
    openAllGraphs,
  ]);

  const handleClose = () => {
    setOpenAllGraphs(false);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value || null);
    setTimeRange("custom");
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    setSelectedDate(null);
  };

  const vitalLines = [
    { dataKey: "pulse", name: "Pulse (bpm)", stroke: "#4EB9F6" },
    { dataKey: "Temp", name: "Temp (°C)", stroke: "#F79797" },
    { dataKey: "Spo2", name: "Spo2 (%)", stroke: "#58CEB2" },
    { dataKey: "HighBp", name: "High Bp (mm Hg)", stroke: "#2351B4" },
    { dataKey: "LowBp", name: "Low Bp (mm Hg)", stroke: "#A2BFFE" },
    { dataKey: "RR", name: "RR (bpm)", stroke: "#E96B89" },
    { dataKey: "HRV", name: "HRV (ms)", stroke: "#E0A060" },
  ];

 const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = filteredData.find((d) => d.timestamp === label);
    if (!dataPoint) return null;

    return (
      <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc" }}>
        <p>
          {new Date(dataPoint.time).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
            .split("/")
            .reverse()
            .join("-")}{" "}
          {new Date(dataPoint.time).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
        {vitalLines.map((line, i) => {
          const key = line.dataKey as keyof Omit<VitalData, "time" | "timestamp">;
          const value = dataPoint[key];
          if (value == null) return null;
          return (
            <p key={i} style={{ color: line.stroke }}>
              {line.name}: {value}{" "}
              {line.name.includes("Temp")
                ? "°C"
                : line.name.includes("Spo2")
                ? "%"
                : line.name.includes("Bp")
                ? "mm Hg"
                : line.name.includes("HRV")
                ? "ms"
                : "bpm"}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};
  // X-axis tick formatter
 const xAxisTickFormatter = (value: number | string): string => {
    const date = new Date(typeof value === "string" ? value : value);
    if (timeRange === "1d" || timeRange === "custom") {
      return `${date.getHours().toString().padStart(2, "0")}:00`;
    } else if (timeRange === "1w" || timeRange === "1m") {
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        });
    } else if (timeRange === "1y") {
      return date.toLocaleString("en-GB", { month: "short" });
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  };
const generate24HourTicks = (dateStr: string | null): number[] => {
  const baseDate = dateStr ? new Date(dateStr) : new Date();
  baseDate.setHours(0, 0, 0, 0); // Start at 00:00:00 of the day
  return Array.from({ length: 12 }, (_, i) => {
    const tickDate = new Date(baseDate);
    tickDate.setHours(i * 2, 0, 0, 0); // Every 2 hours (00:00, 02:00, ..., 22:00)
    return tickDate.getTime();
  });
};


  // Generate ticks for 1w view (7 days)
    const generate7DayTicks = (dateStr: string | null): number[] => {
      const baseDate = dateStr ? new Date(dateStr) : new Date();
      baseDate.setHours(0, 0, 0, 0); // Start at 00:00:00
      return Array.from({ length: 7 }, (_, i) => {
        const tickDate = new Date(baseDate);
        tickDate.setDate(baseDate.getDate() - (6 - i)); // Past 7 days including today
        return tickDate.getTime();
      });
    };

    // Generate ticks for 1m view (30/31 days)
  const generateMonthTicks = (dateStr: string | null): number[] => {
    const baseDate = dateStr ? new Date(dateStr) : new Date();
    baseDate.setHours(0, 0, 0, 0); // Start at 00:00:00
    const daysInRange = 30; // Fixed to 30 days for simplicity; adjust if needed
    return Array.from({ length: daysInRange }, (_, i) => {
      const tickDate = new Date(baseDate);
      tickDate.setDate(baseDate.getDate() - (daysInRange - 1 - i)); // Past 30 days including today
      return tickDate.getTime();
    });
  };


  // Generate ticks for 1y view (12 months)
  const generateYearTicks = (dateStr: string | null): number[] => {
    const baseDate = dateStr ? new Date(dateStr) : new Date();
    baseDate.setHours(0, 0, 0, 0); // Start at 00:00:00
    baseDate.setDate(1); // Start at the 1st of the month
    return Array.from({ length: 12 }, (_, i) => {
      const tickDate = new Date(baseDate);
      tickDate.setMonth(baseDate.getMonth() - (11 - i)); // Past 12 months
      return tickDate.getTime();
    });
  };

  // Generate ticks for all view (years)
  const generateAllYearTicks = (dateStr: string | null): number[] => {
    const baseDate = dateStr ? new Date(dateStr) : new Date();
    baseDate.setHours(0, 0, 0, 0); // Start at 00:00:00
    baseDate.setDate(1); // Start at the 1st of the month
    baseDate.setMonth(0); // Start at January
    const startYear = 2020; // Fixed start year
    const endYear = baseDate.getFullYear(); // Current year (2025)
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const tickDate = new Date(baseDate);
      tickDate.setFullYear(startYear + i); // Years from 2020 to 2025
      return tickDate.getTime();
    });
  };


  return (
    <div>
      <Dialog
        open={openAllGraphs}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle className={classes.blueDialogTitle} style={{ fontWeight: "bold" }}>
          All Vitals Graph
        </DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
          <Stack direction="row" spacing={2}>
          
            <Button
              variant={timeRange === "1d" ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange("1d")}
            >
              1D
            </Button>
            <Button
              variant={timeRange === "1w" ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange("1w")}
            >
              1W
            </Button>
            <Button
              variant={timeRange === "1m" ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange("1m")}
            >
              1M
            </Button>
            <Button
              variant={timeRange === "1y" ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange("1y")}
            >
              1Y
            </Button>
            <Button
              variant={timeRange === "all" ? "contained" : "outlined"}
              onClick={() => handleTimeRangeChange("all")}
            >
              All
            </Button>

              <TextField
              label="Select Date"
              type="date"
              value={selectedDate || ""}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
              sx={{ width: "200px" }}
            />
          </Stack>
        </Box>
        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}
          >
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Typography className={classes.noData} variant="h6">
            No Vitals Data
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={500} style={{ padding: "20px" }}>
           <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={
                  timeRange === "1d" || timeRange === "custom"
                    ? (() => {
                        const baseDate = selectedDate ? new Date(selectedDate) : new Date();
                        baseDate.setHours(0, 0, 0, 0);
                        const start = baseDate.getTime();
                        const end = start + 24 * 60 * 60 * 1000 - 1; // End of day
                        return [start, end];
                      })()
                    : timeRange === "1w"
                      ? (() => {
                          const baseDate = new Date();
                          baseDate.setHours(0, 0, 0, 0);
                          const end = baseDate.getTime();
                          const start = end - 6 * 24 * 60 * 60 * 1000; // 7 days including today
                          return [start, end];
                        })()
                      : timeRange === "1m"
                    ? (() => {
                        const baseDate = new Date();
                        baseDate.setHours(0, 0, 0, 0);
                        const end = baseDate.getTime();
                        const start = end - 29 * 24 * 60 * 60 * 1000; // 30 days including today
                        return [start, end];
                      })()
                    : timeRange === "1y"
                    ? (() => {
                        const baseDate = new Date();
                        baseDate.setHours(0, 0, 0, 0);
                        baseDate.setDate(1);
                        const end = baseDate.getTime();
                        const startDate = new Date(baseDate);
                        startDate.setMonth(baseDate.getMonth() - 11);
                        const start = startDate.getTime();
                        return [start, end];
                      })()
                    :  timeRange === "all"
                    ? (() => {
                        const baseDate = new Date();
                        baseDate.setHours(0, 0, 0, 0);
                        baseDate.setDate(1);
                        baseDate.setMonth(0);
                        const end = baseDate.getTime();
                        const startDate = new Date(baseDate);
                        startDate.setFullYear(2020); // Fixed start year
                        const start = startDate.getTime();
                        return [start, end];
                      })()
                    : ["dataMin", "dataMax"]
                }
                tickFormatter={xAxisTickFormatter}
                ticks={
                  timeRange === "1d" || timeRange === "custom"
                    ? generate24HourTicks(selectedDate)
                    :  timeRange === "1w"
                      ? generate7DayTicks(null)
                      : timeRange === "1m"
                    ? generateMonthTicks(null)
                    : timeRange === "1y"
                    ? generateYearTicks(null)
                    :  timeRange === "all"
                    ? generateAllYearTicks(null)
                    : undefined
                }
                angle={timeRange === "1y" ? -45 : 0}
                textAnchor={timeRange === "1y" ? "end" : "middle"}
              />
              <YAxis domain={[0, maxYValue]} tickFormatter={(value) => value.toFixed(0)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              {vitalLines.map((line) => (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.stroke}
                  activeDot={{ r: 8 }}
                  connectNulls={true} // Avoid connecting across missing data
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllVitalsGraph;