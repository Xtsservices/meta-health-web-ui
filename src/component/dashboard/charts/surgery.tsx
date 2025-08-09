import { VictoryPie, VictoryTooltip } from 'victory';
import styles from './chart.module.scss';

type DataPropType = {
  x: string;
  y: number;
}[];

const SurgeryChart = ({ data }: { data: DataPropType }) => {
  const colors = data.map((item, idx) => {
    const hue = (idx * (360 / data.length)) % 360;
    return { [item.x]: `hsl(${hue}, 90%, 65%)` };
  });

  const legendData = data.map((item) => ({
    name: item.x,
    symbol: {
      fill: colors.find((color) => color[item.x])?.[item.x] || 'black',
    },
  }));

  return (
    <div className={styles.container}>
      <div className={styles.chart_box}>
        <VictoryPie
          colorScale={colors.map((item) => Object.values(item)[0])}
          data={data}
          innerRadius={200}
          labels={({ datum }) =>
            `${
              datum.x.slice(0, 1).toUpperCase() + datum.x.slice(1).toLowerCase()
            }: ${datum.y}%`
          }
          labelComponent={
            <VictoryTooltip
              style={{
                fill: 'white',
                fontSize: 28,
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

      <div className={styles.grid} style={{ width: '100%' }}>
        <div className={styles.legend_box}>
          {legendData.slice(0, (legendData.length + 1) / 2).map((item) => (
            <div className={styles.legend_row}>
              <div
                className={styles.legend_circle}
                style={{ backgroundColor: item.symbol.fill }}
              ></div>
              <div className={styles.legend_text}>
                <span>{item.name}</span>
                <span>90%</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.legend_box}>
          {legendData.slice((legendData.length + 1) / 2).map((item) => (
            <div className={styles.legend_row}>
              <div
                className={styles.legend_circle}
                style={{ backgroundColor: item.symbol.fill }}
              ></div>
              <div className={styles.legend_text}>
                <span>{item.name}</span>
                <span>90%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurgeryChart;
