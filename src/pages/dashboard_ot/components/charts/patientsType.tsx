import { VictoryPie, VictoryTooltip } from 'victory';
import styles from './chart.module.scss';

interface PatientTypeChartProps {
  data: { x: string; y: number }[];
  colors: Record<string, string>;
}



const PatientTypeChart: React.FC<PatientTypeChartProps> = ({ data, colors }) => {
  const legendData = data.map((item) => ({
    name: item.x,
    symbol: { fill: colors[item.x as keyof typeof colors] },
    Percentage: item.y,
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
              }: ${datum.y}`
            }
            labelComponent={
              <VictoryTooltip
                // className={styles.tooltip}
                style={{
                  fill: 'white',
                  fontSize: 24,
                }}
                flyoutPadding={12}
                flyoutStyle={{ fill: 'black' }}
                renderInPortal={false}
                constrainToVisibleArea
              />
            }
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onMouseOver: () => [
                    { target: 'labels', mutation: () => ({ active: true }) },
                  ],
                  onMouseOut: () => [
                    { target: 'labels', mutation: () => ({ active: false }) },
                  ],
                },
              },
            ]}
          />
        </div>

        <div className={styles.flex}>
          <div className={styles.legend_box}>
            {legendData?.map((item) => (
              <div className={styles.legend_row}>
                <div
                  className={styles.legend_circle}
                  style={{ backgroundColor: item.symbol.fill }}
                ></div>
                <div className={styles.legend_text}>
                  <span>{item.name}</span>
                  <span>{item?.Percentage ? `${item.Percentage}`:0}</span>
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
