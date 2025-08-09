import { VictoryPie, VictoryTooltip } from 'victory';
import { Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  box: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '16px',
    left: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
  },
  colorBox: {
    width: '12px',
    height: '12px',
    marginRight: '8px',
  },
  constrainedBox: {
    // width: '90%',
    // height: '100%',
    maxWidth: '400px',
  },
});

const LabTestSummary = () => {
  const classes = useStyles();

  const data = [
    { x: 'MRI Scan', y: 30 },
    { x: 'CT Scan', y: 25 },
    { x: 'Bone Scan', y: 20 },
    { x: 'Head MRI', y: 25 },
  ];

  const colorScale = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'];

  return (
    <Box className={classes.box}>
      <Box className={classes.legend}>
        {data.map((item, index) => (
          <div key={index} className={classes.legendItem}>
            <div
              className={classes.colorBox}
              style={{ backgroundColor: colorScale[index] }}
            ></div>
            <Typography variant="body2" fontWeight={'bold'}>
              {item.x}
            </Typography>
          </div>
        ))}
      </Box>
      <Box className={classes.constrainedBox}>
        <VictoryPie
          data={data}
          colorScale={colorScale}
          innerRadius={100}
          labels={({ datum }) => `${datum.y}%`}
          labelComponent={<VictoryTooltip />}
        />
      </Box>
    </Box>
  );
};

export default LabTestSummary;
