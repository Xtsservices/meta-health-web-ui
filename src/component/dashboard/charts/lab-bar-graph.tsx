import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

interface Payment {
  day: string;
  amount: number;
  highlight?: boolean;
}

const LabBarGraph: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date('2024-03-03')
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date('2024-03-30'));

  const payments: Payment[] = [
    { day: 'M', amount: 150000 },
    { day: 'T', amount: 600000 },
    { day: 'W', amount: 100000 },
    { day: 'T', amount: 900000 },
    { day: 'F', amount: 650000 },
    { day: 'S', amount: 200000 },
    { day: 'Today', amount: 450000, highlight: true },
  ];

  const handleStartDateChange = (newValue: Date | null) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue: Date | null) => {
    setEndDate(newValue);
  };

  return (
    <Box>
      <VictoryChart domainPadding={20}>
        <VictoryAxis tickValues={payments.map((p) => p.day)} />
        <VictoryAxis dependentAxis tickFormat={(x) => `$${x / 1000}k`} />
        <VictoryBar
          data={payments}
          x="day"
          y="amount"
          style={{
            data: {
              fill: ({ datum }) => (datum.highlight ? 'orange' : '#3f51b5'),
            },
          }}
        />
      </VictoryChart>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} sx={{ marginBottom: 4 }}>
            <Grid item xs={6}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default LabBarGraph;
