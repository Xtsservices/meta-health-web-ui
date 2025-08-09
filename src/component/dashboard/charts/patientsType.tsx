import { VictoryPie, VictoryTooltip } from "victory";
import styles from "./chart.module.scss";

type DataPropType = {
  x: string;
  y: number;
}[];

const colors = { emergency: "#a357f4", elective: "#3ce7b3" };

const PatientTypeChart = ({ data }: { data: DataPropType }) => {
  const legendData = data.map((item) => ({
    name: item.x,
    symbol: { fill: colors[item.x as keyof typeof colors] },
  }));

  return (
    <div className={styles.container}>
      <div className={styles.container_chart_box}>
        <div className={styles.chart_box}>
          <VictoryPie
            colorScale={data.map(
              (item) => colors[item.x as keyof typeof colors]
            )}
            data={data}
            innerRadius={200}
            labels={({ datum }) =>
              `${
                datum.x.slice(0, 1).toUpperCase() +
                datum.x.slice(1).toLowerCase()
              }: ${datum.y}%`
            }
            labelComponent={
              <VictoryTooltip
                // className={styles.tooltip}
                style={{
                  fill: "white",
                  fontSize: 24,
                }}
                flyoutPadding={12}
                flyoutStyle={{ fill: "black" }}
                renderInPortal={false}
                constrainToVisibleArea
              />
            }
            events={[
              {
                target: "data",
                eventHandlers: {
                  onMouseOver: () => [
                    { target: "labels", mutation: () => ({ active: true }) },
                  ],
                  onMouseOut: () => [
                    { target: "labels", mutation: () => ({ active: false }) },
                  ],
                },
              },
            ]}
          />
        </div>

        <div className={styles.flex}>
          <div className={styles.legend_box}>
            {legendData.map((item) => (
              <div className={styles.legend_row}>
                <div
                  className={styles.legend_circle}
                  style={{ backgroundColor: item.symbol.fill }}
                ></div>
                <div
                  className={styles.legend_text}
                  style={{ textTransform: "capitalize" }}
                >
                  <span>{item.name}</span>
                  <span>90%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTypeChart;
