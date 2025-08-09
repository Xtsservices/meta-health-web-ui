import { VictoryPie, VictoryTooltip } from "victory";
import styles from "./dashboard.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import React, { useRef } from "react";
import NoPatientVisitedByZone from "../dashboard_opd/NoPatientVisitedByZone";
// import { setLoading } from "../../store/error/error.action";

interface DoughnutChartProps {
  selectedWardDataFilter: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ selectedWardDataFilter }) => {
  // const data = [
  // { x: "Cardiology", y: 35 },
  // { x: "Dermatology", y: 20 },
  // { x: "Neurology", y: 45 },
  // { x: "Others", y: 45 },
  // ];
  type dataType = {
    x: string;
    y: number;
  };
  type resType = {
    ward: string;
    percentage: number;
  };
  const user = useSelector(selectCurrentUser);
  const [data, setData] = React.useState<dataType[]>([]);
  const getDataApi = useRef(true)
  // const dispatch = useDispatch();
  const getData = async () => {
    // dispatch(setLoading(true));
    // const response = await authFetch(
    //   `patient/${user.hospitalID}/patients/count/departments`,
    //   user.token
    // );
    const responseWard = await authFetch(
      `ward/${user.hospitalID}/distributionForStaff/${selectedWardDataFilter}?role=${user.role}&userID=${user.id}`,
      user.token
    );

    // dispatch(setLoading(false));
    if (responseWard.message == "success") {
      setData(
        responseWard.summary.map((res: resType) => ({
          x: res.ward,
          y:   Number(res.percentage),
        }))
      );
      getDataApi.current = true
    }
  };
  React.useEffect(() => {
    if(user.token && getDataApi.current){
      getDataApi.current = false
      getData();
    }
  }, [user.token,selectedWardDataFilter]);
  // const colorScale = ["#FF9A62", "#4ECB71", "#85B6FF", "#FFD233"];
  const [colorScale, setColorScale] = React.useState<string[]>([]);
  React.useEffect(() => {
    setColorScale(
      data.map((_, index) => {
        const hue = (index * (360 / data.length)) % 360;
        return `hsl(${hue}, 90%, 65%)`; // Generate colors using HSL format
      })
    );
  }, [data]);
  const renderLegend = () => {
    const columns = 1; // Number of columns
    const legendSize = 18; // Size of the legend item (circle)
    const horizontalSpacing = 160; // Increased horizontal spacing between columns

    return (
      <g transform={`translate(60, 340)`}>
        {data.map((item, index) => {
          const row = Math.floor(index / columns); // Calculate the row number (0-based) for each element
          const col = index % columns; // Calculate the column number (0-based) for each element
          const xOffset = col * horizontalSpacing; // Adjusted horizontal spacing between columns
          const yOffset = row * 30;

          return (
            
            <g
              key={item.x}
              transform={`translate(${xOffset}, ${yOffset})`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <circle r={legendSize / 2} fill={colorScale[index]} />
              <text
                x={legendSize + 4}
                y={legendSize / 2}
                style={{ fontSize: 12 }}
              >
                {`${item.x.charAt(0).toUpperCase() + item.x.slice(1)} (${Number(
                  item.y
                ).toFixed(0)})`}
              </text>
            </g>
            
          );
        })}
      </g>
    );
  };
  return (
    <div className={styles.doughnutChart}>
      {data?.length<1?(
        <NoPatientVisitedByZone/>

      ):(

      <svg viewBox="0 0 400 700">
        {/* <VictoryPie
          data={data}
          innerRadius={60}
          width={400}
          height={340}
          colorScale={colorScale}
          labels={() => null} // Remove the labels
        /> */}
        
        <VictoryPie
          standalone={false}
          width={400}
          height={350}
          data={data}
          innerRadius={60}
          colorScale={colorScale}
          labels={({ datum }) =>
            `${
              datum.x.slice(0, 1).toUpperCase() + datum.x.slice(1).toLowerCase()
            }: ${datum.y}`
          } // Remove the labels
          style={{
            labels: {
              fill: "transparent",
            },
          }}
          labelComponent={
            <VictoryTooltip
              style={{ fill: "white" }}
              flyoutStyle={{ fill: "black" }}
              renderInPortal={false}
              constrainToVisibleArea
              // text={({ datum }) => {
              //   return `${datum.x}\n${datum.y} (${datum.percent.toFixed(2)}%)`;
              // }}
            />
          }
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: "labels",
                      mutation: () => ({ active: true }),
                    },
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: "labels",
                      mutation: () => ({ active: false }),
                    },
                  ];
                },
              },
            },
          ]}
        />
        {renderLegend()}
        {/* <div className={styles.label}>
        <div className={styles.label_item}>
          <div
            className={styles.label_item_color}
            style={{ background: "red" }}
          ></div>
          <div className={styles.label_item_name}>xyzz</div>
        </div>
      </div> */}
      </svg>
      )}

    </div>
  );
};

export default DoughnutChart;
