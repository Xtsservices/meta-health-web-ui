import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { vitalsType } from "../../../../../types";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1977f3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type logsType = {
  category: keyof vitalsType;
  unit: string;
};
type rowType = {
  value: string | number;
  timeStamp: number | string;
  userID: number | "";
};

export default function Logs({ unit }: logsType) {
  const [, setDate] = React.useState("");
  const [rows] = React.useState<rowType[]>([]);

  const [, setShowID] = useState<number | null>(0);
  const [hoveredUserID, setHoveredUserID] = useState<number | null>(null);
  const [render, setRender] = React.useState<boolean>(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <input
        type="date"
        style={{
          alignSelf: "flex-end",
          padding: "0.2rem",
          borderRadius: "6px",
          border: "none",
          color: "#1977f3",
        }}
        onChange={(event) => setDate(event.target.value)}
      />
      <TableContainer component={Paper} sx={{borderTopLeftRadius:"15px",borderTopRightRadius:"15px"}}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell
                width="25%"
                sx={{ fontSize: "16px", textAlign: "center", padding: "12px" }}
              >
                Readings(°C & °F) ({unit})
              </StyledTableCell>
              <StyledTableCell
                width="25%"
                sx={{ fontSize: "16px", textAlign: "center", padding: "12px" }}
              >
                Time
              </StyledTableCell>
              <StyledTableCell
                width="25%"
                sx={{ fontSize: "16px", textAlign: "center", padding: "12px" }}
              >
                Date
              </StyledTableCell>
              <StyledTableCell
                width="25%"
                sx={{ fontSize: "16px", textAlign: "center", padding: "12px" }}
              >
                Added By
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((el) => el.value)
              .sort(compareDates)
              .map((row) => (
                <StyledTableRow key={row.timeStamp}>
                  <StyledTableCell component="th" scope="row" align="center">
                    {row.value}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {
                      new Date(row.timeStamp)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .split(",")[1]
                    }
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {
                      new Date(row.timeStamp)
                        .toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .split(",")[0]
                    }
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      cursor: "pointer",
                      color: hoveredUserID === row.userID ? "blue" : "initial",
                      fontWeight:
                        hoveredUserID === row.userID ? "bold" : "normal",
                    }}
                    onClick={() => {
                      setHoveredUserID(row.userID || null);
                      setShowID(row.userID || 0);
                      setRender(!render);
                      setTimeout(() => {
                        setRender(true);
                      }, 100);
                    }}
                    align="center"
                  >
                    {row.userID}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Added By Dialog */}
      {/* {(showID !== 0 && (render)) && <AddedBy userID={showID}/>} */}
    </div>
  );
}

function compareDates(a: rowType, b: rowType) {
  return new Date(b.timeStamp).valueOf() - new Date(a.timeStamp).valueOf();
}
