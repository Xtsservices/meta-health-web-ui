import { useEffect, useRef, useState , ChangeEvent} from "react";
import styles from "./../../dashboard_super_admin/dashboard.module.scss";
import super_admin_styles from "./../../../component/sidebar/super_admin_styles.module.scss";
import  admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { capitalizeFirstLetter, formatDate2 } from "./../../../utility/global";
import search_icon from "./../../../assets/sidebar/search_icon.png";
import { useSeachStore } from "../../../store/zustandstore";
import PopperMenu from "../../../component/Popper";


interface ViewHospitalsState {
  hospitalData: any | null;
  selectedCity: string;
  page: number;
  rowsPerPage: number;
}

const initialState: ViewHospitalsState = {
  hospitalData: null,
  selectedCity: "SelectCity",
  page: 0,
  rowsPerPage: 5,
};

function ViewHospitals() {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
   const [openMenu, setOpenMenu] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
       const {  setSearchText } = useSeachStore();
  const [state, setState] = useState<ViewHospitalsState>(initialState);
  const fetchHospitals = async () => {
    try {
      const response = await authFetch(`/hospital`, user.token);
      // console.log("response to view hospitals", response);
      if (response && response.message === "success" && response.hospitals) {
        setState((prevState) => ({
          ...prevState,
          hospitalData: response,
        }));
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user.token) {
      fetchHospitals();
    }
  }, [user.token]);

  // const handleSearchTextChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const searchText = event.target.value;
  // };

  const getUniqueCities = () => {
    const citiesSet = new Set<string>();
    state.hospitalData?.hospitals.forEach((hospital: any) => {
      citiesSet.add(hospital.city);
    });
    return Array.from(citiesSet).map((city) => ({
      value: city,
      label: city,
    }));
  };

  const cityOptions = getUniqueCities();

  const handleCityChange = (event: SelectChangeEvent) => {
    const selectedCity = event.target.value as string;
    setState((prevState) => ({
      ...prevState,
      selectedCity,
      page: 0,
    }));
  };
  // console.log("Hospital data:", state.hospitalData?.hospitals);
  const filteredHospitals = state.hospitalData?.hospitals.filter(
    (hospital: any) =>
      state.selectedCity === "SelectCity" ||
      hospital.city === state.selectedCity
  );
  console.log("Filtered Hospitals:", filteredHospitals);

  const handleHospitalClick = (id: number) => {
    navigate(`/sadmin/view-hospital/${id}`);
  };

  const handleChangePage = (newPage: number) => {
    setState((prevState) => ({
      ...prevState,
      page: newPage,
    }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rowsPerPage =
      event.target.value === "All"
        ? filteredHospitals?.length
        : parseInt(event.target.value, 10);

    const endIndex =
      rowsPerPage === -1
        ? filteredHospitals?.length
        : state.page * rowsPerPage + rowsPerPage;

    setState((prevState) => ({
      ...prevState,
      rowsPerPage: rowsPerPage || 5,
      page: 0,
      endIndex: endIndex || 0,
    }));
  };

  const rowsPerPageOptions: (number | { value: number; label: string })[] = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 25, label: "25" },
    { value: -1, label: "All" },
  ];
  const startIndex = state.page * state.rowsPerPage;
  const endIndex = startIndex + state.rowsPerPage;

  // const displayedData = filteredHospitals?.slice(startIndex, endIndex);
  // const displayedData =
  //   state.rowsPerPage === -1
  //     ? filteredHospitals
  //     : filteredHospitals?.slice(startIndex, endIndex);

  // const displayedData =
  // state.rowsPerPage === -1
  //   ? filteredHospitals
  //   : filteredHospitals?.slice(startIndex, endIndex);

  const actualEndIndex =
    state.rowsPerPage === -1
      ? filteredHospitals?.length
      : Math.min(endIndex, filteredHospitals?.length || 0);

  const displayedData =
    state.rowsPerPage === -1
      ? filteredHospitals
      : filteredHospitals?.slice(startIndex, actualEndIndex);



        const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  return (
    <>

       <div className={admin_styles.main_header}>
                <div className={admin_styles.main_header_top}>
                  <div className={admin_styles.main_header_top_search}>
                    <img src={search_icon} alt="" className="" />
                    <input
                      type="text"
                      className="input_search"
                      placeholder="Search"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setSearchText(event.target.value);
                      }}
                    />
                  </div>
        
                  <div
                    className={admin_styles.header_profile}
                    // onClick={() => navigate("/inpatient/admin/profile")}
                    ref={anchorRef}
                    onClick={handleToggle}
                  >
                    {user.imageURL ? (
                      <img src={user.imageURL} alt="" className="" />
                    ) : (
                      <AccountCircleIcon fontSize="large" />
                    )}
                    {/* <img src={profile_pic} alt="" className="" /> */}
                  </div>
                  <PopperMenu
                    setOpen={setOpenMenu}
                    open={openMenu}
                    url={"/sadmin/profile"}
                    anchorRef={anchorRef}
                    color={"#c0e4ff"}
                  />
                </div>
              </div>
      <div className={super_admin_styles.main_header}>
       
        <div className={super_admin_styles.main_header_bottom}>
          <div className={super_admin_styles.welcome}>
            <h1 className={super_admin_styles.header_heading}>
              View Hospitals
            </h1>
          </div>
        </div>
      </div>
      <div className={super_admin_styles.main_info_right}>
        <div className={styles.container}>
          <div>
            <div
              style={{
                backgroundColor: "white",
                marginLeft: "2rem",
                marginTop: "110px",
                width: "68vw",
                padding: "50px",
                borderRadius: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "20px",
                }}
              >
                <Select
                  sx={{
                    height: "40px",
                    backgroundColor: "white",
                    borderRadius: "30px",
                    color: "blue",
                  }}
                  value={state.selectedCity}
                  onChange={handleCityChange}
                  // variant="outlined"
                >
                  <MenuItem value="SelectCity">Select City</MenuItem>
                  {cityOptions.map((city) => (
                    <MenuItem key={city.value} value={city.value}>
                      {city.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div>
                {filteredHospitals && filteredHospitals.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>
                            <b>Hospital Name</b>
                          </TableCell>
                          <TableCell>
                            <b>City</b>
                          </TableCell>
                          <TableCell>
                            <b>No. of Hubs</b>
                          </TableCell>
                          <TableCell>
                            <b>No. of Devices</b>
                          </TableCell>
                          <TableCell>
                            <b>Added On</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayedData?.map((hospital: any, index: number) => (
                          <TableRow
                            key={index}
                            onClick={() => handleHospitalClick(hospital.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              <LocalHospitalIcon
                                style={{ color: "red", fontSize: 36 }}
                              />
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(hospital.name)}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(hospital.city)}
                            </TableCell>
                            <TableCell>{hospital.hub_count}</TableCell>
                            <TableCell>{hospital.device_count}</TableCell>
                            <TableCell>
                              {formatDate2(hospital.addedOn)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={rowsPerPageOptions}
                      component="div"
                      count={filteredHospitals?.length || 0}
                      rowsPerPage={state.rowsPerPage}
                      page={state.page}
                      onPageChange={(_, newPage) => handleChangePage(newPage)}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                ) : (
                  <div>
                    <p>No data available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewHospitals;
