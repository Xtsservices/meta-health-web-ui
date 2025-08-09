import React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";

interface AlertType {
  id: number;
  patientName: string;
  alertMessage: string;
  alertValue: string;
  ward: string;
  datetime: string;
  addedOn: string | undefined;
  seen: number;
  patientID: number;
  hospitalID:number;
  state?: string;
  city?: string;
  nurseName?: string;
}

interface Data {
  slno: number;
  id: number;
  patientName: string;
  alertMessage: string;
  alertValue: string;
  ward: string;
  datetime: string;
  addedOn: string | undefined;
  action: string;
  view: string;
  patientID: number;
  state?: string;
  city?: string;
  nurseName?: string;
  hospitalID:number;
}

function createData(
  slno: number,
  id: number,
  patientName: string,
  alertMessage: string,
  alertValue: string,
  ward: string,
  datetime: string,
  action: string,
  view: string,
  patientID: number,
  hospitalID:number,
  state?: string,
  city?: string,
  nurseName?: string,
  addedOn?: string,

): Data {
  return {
    slno,
    id,
    patientName,
    alertMessage,
    alertValue,
    ward,
    datetime,
    action,
    view,
    patientID,
    hospitalID,
    state,
    city,
    nurseName,
    addedOn,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
}

const getHeadCells = (isCustomerCare: boolean, name: string | undefined): HeadCell[] => {
  const isIndividual = name === "Individual";

  const baseCells: HeadCell[] = [
    { id: "slno", label: "Sl.No" },
    ...(isIndividual ? [] : [{ id: 'id', label: 'ID' } as HeadCell]),
    { id: "patientName", label: "Patient Name" },
    { id: "alertMessage", label: "Alert Message" },
    { id: "alertValue", label: "Alert Value" },
    ...(isIndividual ? [] : [{ id: "ward", label: "Ward" } as HeadCell]),
    { id: "datetime", label: "Date & Time" },
    { id: "action", label: "Action" },
    { id: "view", label: "" },
  ];

  if (isCustomerCare) {
    return [
      ...baseCells.slice(0, isIndividual ? 5 : 6),
      ...(isIndividual ? [] : [{ id: "hospitalID", label: "Hospital Name/ID" } as HeadCell]),
      ...baseCells.slice(isIndividual ? 5 : 6),
    ];
  }

  return baseCells;
};

interface EnhancedTableHeadProps {
  isCustomerCare: boolean;
  name: string | undefined;
}

function EnhancedTableHead({ isCustomerCare, name }: EnhancedTableHeadProps) {
  const headCells = getHeadCells(isCustomerCare, name);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left">
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface PriorityTableProps {
  rows: Data[];
  title: string;
  borderColor: string;
  handleIsSeen: (id: number) => void;
  isCustomerCare: boolean;
  name: string | undefined;
}

const PriorityTable: React.FC<PriorityTableProps> = ({
  rows,
  title,
  borderColor,
  handleIsSeen,
  isCustomerCare,
  name,
}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const navigate = useNavigate();
    const location = useLocation();
    const isNursePath = location.pathname.includes("nurse");

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (patientID: number) => {
        if (isNursePath) {
            // Navigate to nurse/patientsList/{patientID} with vitals tab
            navigate(`/nurse/patientsList/${patientID}?tab=vitals`, {
                state: { activeTab: 2 }  // Pass active tab as state
            });
        } else if (isCustomerCare) {
            // Navigate to customerCare/patient/{patientID} with name in state
            navigate(`/customerCare/alerts/patient/${patientID}`, {
                state: { name: name }
            });
        } else {
            // Default navigation for other paths
            navigate(`${patientID}`);
        }
    };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <h3>{title}</h3>
          <Table
            style={{ borderLeft: `3px solid ${borderColor}`, tableLayout: "auto" }}
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead isCustomerCare={isCustomerCare} name={name} />
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.slno}</TableCell>
                  {name !== "Individual" && <TableCell align="left">{row.patientID}</TableCell>}
                  <TableCell align="left">{row.patientName}</TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "300px",
                      display: "table-cell",
                    }}
                  >
                    {row.alertMessage}
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                    }}
                    align="left"
                  >
                    {row.alertValue}
                  </TableCell>
                  {name !== "Individual" && <TableCell align="left">{row.ward}</TableCell>}
                  {isCustomerCare && (
                    <>
                      {name !== "Individual" && (
                        <TableCell align="left">{row.hospitalID || "N/A"}</TableCell>
                      )}
                    </>
                  )}
                  <TableCell align="left">{name === "Individual" ? row.addedOn : row.datetime || "N/A"}</TableCell>
                  <TableCell align="left">
                  <Button
                        variant="contained"
                        onClick={() => handleViewDetails(row.patientID)}
                    >
                        View Patient
                    </Button>                  
                </TableCell>
                  <TableCell align="left">
                    <Tooltip title="View Details">
                      <IconButton
                        aria-label="view"
                        color="primary"
                        onClick={() => handleIsSeen(row.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={getHeadCells(isCustomerCare, name).length}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

interface AllAlertsProps {
  HighPriorityData: AlertType[];
  MediumPriorityData: AlertType[];
  LowPriorityData: AlertType[];
  handleIsSeen: (id: number) => void;
  name: string | undefined;
}

const AllAlerts: React.FC<AllAlertsProps> = ({
  HighPriorityData,
  MediumPriorityData,
  LowPriorityData,
  handleIsSeen,
  name,
}) => {
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");

  const formatDatetime = (datetime: string | undefined) => {
    if (!datetime) return "N/A";
    try {
      if (datetime.includes(",")) return datetime;
      const dateObj = new Date(datetime);
      
      if (isNaN(dateObj.getTime())) return datetime;
      
      // Subtract 5 hours and 30 minutes (convert to IST to UTC)
      const offsetMs = (5 * 60 + 30) * 60 * 1000; // 5 hours 30 minutes in milliseconds
      const adjustedDate = new Date(dateObj.getTime() - offsetMs);
      
      return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(adjustedDate);
    } catch (error) {
      console.error("Error formatting datetime:", error);
      return datetime;
    }
  };

  const createRowData = (alert: AlertType, index: number) => {
    return createData(
      index + 1,
      alert.id,
      alert.patientName,
      alert.alertMessage,
      alert.alertValue,
      alert.ward,
      formatDatetime(alert.datetime),
      "ViewDetails",
      "view",
      alert.patientID,
      alert.hospitalID,
      alert.state,
      alert.city,
      alert.nurseName,
      alert.addedOn
    );
  };

  const filterRows = (alerts: AlertType[]) => {
    return alerts
      .filter((alert) => alert.seen === 0)
      .map(createRowData);
  };

  const highPriorityRows = filterRows(HighPriorityData);
  const mediumPriorityRows = filterRows(MediumPriorityData);
  const lowPriorityRows = filterRows(LowPriorityData);

  return (
    <div>
      <PriorityTable
        rows={highPriorityRows}
        handleIsSeen={handleIsSeen}
        title="High Priority"
        borderColor="red"
        isCustomerCare={isCustomerCare}
        name={name}
      />
      <PriorityTable
        rows={mediumPriorityRows}
        handleIsSeen={handleIsSeen}
        title="Medium Priority"
        borderColor="#ffd60a"
        isCustomerCare={isCustomerCare}
        name={name}
      />
      <PriorityTable
        rows={lowPriorityRows}
        handleIsSeen={handleIsSeen}
        title="Low Priority"
        borderColor="green"
        isCustomerCare={isCustomerCare}
        name={name}
      />
    </div>
  );
};

export default AllAlerts;