import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/error/error.action";
import { authFetch } from "../../axios/useAuthFetch";
import DatePicker from "react-datepicker";
import styles from "../nurseDashboard/dashboard.module.scss";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from "victory";
import { FaCalendarAlt } from "react-icons/fa";
import { selectCurrentUser } from "../../store/user/user.selector";

interface ChartDataPoint {
  x: number;
  y: number;
}

interface ChartData {
  labels: string[];
  totalAlerts: ChartDataPoint[];
  viewedAlerts: ChartDataPoint[];
  peakHourAlerts: ChartDataPoint[];
}

interface PeakHourAlertsChartProps {
  name: "Individual" | "Hospital";
}

export const PeakHourAlertsChart: React.FC<PeakHourAlertsChartProps> = ({ name }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [data, setData] = useState<ChartData>({
    labels: [],
    totalAlerts: [],
    viewedAlerts: [],
    peakHourAlerts: Array.from({ length: 24 }, (_, i) => ({
      x: i + 1, // Position bars between hour labels
      y: 0,
    })),
  });
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const datePickerRef = useRef<any>(null);

  const handleCalendarIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (selectedDate && user?.token) {
      const dateKey = formatDate(selectedDate);
      const fetchAlerts = async () => {
        try {
          dispatch(setLoading(true));
          const endpoint =
            name === "Hospital"
              ? `alerts/getcceCountByDateHourly?date=${dateKey}`
              : `alerts/getIndividualAlertsByDateHourly?date=${dateKey}`;
          const response = await authFetch(endpoint, user?.token);
          console.log(`${name} PeakHourAlerts API response for ${dateKey}:`, response);

          if (response.message === "success") {
            // Transform hourly counts to use numerical x-values for mid-hour positioning
            const transformedData = response.hourlyCounts.map((point: { x: string; y: number }) => {
              const hour = parseInt(point.x.split(":")[0]);
              return {
                x: hour + 1, // Center bar between hours
                y: point.y,
              };
            });
            setData((prevData) => ({
              ...prevData,
              peakHourAlerts: transformedData,
            }));
          } else {
            console.error(`${name} PeakHourAlerts API error:`, response.message);
            setData((prevData) => ({
              ...prevData,
              peakHourAlerts: Array.from({ length: 24 }, (_, i) => ({
                x: i + 1,
                y: 0,
              })),
            }));
          }
        } catch (error) {
          console.error(`Error fetching ${name} peak hour alerts for ${dateKey}:`, error);
          setData((prevData) => ({
            ...prevData,
            peakHourAlerts: Array.from({ length: 24 }, (_, i) => ({
              x: i + 1,
              y: 0,
            })),
          }));
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchAlerts();
    } else {
      console.warn(`No user token or selected date for ${name} PeakHourAlertsChart`);
    }
  }, [selectedDate, user?.token, dispatch, name]);

  // Determine y-axis tick values
  const hasNoValues = data.peakHourAlerts.every((point) => point.y === 0);
  const yAxisTickValues = hasNoValues ? [1, 2, 3, 4] : undefined;

  // Define x-axis tick values for whole hours, starting slightly after 0
  const xAxisTickValues = Array.from({ length: 24 }, (_, i) => i + 0.5); // 0.5 to 23.5

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartCardHeader}>
        <h3 className={styles.chartTitle}>{name} Peak Hour Alerts</h3>
        <div className={styles.datePickerContainer}>
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className={styles.datePicker}
            maxDate={new Date()}
          />
          <FaCalendarAlt
            className={styles.calendarIcon}
            style={{ color: "#00BCD4" }}
            onClick={handleCalendarIconClick}
          />
        </div>
      </div>
      <div className={styles.chartContainer} ref={chartRef}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={chartRef.current ? chartRef.current.offsetWidth : 400}
          height={200}
          padding={{ left: 60, right: 60, top: 20, bottom: 50 }}
          domainPadding={{ x: [40, 40], y: 20 }}
        >
          <VictoryAxis
            label="Hour"
            tickValues={xAxisTickValues}
            tickFormat={xAxisTickValues.map((i) => `${Math.floor(i).toString().padStart(2, "0")}:00`)}
            style={{
              axisLabel: { padding: 30, fontSize: 12, fontWeight: "bold" },
              tickLabels: { fontSize: 8, angle: -45, textAnchor: "end", padding: 10 },
              axis: { stroke: "#ccc" },
              grid: { stroke: "none" },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="No of Alerts"
            tickValues={yAxisTickValues}
            tickFormat={(y: number) => `${y}`}
            style={{
              axisLabel: { padding: 40, fontSize: 12, fontWeight: "bold" },
              tickLabels: { fontSize: 10 },
              axis: { stroke: "#ccc" },
              grid: { stroke: "none" },
            }}
          />
          <VictoryBar
            data={data.peakHourAlerts}
            x="x"
            y="y"
            style={{ data: { fill: "#00BCD4", width: 10 } }}
            labels={({ datum }: { datum: ChartDataPoint }) =>
              datum.x === Number(hoveredBar) ? `${datum.y}` : ""
            }
            labelComponent={<VictoryLabel dy={-10} />}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onMouseOver: () => {
                    return [
                      {
                        target: "data",
                        mutation: (props) => {
                          setHoveredBar(props.datum.x.toString());
                          return null;
                        },
                      },
                    ];
                  },
                  onMouseOut: () => {
                    return [
                      {
                        target: "data",
                        mutation: () => {
                          setHoveredBar(null);
                          return null;
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
    </div>
  );
};