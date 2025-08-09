import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  // VictoryLabel,
} from "victory";
import styles from "./dashboard.module.scss";
import { authFetch } from "../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import React from "react";
import { setLoading } from "../../store/error/error.action";
import { dateObj } from "../../utility/calender";
type propType = {
  filter: string;
  filterPatientByStatus: dateObj;
};
const BarGraph = ({ filter, filterPatientByStatus }: propType) => {
  // const data = [
  //   { x: "Discharged Patients", y: 5, color: "#f9b995" },
  //   { x: "In Patients", y: 8, color: "#f99f99" },
  //   { x: "New Patients", y: 3, color: "#c0e4ff" },
  //   { x: "Available Nurses", y: 9, color: "#1DD3D3" },
  //   { x: "Deaths", y: 5, color: "#0DFB73" },
  //   { x: "Emergency", y: 8, color: "#DC3C5D" },
  //   { x: "Surgeries", y: 3, color: "#B0EDF3" },
  // ];
  
  const color = ["#f9b995", "#f99f99", "#c0e4ff", "#e7c2dd"];
  type dataType = {
    x: string;
    y: number;
    color: string;
  };
  const [data, setData] = React.useState<dataType[]>([]);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const getAllData = async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${
        user.hospitalID
      }/patients/summary?duration=${filter}&filterValue=${
        filterPatientByStatus[filter as keyof dateObj]
      }`,
      user.token
    );
    // const responeWardSummary = await authFetch(
    //   `ward/${user.hospitalID}/getSummary?duration=year&category=1`,
    //   user.token
    // );
    // console.log("ward summary response", responeWardSummary);
    // console.log("response from filter", response);
    // console.log("-------great data------", response);
    if (response.message == "success") {
      setData(() => {
        const keys = Object.keys(response.summary);
        const newArray = keys.map((el, index) => {
          // console.log("bar patient",color);
          return { x: el, y: response.summary[el], color: color[index] };
        });
        return newArray;
      });
    }
    dispatch(setLoading(false));
  };

  React.useEffect(() => {
    getAllData();
  }, [filter, user, filterPatientByStatus]);
  const width = 600;
  const height = 280;
  return (
    <div className={styles.bargraph_chart}>
      <div style={{ width, height }} className={styles.bargraph_chart_graph}>
        <VictoryChart
          // theme={VictoryTheme.material}
          // domainPadding={{ x: 10 }}
          domainPadding={60}
          width={width}
          height={height}
        >
          <VictoryAxis
            style={{
              grid: {
                stroke: "#EBEBEB", // Set the color of the grid lines
                strokeWidth: 1, // Set the width of the grid lines
              },
              ticks: { stroke: "grey", size: 5 },
              axis: { stroke: "black" },
              tickLabels: { fontSize: 10, fill: "black" },
            }}
            dependentAxis
            crossAxis
          />
          <VictoryAxis
            tickFormat={data.map((item) => item.x)}
            style={{
              grid: {
                stroke: "#EBEBEB", // Set the color of the grid lines
                strokeWidth: 1, // Set the width of the grid lines
              },
              // axis: { stroke: "transparent" },
              tickLabels: { fontSize: 10, fill: "black" },
            }}
            crossAxis
            // tickValues={[2.11, 3.9, 6.1, 8.05]}
          />

          <VictoryBar
            data={data}
            x="x"
            y="y"
            style={{
              data: { fill: (d) => d.datum.color },
            }}
            // padding={{ top: 50, bottom: 50, left: 30 }}
            barWidth={25}
            barRatio={0.1}
            labels={({ datum }) => `${datum.y}`}
            labelComponent={
              <VictoryTooltip
                style={{
                  fill: "white",
                }}
                flyoutStyle={{
                  stroke: "transparent",
                  strokeWidth: 2,
                  backgroundColor: "red",
                  fill: "#6B9DFE",
                }}
              />
            }
          />
        </VictoryChart>
      </div>
      <div className={styles.bargraph_chart_label}>
        {data.map((el) => (
          <div className={styles.label_item}>
            <div
              className={styles.label_circle}
              style={{ background: el.color }}
            ></div>
            {el.x}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarGraph;
