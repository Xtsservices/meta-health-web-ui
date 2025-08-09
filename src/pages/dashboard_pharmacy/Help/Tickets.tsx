import React, { useState } from "react";
import styles from "./tickets.module.scss";
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
import { TicketType } from "../../../types";
import { priorityDict, statusDict } from "../../../utility/role";
import { formatDate2 } from "../../../utility/global";

const TicketStaff: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [allRows, setAllRows] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [ticketData] = React.useState<TicketType[]>([]);

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
                  Priority
                </TableCell>
                <TableCell sx={{ color: "grey", fontSize: "16px" }}>
                  Status
                </TableCell>
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
                          ticket.priority === 0
                            ? styles.priority_low
                            : ticket.priority === 1
                            ? styles.priority_medium
                            : styles.priority_high
                        }
                      >
                        {priorityDict[ticket.priority]}
                      </div>
                    </TableCell>
                    <TableCell>{statusDict[ticket.status]}</TableCell>
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
