import React, { useRef } from "react";
import { useSelector } from "react-redux";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
} from "victory";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import styles from "./dashboard.module.scss";

interface BarGraphProps {
  doctorID: number;
  year?: string;
  month?: string;
}

const BarGraphDoctor = ({ doctorID, year, month }: BarGraphProps) => {
  const colorPalette = ["#f9b995", "#f99f99", "#c0e4ff", "#e7c2dd"];
  const width = 800;
  const height = 260;

  type DataType = {
    x: string;
    y: number;
    color: string;
  };

  const user = useSelector(selectCurrentUser);
  const [data, setData] = React.useState<DataType[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [, setWidth] = React.useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(Number(ref.current?.parentElement?.clientWidth));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);

  const getData = async () => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/doctorSummary?doctorID=${doctorID}&year=${year || new Date().getFullYear()}&month=${month || new Date().getMonth() + 1}`,
      user.token
    );

    if (response.message === "success" && response.summary) {
      const summaryData = Object.keys(response.summary)
        .map((key, index) => ({
          x: key,
          y: response.summary[key],
          color: colorPalette[index % colorPalette.length],
        }))
        // Filter out entries with y = 0
        .filter(item => item.y > 0);

      // Determine max value for scaling
      const maxYValue = Math.max(...summaryData.map((item) => item.y));
      const scalingFactor = maxYValue > 0 ? Math.ceil(maxYValue / 99) : 1;

      // Update data with scaled y values
      setData(
        summaryData.map((item) => ({
          ...item,
          y: Math.ceil(item.y / scalingFactor),
        }))
      );
    } else {
      setData([]);
    }
  };

  React.useEffect(() => {
    getData();
  }, [user, doctorID, year, month]);

  return (
    <div className={styles.bargraph_chart}>
      <div style={{ width, height }} ref={ref} className={styles.bargraph_chart_graph}>
        <VictoryChart domainPadding={60} width={width} height={height}>
          <VictoryAxis
            style={{
              grid: { stroke: "#EBEBEB", strokeWidth: 1 },
              ticks: { stroke: "grey", size: 5 },
              axis: { stroke: "black" },
              tickLabels: { fontSize: 10, fill: "black" },
            }}
            dependentAxis
            tickFormat={(tick) => Math.floor(tick)} // Format to show only whole numbers
          />
          <VictoryAxis
            tickFormat={data.map((item) => item.x)}
            style={{
              grid: { stroke: "#EBEBEB", strokeWidth: 1 },
              tickLabels: { fontSize: 10, fill: "black" },
            }}
          />
          <VictoryBar
            data={data}
            x="x"
            y="y"
            style={{ data: { fill: (d) => d.datum.color } }}
            barWidth={25}
            labels={({ datum }) => `${datum.y}`}
            labelComponent={
              <VictoryTooltip
                style={{ fill: "white" }}
                flyoutStyle={{
                  stroke: "transparent",
                  fill: "#6B9DFE",
                }}
              />
            }
          />
        </VictoryChart>
      </div>
      <div className={styles.bargraph_chart_label}>
        {data.map((el) => (
          <div key={el.x} className={styles.label_item}>
            <div className={styles.label_circle} style={{ background: el.color }}></div>
            {el.x}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarGraphDoctor;
