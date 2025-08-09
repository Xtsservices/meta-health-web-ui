import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import styles from "./AddStaff.module.scss";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { styled } from "@mui/material/styles";
import PopperMenu from "./PopperMenu";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectAllStaff } from "../../../store/staff/staff.selector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { departmentType } from "../../../types";
import { Role_list, Role_list_Type } from "../../../utility/role";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSeachStore } from "../../../store/zustandstore";
// import styles from "./AddStaff.module.scss";
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
type MenuDropDownType = {
  id: number;
};

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

const MenuDropDown = ({ id }: MenuDropDownType) => {
  return (
    <>
      <StyledTableCell align="right">
        <div>
          <PopperMenu id={id} />
        </div>
      </StyledTableCell>
    </>
  );
};
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    // color: theme.palette.common.,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
interface rowType {
  serialNo: number;
  staffName: string;
  staffImage: string;
  role: string;
  phoneNumber: number | "No data";
  homeAddress: string | "No data";
  department: string;
  userId: string;
}
function createData(
  serialNo: number,
  staffName: string,
  staffImage: string,
  role: string,
  phoneNumber: number | "No data",
  homeAddress: string | "No data",
  department: string,
  userId: string
) {
  return {
    serialNo,
    staffName,
    staffImage,
    role,
    phoneNumber,
    homeAddress,
    department,
    userId,
  };
}
type customPaginationType = {
  filterDepartment: number;
};
export default function CustomPaginationActionsTable({
  filterDepartment,
}: customPaginationType) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const user = useSelector(selectCurrentUser);
  const [departmentList, setDepartmentList] = React.useState<departmentType[]>(
    []
  );
  const [rows, setRows] = React.useState<rowType[]>([]);
  const { searchText } = useSeachStore();
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };
  const staffList = useSelector(selectAllStaff);
  

  React.useEffect(() => {
    const getDepartments = async () => {
      const response = await authFetch(
        `department/${user.hospitalID}`,
        user.token
      );
      if (response.message == "success") {
        // console.log("doc-------------",response)
        setDepartmentList(() => {
          return [...response.departments];
        });
      }
    };
    getDepartments();
  }, [user]);
  React.useEffect(() => {
    if (departmentList.length)
      setRows(
        staffList
          .filter((el) => {
            if (filterDepartment == 0) {
              return el;
            } else {
              return el.departmentID == filterDepartment;
            }
          })
          .map((el) => {
            const roleKey: keyof Role_list_Type =
              el.role as keyof Role_list_Type;
            const role = Role_list[roleKey] || "No data";
            const department = departmentList.filter(
              (department) => department.id == el.departmentID
            )[0]?.name;
            return createData(
              el.id,
              el.firstName || "",
              el.imageURL || "",
              role,
              el.phoneNo || "No data",
              el.address || "",
              department,
              el.email
            );
          })
      );
  }, [departmentList, staffList, filterDepartment]);
  //////////////////sorting algorithm///////////////////////////
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [sortColumn, setSortColumn] = React.useState("");
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      // If the same column is clicked, toggle the sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, set the new column and default sorting order
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Sort the rows array based on the selected column and sorting order
  const sortedRows = [...rows].sort((a, b) => {
    const aValue = (a[sortColumn as keyof rowType] || "") as string; // Provide a fallback value if undefined
    const bValue = (b[sortColumn as keyof rowType] || "") as string;
    (""); // Provide a fallback value if undefined

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  console.log("staffList",staffList)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ color: "grey" }}>ID</StyledTableCell>
            <StyledTableCell sx={{ color: "grey" }} align="center">
              Staff Name
              <IconButton
                onClick={() => handleSort("staffName")}
                size="small"
                color={sortColumn === "staffName" ? "primary" : "default"}
              >
                {sortColumn === "staffName" && sortOrder === "asc" ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </IconButton>
            </StyledTableCell>
            <StyledTableCell sx={{ color: "grey" }} align="center">
              Role
            </StyledTableCell>
            <StyledTableCell sx={{ color: "grey" }} align="left">
              Phone Number
            </StyledTableCell>
            <StyledTableCell sx={{ color: "grey" }} align="left">
              Home Address
            </StyledTableCell>
            <StyledTableCell sx={{ color: "grey" }} align="center">
              Department
            </StyledTableCell>
            <StyledTableCell sx={{ color: "grey" }} align="left">
              User Email
            </StyledTableCell>
            <StyledTableCell
              sx={{ color: "grey" }}
              align="center"
            ></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? sortedRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : sortedRows
          )
            .filter((row) =>
              row.staffName.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((row) => (
              <StyledTableRow key={row.serialNo}>
                <StyledTableCell component="th" scope="row">
                  {row.serialNo}
                </StyledTableCell>
                <StyledTableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {/* {row.photo} */}
                  {row.staffImage && (
                    <img
                      src={row.staffImage}
                      alt=""
                      style={{
                        height: "2.5rem",
                        width: "2.5rem",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}
                  {!row.staffImage && (
                    <AccountCircleIcon
                      sx={{
                        height: "2.8rem",
                        width: "2.8rem",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}

                  {row.staffName}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <div className={styles.table_highlight + " " + styles.blue}>
                    {row.role.slice(0, 1).toUpperCase() +
                      row.role.slice(1).toLowerCase()}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.phoneNumber}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.homeAddress || "--------"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.department  ? <div className={styles.table_highlight + " " + styles.orange}>
                    {row.department && row.department
                      .split(" ")
                      .map(
                        (el) =>
                          el.slice(0, 1).toUpperCase() +
                          el.slice(1).toLowerCase() +
                          " "
                      )}
                  </div>:""}
                </StyledTableCell>
                <StyledTableCell align="left">{row.userId}</StyledTableCell>

                <MenuDropDown id={row.serialNo} />

              </StyledTableRow>
            ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              {" "}
              {/* Adjust the colSpan based on the number of columns in your table */}
              <Box display="flex" justifyContent="flex-end">
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
