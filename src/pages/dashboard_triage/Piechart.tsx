import { VictoryPie, VictoryTooltip } from "victory";
import styles from "./dashboard.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import React, { useRef } from "react";
import { patientStatus } from "../../utility/role";
import { departmentType } from "../../types";

type propType = {
  filter: string;
};

const DoughnutChart = ({ filter }: propType) => {
  type dataType = {
    x: string;
    y: number;
  };
  type resType = {
    name: string;
    percentage: number;
  };
  const user = useSelector(selectCurrentUser);
  const getDataApi = useRef(true)
  const responseApi = useRef(true)
  const [data, setData] = React.useState<dataType[]>([]);
  const [departmentList, setDepartmentList] = React.useState<departmentType[]>(
    []
  );
  const getDepartments = async () => {
    const response = await authFetch(
      `department/${user.hospitalID}`,
      user.token
    );
    if (response.message == "success") {
      setDepartmentList(() => {
        return [...response.departments];
      });
    }
  };
  // const dispatch = useDispatch();
  const getData = async () => {
    // dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/count/departments/filter?ptype=${patientStatus.emergency}&filter=${filter}`,
      user.token
    );
    if (response.message == "success") {
      // const sum=
      setData(
        response.percentages.map((res: resType) => ({
          x: res.name,
          y: res.percentage,
        }))
      );
    }
  };
  React.useEffect(() => {
    if (user.token && responseApi.current) {
      responseApi.current = false
      getDepartments();
      if(getDataApi.current){
        getDataApi.current = false
        getData();
      }
    }
  }, [user]);
  const [colorScale, setColorScale] = React.useState<string[]>([]);
  React.useEffect(() => {
    setColorScale(
      data.map((_, index) => {
        const hue = (index * (360 / data.length)) % 360;
        return `hsl(${hue}, 90%, 65%)`; // Generate colors using HSL format
      })
    );
  }, [data]);
  React.useEffect(() => {
    if (data.length) {
      const newData: dataType[] = data || [];
      departmentList.forEach((department) => {
        const isData = newData.find((el) => el.x == department.name);
        if (!isData) newData.push({ x: department.name, y: 0 });
      });
      setData(newData);
    }
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
                ).toFixed(0)}%)`}
              </text>
            </g>
          );
        })}
      </g>
    );
  };
  return (
    <div className={styles.doughnutChart}>
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
            }: ${datum.y}%`
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
      </svg>
    </div>
  );
};

export default DoughnutChart;
