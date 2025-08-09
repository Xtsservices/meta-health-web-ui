import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { formatDate2, capitalizeFirstLetter } from "./../../../utility/global";
import { priorityDict, statusDict } from "../../../utility/role";
import { TicketType } from "../../../types";
import styles from "./Ticket.module.scss";
interface TicketListProps {
  tickets: TicketType[] | null;
  page: number;
  rowsPerPage: number;
}

const TicketTable: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [filteredData, setFilteredData] = useState<TicketType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ticketsListData, setTicketsListData] = useState<TicketListProps>({
    tickets: null,
    page: 0,
    rowsPerPage: 5,
  });
  const user = useSelector(selectCurrentUser);

  // const [ticketData, setTicketData] = React.useState<Ticket[]>([]);

  // const getAllData = async () => {
  //   const res = await authFetch(
  //     `ticket/hospital/${user.hospitalID}`,
  //     user.token
  //   );
  //   console.log("responseee", res);
  //   if (res.message == "success") {
  //     setTicketData(res.tickets);
  //   }
  // };
  // React.useEffect(() => {
  //   getAllData();
  // }, [user]);
  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        const response = await authFetch(`ticket`, user.token);
        console.log("res from ticket", response);

        if (response && response.message === "success" && response.tickets) {
          setTicketsListData({
            tickets: response.tickets,
            page: 0,
            rowsPerPage: ticketsListData.rowsPerPage,
          });
          setFilteredData(response.tickets || []);
        } else {
          console.error("Invalid API response:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user.token) {
      fetchTicketsData();
    }
  }, [user.token, id, ticketsListData.rowsPerPage]);

  // const mapPriority = (priorityValue: any) => {
  //   const priorityLabels = ["Low", "Medium", "High"];
  //   return priorityLabels[priorityValue] || "";
  // };

  // const mapStatus = (statusValue: any) => {
  //   const statusLabels = ["Open", "Paused", "Closed"];
  //   return statusLabels[statusValue] || "";
  // };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);

    const rowsPerPageOptions = [
      5,
      10,
      25,
      { label: "All", value: filteredData.length },
    ];
    const validRowsPerPage = rowsPerPageOptions.includes(value) ? value : 5;

    const allRows = validRowsPerPage === -1;
    setTicketsListData((prevState) => ({
      ...prevState,
      rowsPerPage: allRows ? prevState.tickets?.length || 0 : validRowsPerPage,
      page: 0,
    }));
  };

  const handleRowClick = (ticketId: number) => {
    navigate(`/sadmin/tickets/${ticketId}`);
  };

  const rowsPerPageOptions = [
    5,
    10,
    25,
    { label: "All", value: filteredData.length || 5 },
  ];

  const startIndex = ticketsListData.page * ticketsListData.rowsPerPage;
  const endIndex = startIndex + ticketsListData.rowsPerPage;

  useEffect(() => {
    let filteredTickets: TicketType[] = [];
    if (statusFilter === "all") {
      filteredTickets = ticketsListData.tickets || [];
    } else {
      filteredTickets = (ticketsListData.tickets || []).filter(
        (ticket) => statusDict[ticket.status] === statusFilter
      );
    }
    setFilteredData(filteredTickets);
  }, [statusFilter, ticketsListData.tickets]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <FormControl>
          <Select
            sx={{ height: "40px", padding: "10px", borderRadius: "20px" }}
            value={statusFilter}
            onChange={(event: SelectChangeEvent<string>) =>
              setStatusFilter(event.target.value)
            }
          >
            <MenuItem value="all">All Tickets</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Paused">Paused</MenuItem>
          </Select>
          <br />
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ height: "65px" }}>
              <TableCell>
                <b>Sr.No</b>
              </TableCell>
              <TableCell>
                <b>Hospital Name</b>
              </TableCell>
              <TableCell>
                <b>Assigned to</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Priority</b>
              </TableCell>
              <TableCell>
                <b>Due By</b>
              </TableCell>
              <TableCell>
                <b>Type</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(startIndex, endIndex).map((ticket, index) => (
              <TableRow
                key={ticket.id}
                style={{ cursor: "pointer", height: "65px" }}
                onClick={() => handleRowClick(ticket.id)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {capitalizeFirstLetter(ticket.hospitalName)}
                </TableCell>
                <TableCell>
                  {ticket.assignedName
                    ? capitalizeFirstLetter(ticket.assignedName)
                    : "Not assigned"}
                </TableCell>
                <TableCell>{statusDict[ticket.status]}</TableCell>
                <TableCell>
                  {" "}
                  <div
                    className={
                      ticket.priority == 0
                        ? styles.priority_low
                        : ticket.priority == 1
                        ? styles.priority_medium
                        : styles.priority_high
                    }
                  >
                    {priorityDict[ticket.priority]}
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.dueDate
                    ? formatDate2(ticket.dueDate)
                    : "Not assigned"}
                </TableCell>
                <TableCell>{capitalizeFirstLetter(ticket.type)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={ticketsListData.rowsPerPage}
        page={ticketsListData.page}
        onPageChange={(_, newPage) =>
          setTicketsListData((prevState) => ({ ...prevState, page: newPage }))
        }
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default TicketTable;
