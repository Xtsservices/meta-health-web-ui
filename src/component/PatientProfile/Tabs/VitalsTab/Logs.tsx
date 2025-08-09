import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useVitalsStore } from "../../../../store/zustandstore";
import { vitalsType } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectCurrPatient, selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import AddedBy from "../../../DailogBoxs/AddedBy";
import { useLocation } from "react-router-dom";

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

function createData(value: string | number, timeStamp: number | string, userID: number|"") {
  // const newTime = String(new Date(timeStamp));
   
   
 

  return { value, timeStamp: timeStamp, userID };
}





type logsType = {
  category: keyof vitalsType;
  unit: string;
  vitals?: vitalsType[]; // Optional vitals prop for homecarepatient
  showID?: number | null;
};
type rowType = {
  value: string | number;
  timeStamp: number | string;
  userID: number | "";
};

export default function Logs({ category = "bp", unit, vitals, showID }: logsType) {
  const { vitals: storeVitals } = useVitalsStore();
  const [rows, setRows] = React.useState<rowType[]>([]);
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const [hoveredUserID, setHoveredUserID] = useState<number | null>(null);
  const [render, setRender] = React.useState<boolean>(false);
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");

  const getFilteredData = async () => {
    const hospitalID = isCustomerCare ? currentPatient.hospitalID : user.hospitalID;
    const response = await authFetch(
      `vitals/${hospitalID}/${timeline.patientID}/single?vital=${category}`,
      user.token
    );

    if (response.message == "success") {
      setRows(() => {
        if (response.vitals.length) {
          const timeVar: keyof vitalsType = (category + "Time") as keyof vitalsType;
          return response.vitals?.map((vital: vitalsType) => {
            if (category == "temperature" && vital.device) {
              return createData(
                vital[category] || "",
                Number(vital.deviceTime) * 1000,
                vital.userID || ""
              );  
            } else {
              return createData(vital[category] || "", String(vital[timeVar]), vital.userID || "");
            }
          });
        } else return [];
      });
    }
  };

  React.useEffect(() => {
    if (vitals?.length) {
      setRows(() => {
        if (vitals.length) {
          const timeVar: keyof vitalsType = (category + "Time") as keyof vitalsType;
          return vitals.map((vital) => {
            let value: string | number = "";
            if (category === "bp") {
              value = vital.bp || "";
            } else if (category === "temperature" && vital.device) {
              value = vital[category] || "";
              return createData(
                value,
                Number(vital.deviceTime) * 1000,
                vital.userID || ""
              );
            } else {
              value = vital[category] || "";
            }
            return createData(value, String(vital[timeVar] || vital.oxygenTime || vital.addedOn), vital.userID || "");
          }).filter(row => row.value !== "");
        } else return [];
      });
    } else {
      // Handle non-homecarepatient data
      if (storeVitals.length) {
        setRows(() => {
          if (storeVitals.length) {
            const timeVar: keyof vitalsType = (category + "Time") as keyof vitalsType;
            return storeVitals?.map((vital) => {
              if (category == "temperature" && vital.device) {
                return createData(
                  vital[category] || "",
                  Number(vital.deviceTime) * 1000,
                  vital.userID || ""
                );
              } else {
                return createData(vital[category] || "", String(vital[timeVar]), vital.userID || "");
              }
            });
          } else return [];
        });
      }
      if (storeVitals) {
        getFilteredData();
      }
    }
  }, [vitals, storeVitals, category]);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell
                width="25%"
                sx={{ fontSize: "16px", textAlign: "center", padding: "12px" }}
              >
                Readings ({unit})
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
                    {new Date(row.timeStamp).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(row.timeStamp).toLocaleDateString("en-GB", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      cursor: "pointer",
                      color: hoveredUserID === row.userID ? "blue" : "initial",
                      fontWeight: hoveredUserID === row.userID ? "bold" : "normal",
                    }}
                    onClick={() => {
                      setHoveredUserID(row.userID || null);
                      // setShowID(row.userID || 0);
                      setRender(!render);
                      setTimeout(() => {
                        setRender(true);
                      }, 100);
                    }}
                    align="center"
                  >
                    {(row.userID && currentPatient?.role !== "homecarepatient") ? row.userID : "From Device"}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

     {/* Added By Dialog */}
     {(showID !== 0 && (render)) && <AddedBy userID={showID}/>}

    </div>
  );
}

function compareDates(a: rowType, b: rowType) {
  return new Date(b.timeStamp).valueOf() - new Date(a.timeStamp).valueOf();
}
