import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from "victory";
import styles from "./dashboard.module.scss";
import { authFetch } from "../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import React from "react";
import { setLoading } from "../../store/error/error.action";
type propType = {
  filter: string;
  category: number;
  filterValue: string;
};

const BarGraphWard = ({ filter, category, filterValue }: propType) => {
  const color = [
    "#f9b995", "#f99f99", "#c0e4ff", "#e7c2dd", "#2865A0", "#17C5F0", // original colors
    "#FFDFD3", "#FFE5B4", "#FADADD", "#D5ECC2", "#C9E4DE", "#CAF7E3", "#EDFFEC", 
    "#FFD1DC", "#D4A5A5", "#FFC8A2", "#F6E7D8", "#B0E0E6", "#E6E6FA", "#FFF0F5",
    "#FAFAD2", "#E0FFFF", "#FFB6C1", "#D8BFD8", "#FFFACD"
  ];
  

  type dataType = {
    x: string;
    y: number;
    color: string;
  };
  const [data, setData] = React.useState<dataType[]>([]);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [,setWidth] = React.useState(0);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      //   const screenWidth = window.screen.width;
      //   if (screenWidth > 1150) {
      //     setWidth(1200);
      //   } else {
      //     setWidth(1200);
      //   }
      setWidth(Number(ref.current?.parentElement?.clientWidth) - 400);
    });
    setWidth(Number(ref.current?.parentElement?.clientWidth) - 400);
  }, [ref]);
  const getAllData = async () => {
    dispatch(setLoading(true));
    // const response = await authFetch(
    //   `patient/${user.hospitalID}/patients/summary?duration=${filter}`,
    //   user.token
    // );
    // console.log(
    //   `ward/${user.hospitalID}/getSummary?duration=${filter}&category=${category}`
    // );
    const response = await authFetch(
      `ward/${user.hospitalID}/getSummary?duration=${filter}&category=${category}&filterValue=${filterValue}`,
      user.token
    );

    if (response.message == "success") {
      setData(() => {
        const keys = Object.keys(response.summary);
        const newArray = keys.map((el, index) => {
          return { x: el, y: response.summary[el], color: color[index]};
        });
        return newArray;
      });
    }
    dispatch(setLoading(false));
  };
  React.useEffect(() => {
    getAllData();
  }, [filter, user, category, filterValue]);
    // const width = 600; //original
    const width = 800; 
  const height = 280;
  return (
    <div className={styles.bargraph_chart} ref={ref}>
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
            barRatio={0.8}
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

export default BarGraphWard;
