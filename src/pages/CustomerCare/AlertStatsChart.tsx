import { useEffect, useRef, useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import styles from "../nurseDashboard/dashboard.module.scss";
import { authFetch } from "../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

interface ChartDataPoint {
  x: string;
  y: number;
  totalAlerts?: number;
  viewedAlerts?: number;
}

interface ChartData {
  labels: string[];
  totalAlerts: ChartDataPoint[];
  viewedAlerts: ChartDataPoint[];
  peakHourAlerts: ChartDataPoint[];
  combinedData: ChartDataPoint[];
}

interface AlertStatsChartProps {
  name: "Individual" | "Hospital";
}

export const AlertStatsChart: React.FC<AlertStatsChartProps> = ({ name }) => {
  const user = useSelector(selectCurrentUser);
  const chartRef = useRef<HTMLDivElement>(null);
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ChartData>({
    labels: [],
    totalAlerts: [],
    viewedAlerts: [],
    peakHourAlerts: [],
    combinedData: [],
  });

  // Helper function to get the number of days in a month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const fetchIndividualData = async (year: string, month: string) => {
    try {
      setIsLoading(true);
      const monthParam = month || "all";
      const response = await authFetch(
        `alerts/getIndividualAlertsByYearAndMonth?year=${year}&month=${monthParam}`,
        user?.token
      );

      if (response?.success) {
        if (month) {
          // Daily data for a specific month
          const yearNum = parseInt(year);
          const monthNum = parseInt(month);

          const daysInMonth = getDaysInMonth(yearNum, monthNum);
          const labels = Array.from({ length: daysInMonth }, (_, i) =>
            (i + 1).toString()
          );

          const totalAlerts: ChartDataPoint[] = labels.map((day) => ({
            x: day,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const viewedAlerts: ChartDataPoint[] = labels.map((day) => ({
            x: day,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const combinedData: ChartDataPoint[] = labels.map((day) => ({
            x: day,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));

          response.data.forEach((item: any) => {
            const period = parseInt(item.period);
            if (period >= 1 && period <= daysInMonth) {
              totalAlerts[period - 1] = {
                x: period.toString(),
                y: item.total_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              viewedAlerts[period - 1] = {
                x: period.toString(),
                y: item.viewed_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              combinedData[period - 1] = {
                x: period.toString(),
                y: Math.max(item.total_alerts || 0, item.viewed_alerts || 0),
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
            }
          });

          setData({
            labels,
            totalAlerts,
            viewedAlerts,
            peakHourAlerts: [],
            combinedData,
          });
        } else {
          // Monthly data for the year
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const labels = monthNames;

          const totalAlerts: ChartDataPoint[] = monthNames.map((month) => ({
            x: month,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const viewedAlerts: ChartDataPoint[] = monthNames.map((month) => ({
            x: month,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const combinedData: ChartDataPoint[] = monthNames.map((month) => ({
            x: month,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));

          response.data.forEach((item: any) => {
            const period = item.period;
            const monthIndex = monthNames.indexOf(period);
            if (monthIndex !== -1) {
              totalAlerts[monthIndex] = {
                x: period,
                y: item.total_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              viewedAlerts[monthIndex] = {
                x: period,
                y: item.viewed_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              combinedData[monthIndex] = {
                x: period,
                y: Math.max(item.total_alerts || 0, item.viewed_alerts || 0),
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
            }
          });

          setData({
            labels,
            totalAlerts,
            viewedAlerts,
            peakHourAlerts: [],
            combinedData,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching individual alert data:", error);
      if (month) {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const daysInMonth = getDaysInMonth(yearNum, monthNum);
        const labels = Array.from({ length: daysInMonth }, (_, i) =>
          (i + 1).toString()
        );
        const totalAlerts = labels.map((day) => ({
          x: day,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const viewedAlerts = labels.map((day) => ({
          x: day,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const combinedData = labels.map((day) => ({
          x: day,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        setData({
          labels,
          totalAlerts,
          viewedAlerts,
          peakHourAlerts: [],
          combinedData,
        });
      } else {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const labels = monthNames;
        const totalAlerts = labels.map((month) => ({
          x: month,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const viewedAlerts = labels.map((month) => ({
          x: month,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const combinedData = labels.map((month) => ({
          x: month,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        setData({
          labels,
          totalAlerts,
          viewedAlerts,
          peakHourAlerts: [],
          combinedData,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHospitalData = async (year: string, month: string) => {
    try {
      setIsLoading(true);
      const monthParam = month ? `/${month.padStart(2, "0")}` : "/All";
      const response = await authFetch(
        `alerts/getcceAlertsStatsHospital/${year}${monthParam}`,
        user?.token
      );

      if (response?.success) {
        if (month) {
          const yearNum = parseInt(year);
          const monthNum = parseInt(month);

          const daysInMonth = getDaysInMonth(yearNum, monthNum);
          const labels = Array.from({ length: daysInMonth }, (_, i) =>
            (i + 1).toString()
          );

          const totalAlerts: ChartDataPoint[] = labels.map((day) => ({
            x: day,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const viewedAlerts: ChartDataPoint[] = labels.map((day) => ({
            x: day,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const combinedData: ChartDataPoint[] = labels.map((day) => ({
            x: day,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));

          response.data.forEach((item: any) => {
            const period = parseInt(item.period);
            if (period >= 1 && period <= daysInMonth) {
              totalAlerts[period - 1] = {
                x: period.toString(),
                y: item.total_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              viewedAlerts[period - 1] = {
                x: period.toString(),
                y: item.viewed_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              combinedData[period - 1] = {
                x: period.toString(),
                y: Math.max(item.total_alerts || 0, item.viewed_alerts || 0),
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
            }
          });

          setData({
            labels,
            totalAlerts,
            viewedAlerts,
            peakHourAlerts: [],
            combinedData,
          });
        } else {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const labels = monthNames;

          const totalAlerts: ChartDataPoint[] = monthNames.map((month) => ({
            x: month,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const viewedAlerts: ChartDataPoint[] = monthNames.map((month) => ({
            x: month,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));
          const combinedData: ChartDataPoint[] = monthNames.map((month) => ({
            x: month,
            y: 0,
            totalAlerts: 0,
            viewedAlerts: 0,
          }));

          response.data.forEach((item: any) => {
            const period = item.period;
            const monthIndex = monthNames.indexOf(period);
            if (monthIndex !== -1) {
              totalAlerts[monthIndex] = {
                x: period,
                y: item.total_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              viewedAlerts[monthIndex] = {
                x: period,
                y: item.viewed_alerts || 0,
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
              combinedData[monthIndex] = {
                x: period,
                y: Math.max(item.total_alerts || 0, item.viewed_alerts || 0),
                totalAlerts: item.total_alerts || 0,
                viewedAlerts: item.viewed_alerts || 0,
              };
            }
          });

          setData({
            labels,
            totalAlerts,
            viewedAlerts,
            peakHourAlerts: [],
            combinedData,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching hospital alert data:", error);
      if (month) {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const daysInMonth = getDaysInMonth(yearNum, monthNum);
        const labels = Array.from({ length: daysInMonth }, (_, i) =>
          (i + 1).toString()
        );
        const totalAlerts = labels.map((day) => ({
          x: day,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const viewedAlerts = labels.map((day) => ({
          x: day,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const combinedData = labels.map((day) => ({
          x: day,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        setData({
          labels,
          totalAlerts,
          viewedAlerts,
          peakHourAlerts: [],
          combinedData,
        });
      } else {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const labels = monthNames;
        const totalAlerts = labels.map((month) => ({
          x: month,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const viewedAlerts = labels.map((month) => ({
          x: month,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        const combinedData = labels.map((month) => ({
          x: month,
          y: 0,
          totalAlerts: 0,
          viewedAlerts: 0,
        }));
        setData({
          labels,
          totalAlerts,
          viewedAlerts,
          peakHourAlerts: [],
          combinedData,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!filterYear) return;

    if (name === "Individual") {
      fetchIndividualData(filterYear, filterMonth);
    } else if (name === "Hospital") {
      fetchHospitalData(filterYear, filterMonth);
    }
  }, [filterYear, filterMonth, name]);

  // Calculate max y-value for y-axis domain
  const maxY = Math.max(
    ...data.totalAlerts.map((d) => d.y),
    ...data.viewedAlerts.map((d) => d.y),
    10 // Minimum max to avoid flat chart
  );

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartCardHeader}>
        <h3 className={styles.chartTitle}>Alert Stats</h3>
        <div className={styles.filterContainer}>
          <select
            name="yearFilter"
            onChange={(e) => setFilterYear(e.target.value)}
            value={filterYear}
            className={styles.margin_left_auto}
            style={{ color: "black" }}
          >
            <option value="">Year</option>
            {Array.from(
              { length: new Date().getFullYear() - 1950 + 1 },
              (_, idx) => {
                const year = new Date().getFullYear() - idx;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              }
            )}
          </select>
          <select
            name="monthFilter"
            onChange={(e) => setFilterMonth(e.target.value)}
            value={filterMonth}
            style={{ width: "5rem", color: "black" }}
          >
            <option value="">All</option>
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <span
            className={styles.legendColor}
            style={{ backgroundColor: "#9EC6F3" }}
          ></span>
          <span className={styles.legendText}>Total Alerts</span>
        </div>
        <div className={styles.legendItem}>
          <span
            className={styles.legendColor}
            style={{ backgroundColor: "#E69DB8" }}
          ></span>
          <span className={styles.legendText}>Viewed Alerts</span>
        </div>
      </div>
      <div className={styles.chartContainer} ref={chartRef}>
        {isLoading ? (
          <div>Loading chart data...</div>
        ) : (
          <VictoryChart
            theme={VictoryTheme.material}
            width={
              chartRef.current ? Math.max(chartRef.current.offsetWidth, 400) : 400
            }
            height={300}
            padding={{ left: 60, right: 60, top: 40, bottom: 50 }}
            domainPadding={{ x: [40, 40], y: 20 }}
            domain={{ y: [0, maxY] }}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension="x"
                voronoiBlacklist={["totalAlertsLine", "viewedAlertsLine"]}
                labels={({ datum }) =>
                  filterMonth
                    ? `${datum.x}/${filterMonth}/${filterYear}\nTotal Alerts: ${datum.totalAlerts}\nViewed Alerts: ${datum.viewedAlerts}`
                    : `${datum.x}\nTotal Alerts: ${datum.totalAlerts}\nViewed Alerts: ${datum.viewedAlerts}`
                }
                labelComponent={
                  <VictoryTooltip
                    style={{
                      fontSize: 10,
                      fill: "#333",
                      padding: 8,
                    }}
                    flyoutStyle={{
                      fill: "transparent",
                      stroke: "#ccc",
                      strokeWidth: 1,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    flyoutPadding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                    pointerLength={5}
                  />
                }
              />
            }
          >
            <VictoryAxis
              label={filterMonth === "" ? "Month" : "Date"}
              tickValues={data.labels}
              style={{
                axisLabel: { padding: 30, fontSize: 12, fontWeight: "bold" },
                tickLabels: { fontSize: 10, angle: -45, textAnchor: "end" },
                axis: { stroke: "#ccc" },
                grid: { stroke: "none" },
              }}
            />
            <VictoryAxis
              dependentAxis
              label="Alert Count"
              tickFormat={(y: number) => `${y}`}
              style={{
                axisLabel: { padding: 40, fontSize: 12, fontWeight: "bold" },
                tickLabels: { fontSize: 10 },
                axis: { stroke: "#ccc" },
                grid: { stroke: "none" },
              }}
            />
            <VictoryLine
              name="totalAlertsLine"
              data={data.totalAlerts}
              style={{
                data: { stroke: "#9EC6F3", strokeWidth: 3 },
                parent: { border: "1px solid #ccc" },
              }}
            />
            <VictoryLine
              name="viewedAlertsLine"
              data={data.viewedAlerts}
              style={{
                data: { stroke: "#E69DB8", strokeWidth: 3 },
                parent: { border: "1px solid #ccc" },
              }}
            />
            <VictoryLine
              name="tooltipLine"
              data={data.combinedData}
              style={{
                data: { stroke: "transparent", strokeWidth: 0 },
              }}
            />
          </VictoryChart>
        )}
      </div>
    </div>
  );
};