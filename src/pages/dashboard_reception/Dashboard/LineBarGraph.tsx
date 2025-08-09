import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip, VictoryStack, } from 'victory';
import styles from './lineBarGraph.module.scss'

interface GraphData {
    x: string;
    y: number;
    fullForm?: string;
    total?: number; 
  }

interface LineBarGraphProps {
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  filterYear: string;
  setFilterYear: (value: string) => void;
  yearOptions: { value: string; name: string }[];
  monthOptions: { value: string; name: string }[];
  data: GraphData[];
  colors: string[];
  yParaText: string;
  xParaText?: string;
  mainHeading:string;
  }
  

const LineBarGraph: React.FC<LineBarGraphProps> = ({
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
  yearOptions,
  monthOptions,
  data,
  colors,
  yParaText,
  xParaText,
  mainHeading,
}) => {
  const [width, setWidth] = useState<number>(900);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.screen.width;
      if (screenWidth > 1150) {
        setWidth(600);
      } else {
        setWidth(700);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set width

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 

  const barWidth = filterMonth === 'month' ? 20 : 20;
 

  return (
    <div className={`${styles.containerGraphBoxHeader} ${xParaText  ? "" : styles.borderShadow }`}>
     <div className={styles.selectContainer}>
     <h1 className={styles.heading}>{mainHeading}</h1>
                <div className={styles.selectDropdown}>
                <select
                    name="filterYear"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterYear(e.target.value)}
                    value={filterYear}
                    className={styles.marginLeftAuto}
                >
                    {yearOptions.map((option) => (
                        <option key={option.value} value={option.value} >
                            {option.name}
                        </option>
                    ))}
                </select>
                <select
                    name="filterMonth"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterMonth(e.target.value)}
                    value={filterMonth}
                    className={styles.marginLeftAuto}
                >
                    {monthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.name}
                        </option>
                    ))}
                </select>
                </div>
            </div>
      <div className={ `${styles.graphContainer} ${xParaText ? "" : styles.graph_container}` }>
        <div className={styles.yAxisContainer}>
          <p className={styles.yAxisLabel} >{yParaText}</p>
        </div>
        <div className={styles.graphContent}>
          <VictoryChart domainPadding={{ x: 10 }} width={width} height={280}>
            <VictoryAxis
              style={{
                grid: { stroke: '#EBEBEB', strokeWidth: 1 },
                axis: { stroke: 'transparent' },
                tickLabels: { fontSize: 10, fill: '#C4C4C4' },
              }}
              dependentAxis
              tickFormat={() => ''}
            />
            <VictoryAxis
              tickFormat={data.map((item) => item.x)}
              style={{
                axis: { stroke: 'transparent' },
                tickLabels: { fontSize: 10, fill: 'black' },
              }}
            />
            <VictoryStack>
              {data.map((d) => (
                <VictoryBar
                  key={`${d.x}-filled`}
                  data={[{ x: d.x, y: d.y }]}
                  barWidth={barWidth}
                  style={{
                    data: {
                      fill: colors[0],
                      cursor: 'pointer',
                    },
                  }}
                  labels={({ datum }) => `${datum.x} : ${d.fullForm || datum.x} - ${datum.y} members`}
                  labelComponent={
                    <VictoryTooltip
                      style={{ fill: 'black' }}
                      flyoutStyle={{
                        stroke: 'transparent',
                        strokeWidth: 2,
                        backgroundColor: 'red',
                        fill: "#ebe6e6",
                      }}
                    />
                  }
                />
              ))}
              {data.map((d) => (
                <VictoryBar
                  key={`${d.x}-empty`}
                  data={[{ x: d.x, y: (d.total || 30) - d.y }]}
                  barWidth={barWidth}
                  style={{
                    data: {
                      fill: colors[1],
                      cursor: 'pointer',
                    },
                  }}
                />
              ))}
            </VictoryStack>
          </VictoryChart>
          {xParaText && <p className={styles.xPara}>{xParaText}</p>}
        </div>
      </div>
    </div>

  );
};

export default LineBarGraph;
