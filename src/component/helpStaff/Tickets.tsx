import React, { useState } from "react";
import styles from "./Tickets.module.scss";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import { authFetch } from "../../../axios/useAuthFetch";
import { authFetch } from "../../axios/useAuthFetch";
import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../../../store/user/user.selector";
import { selectCurrentUser } from "../../store/user/user.selector";
// import {  statusDict } from "../../utility/role";
// import { TicketType } from "../../../types";
import { TicketType } from "../../types";
import { formatDate2 } from "../../utility/global";
// import { statusDictType, priorityDictType, TicketType } from "../../../types";

const TicketStaff: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [allRows, setAllRows] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const user = useSelector(selectCurrentUser);
  // const getAllTickets = async () => {
  //   const res = await authFetch(
  //     `ticket/hospital/${user.hospitalID}`,
  //     user.token
  //   );
  //   console.log("all tickets", res);
  // };
  // React.useEffect(() => {
  //   if (user.token) getAllTickets();
  // }, [user]);

  const [ticketData, setTicketData] = React.useState<TicketType[]>([]);

  const getAllData = async () => {
    const res = await authFetch(
      `ticket/hospital/${user.hospitalID}/getAllTickets/${user.id}`,
      user.token
    );
    if (res.message == "success") {
      setTicketData(res.tickets);
    }
  };
  React.useEffect(() => {
    getAllData();
  }, [user]);

  // const ticketData: Ticket[] = [
  //   {
  //     id: 1,
  //     priority: "High",
  //     hospitalName: "Hospital A",
  //     status: "Open",
  //     dueBy: "2023-09-30",
  //     type: "Emergency",
  //     assignedTo: "Test22",
  //   },
  //   {
  //     id: 2,
  //     priority: "Medium",
  //     hospitalName: "Hospital B",
  //     status: "Closed",
  //     dueBy: "2023-10-15",
  //     type: "Inpatient",
  //     assignedTo: "Sid",
  //   },
  //   {
  //     id: 3,
  //     priority: "Low",
  //     hospitalName: "Hospital C",
  //     status: "Paused",
  //     dueBy: "2023-11-05",
  //     type: "Inpatient",
  //     assignedTo: "Test25",
  //   },
  //   {
  //     id: 4,
  //     priority: "High",
  //     hospitalName: "Hospital D",
  //     status: "Assigned",
  //     dueBy: "2023-10-25",
  //     type: "OPD",
  //     assignedTo: "Test",
  //   },
  //   {
  //     id: 5,
  //     priority: "Medium",
  //     hospitalName: "Hospital E",
  //     status: "Unassigned",
  //     dueBy: "2023-11-10",
  //     type: "OPD",
  //     assignedTo: "Test",
  //   },
  //   {
  //     id: 6,
  //     priority: "High",
  //     hospitalName: "Hospital A",
  //     status: "Open",
  //     dueBy: "2023-09-30",
  //     type: "Emergency",
  //     assignedTo: "Test22",
  //   },
  //   {
  //     id: 7,
  //     priority: "Medium",
  //     hospitalName: "Hospital B",
  //     status: "Closed",
  //     dueBy: "2023-10-15",
  //     type: "Inpatient",
  //     assignedTo: "Sid",
  //   },
  //   {
  //     id: 8,
  //     priority: "Low",
  //     hospitalName: "Hospital C",
  //     status: "Paused",
  //     dueBy: "2023-11-05",
  //     type: "Inpatient",
  //     assignedTo: "Test25",
  //   },
  //   {
  //     id: 9,
  //     priority: "High",
  //     hospitalName: "Hospital D",
  //     status: "Assigned",
  //     dueBy: "2023-10-25",
  //     type: "OPD",
  //     assignedTo: "Test",
  //   },
  // ];

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    if (value === -1) {
      setAllRows(true);
      setRowsPerPage(ticketData.length);
    } else {
      setAllRows(false);
      setRowsPerPage(value);
      setPage(0);
    }
  };

  const handleRowClick = (ticketId: number) => {
    navigate(`${ticketId}`);
  };

  const handleCreateNewTicketClick = () => {
    navigate("new-ticket");
  };

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ marginRight: "10px" }}>
          <IconButton onClick={() => navigate("..")}>
            <ArrowBackIosIcon />
          </IconButton>
        </h3>
        <h2 style={{ flex: "1", justifyContent: "center" }}>Tickets</h2>
      </div>
      <div className={styles.container_table}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <FormControl>
            <Button
              sx={{ borderRadius: "18px" }}
              variant="contained"
              onClick={handleCreateNewTicketClick}
            >
              Create New Ticket
            </Button>
          </FormControl>
        </div>
        <TableContainer
          component={Paper}
          //   style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" ,}}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ height: "80px" }}>
                <TableCell sx={{ color: "grey", fontSize: "16px" }}>
                  Ticket ID
                </TableCell>
                <TableCell sx={{ color: "grey", fontSize: "16px" }}>
                  Ticket Status
                </TableCell>
                {/* <TableCell sx={{ color: "grey", fontSize: "16px" }}>
                  Status
                </TableCell> */}
                <TableCell sx={{ color: "grey", fontSize: "16px" }}>
                  Due By
                </TableCell>
                <TableCell sx={{ color: "grey", fontSize: "16px" }}>
                  Type
                </TableCell>
                <TableCell sx={{ color: "grey", fontSize: "16px" }}>
                  Assigned To
                </TableCell>
                <TableCell sx={{ color: "grey", fontSize: "16px" }}>
        Module
      </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ticketData
                .slice(startIndex, allRows ? ticketData.length : endIndex)
                .map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    style={{
                      cursor: "pointer",
                      height: "80px",
                      backgroundColor:
                        ticket.id % 2 === 0 ? "#ffffff" : "whitesmoke",
                    }}
                    onClick={() => handleRowClick(ticket.id)}
                  >
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>
                      <div
                        className={
                          ticket.priority == 0
                            ? styles.priority_low
                            : ticket.priority == 1
                            ? styles.priority_medium
                            : styles.priority_high
                        }
                      >
                        {"Pending.."}
                        {/* {priorityDict[ticket.priority]} */}
                      </div>
                    </TableCell>
                    {/* <TableCell>{statusDict[ticket.status]}</TableCell> */}
                    <TableCell>
                      {ticket.dueDate
                        ? formatDate2(ticket.dueDate)
                        : "Not assigned"}
                    </TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>
                      {ticket.assignedName?.[0].toUpperCase() +
                        ticket.assignedName?.slice(1) || "Not assigned yet"}
                    </TableCell>
                    <TableCell>{ticket?.module}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          component="div"
          count={ticketData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default TicketStaff;
