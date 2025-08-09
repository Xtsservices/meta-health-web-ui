import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useVitalsStore } from '../../../../../../store/zustandstore';
import { vitalsType } from '../../../../../../types';
// import { display } from "@mui/system";
import { authFetch } from '../../../../../../axios/useAuthFetch';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../../../../store/user/user.selector';
import {
  // selectCurrPatient,
  selectTimeline,
} from '../../../../../../store/currentPatient/currentPatient.selector';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1977f3',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(value: string | number, timeStamp: number | string) {
  const newTime = String(new Date(timeStamp));
  return { value, timeStamp: newTime };
}

type logsType = {
  category: keyof vitalsType;
  unit: string;
};
type rowType = {
  value: string | number;
  timeStamp: number | string;
};
export default function Logs({ category = 'bp', unit }: logsType) {
  const { vitals } = useVitalsStore();
  const [date, setDate] = React.useState('');
  const [rows, setRows] = React.useState<rowType[]>([]);
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const getFilteredData = async () => {
    // console.log(date);
    const response = await authFetch(
      `vitals/${user.hospitalID}/${timeline.patientID}/single?vital=${category}&date=${date}`,
      user.token
    );
    // console.log("response for single vital data", response);
    if (response.message == 'success') {
      setRows(() => {
        if (response.vitals.length) {
          const timeVar: keyof vitalsType = (category +
            'Time') as keyof vitalsType;
          return response.vitals?.map((vital: vitalsType) => {
            // console.log(Number(vital.deviceTime) * 1000);
            if (category == 'temperature' && vital.device) {
              return createData(
                vital[category] || '',
                Number(vital.deviceTime) * 1000
              );
            } else {
              return createData(vital[category] || '', String(vital[timeVar]));
            }
          });
        } else return [];
      });
    }
  };
  React.useEffect(() => {
    if (vitals.length && !date) {
      setRows(() => {
        if (vitals.length) {
          const timeVar: keyof vitalsType = (category +
            'Time') as keyof vitalsType;
          return vitals?.map((vital) => {
            // console.log(Number(vital.deviceTime) * 1000);
            if (category == 'temperature' && vital.device) {
              return createData(
                vital[category] || '',
                Number(vital.deviceTime) * 1000
              );
            } else {
              return createData(vital[category] || '', String(vital[timeVar]));
            }
          });
        } else return [];
      });
    }
    if (date) {
      getFilteredData();
    }
  }, [vitals, date]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
      <input
        type="date"
        style={{
          alignSelf: 'flex-end',
          padding: '0.2rem',
          borderRadius: '6px',
          border: 'none',
          color: '#1977f3',
          // border: "1px solid black",
        }}
        onChange={(event) => setDate(event.target.value)}
      />
      <TableContainer component={Paper} sx={{borderTopLeftRadius:"15px",borderTopRightRadius:"15px"}}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell
                width="33%"
                sx={{ fontSize: '16px', textAlign: 'center', padding: '12px' }}
              >
                Readings(°C & °F) ({unit})
              </StyledTableCell>
              <StyledTableCell
                width="33%"
                sx={{ fontSize: '16px', textAlign: 'center', padding: '12px' }}
              >
                Time
              </StyledTableCell>
              <StyledTableCell
                width="33%"
                sx={{ fontSize: '16px', textAlign: 'center', padding: '12px' }}
              >
                Date
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((el) => (el.value ? true : false))
              .sort(compareDates)
              .map((row) => (
                <StyledTableRow key={row.timeStamp}>
                  <StyledTableCell component="th" scope="row" align="center">
                    {row.value}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {
                      new Date(row.timeStamp)
                        .toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                        .split(',')[1]
                    }
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {
                      new Date(row.timeStamp)
                        .toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                        .split(',')[0]
                    }
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function compareDates(a: rowType, b: rowType) {
  return new Date(b.timeStamp).valueOf() - new Date(a.timeStamp).valueOf();
}
