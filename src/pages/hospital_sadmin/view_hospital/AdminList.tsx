import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import TablePagination from "@mui/material/TablePagination";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { formatDate2, capitalizeFirstLetter } from "./../../../utility/global";

interface AdminList {
  id: number;
  firstName: string;
  lastName: string;
  phoneNo: number;
  address: string;
  email: string;
  addedOn: string;
}

interface AdminListProps {
  admins: AdminList[] | null;
  page: number;
  rowsPerPage: number;
}

const initialState: AdminListProps = {
  admins: null,
  page: 0,
  rowsPerPage: 5,
};
export const AdminList = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [allRows] = useState(false);
  const [adminListData, setAdminListData] =
    useState<AdminListProps>(initialState);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // console.log("Fetching hospital with ID:", id);
        const response = await authFetch(`/hospital/${id}/admin`, user.token);
        if (response && response.message === "success" && response.admins) {
          setAdminListData({
            admins: response.admins,
            page: adminListData.page,
            rowsPerPage: adminListData.rowsPerPage,
          });
        } else {
          console.error("Invalid API response:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user.token) {
      fetchAdminData();
    }
  }, [user.token, id]);

  const startIndex = adminListData.page * adminListData.rowsPerPage;
  const endIndex = startIndex + adminListData.rowsPerPage;

  const handleChangePage = (newPage: number) => {
    setAdminListData((prevState) => ({
      ...prevState,
      page: newPage,
    }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    const allRows = value === -1;
    setAdminListData((prevState) => ({
      ...prevState,
      rowsPerPage: allRows ? prevState.admins?.length || 0 : value,
      page: 0,
    }));
  };

  const handleAdminListClick = () => {
    navigate(`/sadmin/add-hospital/${id}`);
  };

  return (
    <div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <FormControl>
            <Button variant="contained" onClick={handleAdminListClick}>
              Add Admin
            </Button>
          </FormControl>
        </div>
        {adminListData &&
        adminListData.admins &&
        adminListData.admins.length > 0 ? (
          <TableContainer component={Paper}
          style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ height: "60px" }}>  
                  <TableCell>
                   <b>Admins Name</b>
                  </TableCell>
                  <TableCell >
                   <b> Phone Number</b>
                  </TableCell>
                  <TableCell >
                   <b> Address</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                  <b>Added On</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminListData.admins &&
                  adminListData.admins
                    .slice(
                      startIndex,
                      allRows ? adminListData.admins.length : endIndex
                    )
                    .map((AdminList) => (
                      <TableRow
                        key={AdminList.id}
                        style={{
                          height: "60px",
                        }}
                      >
                        <TableCell>{capitalizeFirstLetter(AdminList.firstName)}{" "}{capitalizeFirstLetter(AdminList.lastName)}</TableCell>
                        <TableCell>{AdminList.phoneNo}</TableCell>
                        <TableCell>{(AdminList.address)}</TableCell>
                        <TableCell>{AdminList.email}</TableCell>
                        <TableCell>{formatDate2(AdminList.addedOn)}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                25,
                { label: "All", value: adminListData.admins?.length || 0 },
              ]}
              component="div"
              count={adminListData.admins?.length || 0}
              rowsPerPage={adminListData.rowsPerPage}
              page={adminListData.page}
              onPageChange={(_, newPage) => handleChangePage(newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          <div>
            <p>No Admin Available.</p>
          </div>
        )}
      </div>
    </div>
  );
};
