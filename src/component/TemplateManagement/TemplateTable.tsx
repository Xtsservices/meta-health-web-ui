import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

// Define the data type
interface Template {
  id: number;
  category: string;
  uploadedDate: string;
  fileURL: string;
}

// Styled TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1977F3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Styled TableRow
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Define props with TypeScript
interface TemplateTableProps {
  data: Template[];
  onDelete: (id: number) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = ({ data, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Sl. No</StyledTableCell>
            <StyledTableCell>Category</StyledTableCell>
            <StyledTableCell>Uploaded Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{row.category}</StyledTableCell>
              <StyledTableCell>
                {new Date(row.uploadedDate).toLocaleDateString()}
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconButton color="primary">
                  <a
                    href={row.fileURL}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    rel="noreferrer"
                  >
                    <VisibilityIcon />
                  </a>
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TemplateTable;
