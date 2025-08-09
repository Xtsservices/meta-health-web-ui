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
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { styled } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSeachStore } from "../../../store/zustandstore";
import { CustomerCareUser } from "../../../utility/formTypes";
import CustomerCareForm from "../../hospital_sadmin/customerCare/CustomerCareForm";
import { useDispatch, useSelector } from "react-redux/es/exports"; // Import useDispatch and useSelector
import { selectCurrentUser } from "../../../store/user/user.selector"; // Import selectCurrentUser
import { setError, setSuccess, setLoading } from "../../../store/error/error.action"; // Import error actions
import { authPatch } from "../../../axios/usePatch";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Menu, MenuItem, Switch } from "@mui/material";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
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
    <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        size="large"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        size="large"
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
        size="large"
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
        size="large"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface CustomerCareTableProps {
  data: CustomerCareUser[];
  onSuccess?: () => void;
}

export default function CustomerCareTable({ data, onSuccess }: CustomerCareTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { searchText } = useSeachStore();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<CustomerCareUser | null>(null);
  const [dialogMode, setDialogMode] = React.useState<"edit" | "view">("edit");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // State for menu anchor
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

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

  const handleEditClick = (user: CustomerCareUser) => {
    console.log("Edit clicked for user:", user);
    setSelectedUser(user);
    setDialogMode("edit");
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleViewClick = (user: CustomerCareUser) => {
    console.log("View clicked for user:", user);
    setSelectedUser(user);
    setDialogMode("view");
    setOpenDialog(true);
    setAnchorEl(null);
  };

    const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    userId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleToggleStatus = async (userId: number, isDeactivated: number) => {
    dispatch(setLoading(true));
    try {
      const endpoint = isDeactivated === 0 
        ? `user/deactivate/${userId}` 
        : `user/reactivate/${userId}`;
      const response = await authPatch(endpoint, null, user.token);
      
      if (response.message === "success") {
        dispatch(setSuccess(`User ${isDeactivated === 0 ? 'deactivated' : 'reactivated'} successfully`));
        if (onSuccess) {
          onSuccess(); // Trigger parent refresh or callback
        }
      } else {
        dispatch(setError(response.message || `Failed to ${isDeactivated === 0 ? 'deactivate' : 'reactivate'} user`));
      }
    } catch (error) {
      console.error(`Error ${isDeactivated === 0 ? 'deactivating' : 'reactivating'} user:`, error);
      dispatch(setError(`Failed to ${isDeactivated === 0 ? 'deactivate' : 'reactivate'} user`));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Filter and sort data
  const filteredData = data
    .filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (user.phoneNo &&
          String(user.phoneNo).toLowerCase().includes(searchText.toLowerCase())) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.multiState.join(", ").toLowerCase().includes(searchText.toLowerCase()) ||
        user.multiDist.join(", ").toLowerCase().includes(searchText.toLowerCase()) ||
        user.multiCity.join(", ").toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => b.id - a.id);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  // Debug: Log state changes
  React.useEffect(() => {
    console.log("CustomerCareTable state:", { openDialog, selectedUser, dialogMode });
  }, [openDialog, selectedUser, dialogMode]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ color: "grey" }}>ID</StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="center">
                Customer Care Executive Name
              </StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="left">
                Phone Number
              </StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="left">
                Email
              </StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="left">
                State
              </StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="left">
                District
              </StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="left">
                City
              </StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="center">
                Status
              </StyledTableCell>
              <StyledTableCell sx={{ color: "grey" }} align="center">
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((user) => (
              <StyledTableRow key={user.id}>
                <StyledTableCell component="th" scope="row">
                  {user.id}
                </StyledTableCell>
                <StyledTableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt=""
                      style={{
                        height: "2.5rem",
                        width: "2.5rem",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  ) : (
                    <AccountCircleIcon
                      sx={{
                        height: "2.8rem",
                        width: "2.8rem",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}
                  {`${user.firstName} ${user.lastName}`}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {user.countryCode ? `${user.countryCode} ${user.phoneNo}` : user.phoneNo}
                </StyledTableCell>
                <StyledTableCell align="left">{user.email}</StyledTableCell>
                <StyledTableCell align="left">
                  {user?.multiState?.join(", ") || "None"}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {user?.multiDist?.join(", ") || "None"}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {user?.multiCity?.join(", ") || "None"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Switch
                    checked={user.isDeactivated === 0}
                    onChange={() => handleToggleStatus(user.id, user.isDeactivated)}
                    color="primary"
                    inputProps={{ 'aria-label': 'toggle user status' }}
                  />
                  {user.isDeactivated === 0 ? 'Active' : 'Inactive'}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    aria-label="more"
                    aria-controls={`action-menu-${user.id}`}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, user.id)}
                  >
                    <BiDotsVerticalRounded />
                  </IconButton>
                  <Menu
                    id={`action-menu-${user.id}`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedUserId === user.id}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        maxHeight: 48 * 4.5,
                        width: "20ch",
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleViewClick(user)}>View</MenuItem>
                    <MenuItem onClick={() => handleEditClick(user)}>Edit</MenuItem>
                  </Menu>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={9} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={9} sx={{ p: 0 }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  sx={{
                    ".MuiTablePagination-selectLabel": {
                      mt: 1.5,
                      mb: 0,
                    },
                    ".MuiTablePagination-displayedRows": {
                      mt: 1.5,
                      mb: 0,
                    },
                    ".MuiTablePagination-select": {
                      mt: 0.5,
                      mb: 0.5,
                    },
                    ".MuiTablePagination-toolbar": {
                      minHeight: "56px",
                    },
                  }}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {openDialog && selectedUser && (
        <CustomerCareForm
          open={openDialog}
          setOpen={setOpenDialog}
          type="customercare"
          mode={dialogMode}
          userData={selectedUser}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}