import React from "react";
import styles from "./AddStaff.module.scss";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
import add_icon from "./../../../../src/assets/addstaff/add_icon.png";
import sort_icon from "./../../../../src/assets/addstaff/sort_icon.png";
import CustomPaginationActionsTable from "./table";
import AddStaffForm from "./AddStaffForm";
import Dialog from "@mui/material/Dialog";
import UploadDialog from "./UploadStaff";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux/es/exports";
import {
  setAllStaff,
  setMultipleStaff,
} from "../../../store/staff/staff.action";
import { authFetch } from "../../../axios/useAuthFetch";
import { departmentType, staffType } from "../../../types";
import { useSeachStore } from "../../../store/zustandstore";
import {
  setBackdropLoading,
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import * as XLSX from "xlsx";
import { authPost } from "../../../axios/useAuthPost";
import { staffFormType } from "../../../utility/formTypes";
import PopperMenu from "../../../component/Popper";
import Tooltip from "@mui/material/Tooltip";
import image from "./../../../../src/assets/addstaff/image.png";
import { Role_NAME, SCOPE_LIST } from "../../../utility/role";

const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
  },
});

function AddStaff() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = React.useState(false);
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [departmentList, setDepartmentList] = React.useState<departmentType[]>(
    []
  );
  interface RowData {
    [key: string]: string;
  }
  const [filterDepartment, setFilteredDepartment] = React.useState(0);
  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const { setSearchText } = useSeachStore();
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };
  const fetchAllStaff = async () => {
    dispatch(setLoading(true));

    const response = await authFetch(`user/${user.hospitalID}`, user.token);
    if (response.message == "success") {
      if (response?.users) {
        dispatch(setAllStaff(response.users.sort(compareDates)));
      }
    }
  };
  React.useEffect(() => {
    if (user.token) fetchAllStaff();
  }, [user]);

  const getDepartments = async () => {
    const response = await authFetch(
      `department/${user.hospitalID}`,
      user.token
    );
    if (response.message == "success") {
      setDepartmentList(() => {
        return [...response.departments];
      });
    }
    dispatch(setLoading(false));
  };

  ////////////////////////////Upload excel////////////////////////
  ////////////////////////************************ *//////////////

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const binaryData = e?.target?.result;
    const workbook = XLSX.read(binaryData, { type: "binary" });

    const sheetName = workbook.SheetNames[0];
    const sheetData: any[][] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName],
      { header: 1, raw: false }
    );

    // ✅ Find index of row that contains 'email' as the first column
    const headerRowIndex = sheetData.findIndex(
      (row) =>
        Array.isArray(row) &&
        row[0] &&
        typeof row[0] === "string" &&
        row[0].toLowerCase().includes("email")
    );

    if (headerRowIndex === -1) {
      console.error("No valid header row (starting with 'email') found.");
      return;
    }

    // ✅ Extract headers
    const headers = sheetData[headerRowIndex].map((header: string) =>
      header.replace(/ /g, "_")
    );

    // ✅ Extract data rows after the header row
    const dataRows = sheetData.slice(headerRowIndex + 1);

    // ✅ Map data to JSON
    const jsonData = dataRows.map((row: string[]) => {
      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    dispatch(setBackdropLoading(true));
    submitData(jsonData);
  };

  reader.readAsBinaryString(file);
};


  // dispatch(setBackdropLoading(true));
  async function submitData(data: RowData[]) {
    // data.forEach((el)=>{
    // const scope_required = [Role_NAME.doctor, Role_NAME.nurse, Role_NAME.staff];
    const column = [
      "email",
      "password",
      "departmentID",
      "role",
      "phoneNo",
      "firstName",
      "lastName",
      "dob",
      "gender",
      "address",
      "city",
      "state",
      "pincode",
      "scope",
    ];
    const validatedData: staffFormType[] = [];
    let isError = false;
    data.forEach((staffFormData) => {
      // if (Object.keys(staffFormData).forEach(()))
      const notAllowedField = Object.keys(staffFormData).find(
        (el) => !column.includes(el)
      );
      if (notAllowedField) {
        isError = true;
        return dispatch(setError(`${notAllowedField} field not allowed`));
      } else {
        const {
          email,
          password,
          departmentID,
          role,
          phoneNo,
          firstName,
          lastName,
          dob,
          gender,
          address,
          city,
          state,
          pincode,
          scope,
        } = staffFormData;
        if (
          !email &&
          !password &&
          !departmentID &&
          !role &&
          !phoneNo &&
          !firstName &&
          !lastName &&
          !dob &&
          !gender &&
          !city &&
          !state &&
          !pincode
        ) {
          1 + 1;
        } else if (
          !email ||
          !password ||
          !departmentID ||
          !role ||
          !phoneNo ||
          !firstName ||
          !lastName ||
          !dob ||
          !gender ||
          !city ||
          !state ||
          !pincode
        ) {
          isError = true;
          dispatch(setBackdropLoading(false));
          return dispatch(
            setError(`one or few column missing in the excel sheet:[email,password, departmentID, role, phoneNo,
          firstName,
          lastName,
          dob,
          gender,
          address,
          city,
          state,
          pinCode]`)
          );
        } else {
          validatedData.push({
            email,
            password,
            departmentID,
            role,
            phoneNo,
            firstName,
            lastName,
            dob,
            gender,
            address,
            city,
            state,
            pinCode: Number(pincode),
            scope: scope.split(",").join("#"),
          });
        }
      }
    });
    if (!isError) {
      const response = await authPost(
        `user/${user.hospitalID}/createMultipleStaff`,
        { data: validatedData },
        user.token
      );
      if (response.message == "success") {
        dispatch(setSuccess("Staff successfully added"));
        dispatch(setMultipleStaff(response.data));
      } else {
        dispatch(setError(response.message));
      }
    }
    dispatch(setBackdropLoading(false));
  }
  //////////////////////////////////////////////////////////

  React.useEffect(() => {
    getDepartments();
  }, [user]);

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };


  const downloadTemplate = () => {
    const data = [
      {
        email: "Test@gmail.com",
        password: "xyz@123",
        departmentID: 1,
        role: 4001,
        phoneNo: "1234",
        firstName: "FirstName",
        lastName: "LastName",
        dob: "30-5-2024",
        gender: 1,
        address: "hitech-city",
        city: "Hyderabad",
        state: "Telangana",
        pincode: 518540,
        scope: "50001#5002",
      },
    ];

    // Format roles (excluding sAdmin, customerCare, admin)
    const roles = Object.entries(Role_NAME)
      .filter(([key]) => !["sAdmin", "customerCare", "admin"].includes(key))
      .map(
        ([key, value]) =>
          `${key.replace(/([A-Z])/g, " $1").toLowerCase()} - ${value}`
      )
      .join(", ");

    // Format scopes
    const scopes = Object.entries(filteredScopeList)
      .map(([key, value]) => `${key.replace(/_/g, " ")} - ${value}`)
      .join(", ");

    // Format departments
    const departments = departmentList?.length
      ? departmentList.map((each) => `${each.name}: ${each.id}`).join(", ")
      : "";

    const headerRows = [
      ["Note: Upload staff details!!"],
      [`Roles: ${roles}`],
      ["Gender: Male - 1, Female - 2, Others - 3"],
      [`Scopes: ${scopes}`],
      [`Departments: ${departments}`],
      [], // Blank row for spacing
    ];

    // Create worksheet and add headers
    const worksheet = XLSX.utils.aoa_to_sheet(headerRows);

    // Add the template data starting at A7 (after 6 rows)
    XLSX.utils.sheet_add_json(worksheet, data, {
      origin: "A7",
      skipHeader: false,
    });

    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Staff.xlsx";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Data you have
  const availableScopes = user?.scope?.split("#").map(Number) || [];

  // Filter SCOPE_LIST based on available scopes
  const filteredScopeList = Object.fromEntries(
    Object.entries(SCOPE_LIST).filter(([_, value]) =>
      availableScopes.includes(value)
    )
  );

  return (
    <>
      {/* ====================header top button start======================= */}
      <div className={admin_styles.main_header}>
        <div className={admin_styles.main_header_top}>
          <div className={admin_styles.main_header_top_search}>
            <img src={search_icon} alt="" className="" />
            <input
              type="text"
              className="input_search"
              placeholder="Search"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
            url={"/inpatient/admin/profile"}
            anchorRef={anchorRef}
            color={"#c0e4ff"}
          />
        </div>
      </div>

      <div className={admin_styles.adminwelcomecontainer}>
        <h1 style={{ paddingLeft: "10px" }}></h1>

        <div style={{ display: "flex" }}>
          <Tooltip title="Template">
            <img
              src={image}
              alt=""
              style={{
                marginRight: "5px",
                marginTop: "10px",
                height: "30%",
                width: "1.6rem",
              }}
              onClick={downloadTemplate}
            />
          </Tooltip>

          <div style={{ marginRight: "5px" }} className={admin_styles.buttons}>
            <input
              type="file"
              accept=".xls, .xlsx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="xlsx_input"
            />
            <label
              htmlFor="xlsx_input"
              className={admin_styles.header_button}
              style={{
                backgroundColor: "#1977f3",
                borderRadius: "30px",
                border: "none",
                padding: "10px 20px",
                fontWeight: "bold",
                color: "white",
                cursor: "pointer", // Ensures the label appears clickable
                display: "inline-flex", // Aligns label text similarly to a button
                alignItems: "center", // Centers text vertically
                justifyContent: "center",
              }}
            >
              Upload Staff
            </label>
          </div>

          <div className={admin_styles.buttons}>
            <button
              className={admin_styles.header_button}
              onClick={handleClickOpen}
              style={{
                backgroundColor: "#1977f3",
                borderRadius: "30px",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: "bold",
                color: "white", // Ensures text is readable on the blue background
              }}
            >
              <img
                src={add_icon}
                alt=""
                style={{ marginRight: "5px", marginTop: "5px" }}
              />
              Add Staff
            </button>
          </div>
        </div>
      </div>
      {/* ====================header top button end ======================= */}

      <div className={admin_styles.main_info_right}>
        <div className={styles.container}>
          <div className={styles.container_header}>
            Staff Details
            <button
              className={styles.sort_button}
              style={{ visibility: "hidden" }}
            >
              <img src={sort_icon} alt="" />
              Sort
            </button>
            <select
              style={{ width: "9rem", border: "2px solid gray" }}
              name="filter"
              id=""
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setFilteredDepartment(Number(event.target.value));
              }}
            >
              <option value={0}>All Departments</option>;
              {departmentList.map((department) => {
                return (
                  <option value={department.id}>
                    {department.name.slice(0, 1).toUpperCase() +
                      department.name.slice(1).toLowerCase()}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.container_table}>
            <CustomPaginationActionsTable filterDepartment={filterDepartment} />
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        classes={{ paper: classes.dialogPaper }}
      >
        <AddStaffForm open={open} setOpen={setOpen} type={"Staff"} />
      </Dialog>
      <Dialog
        open={openUploadDialog}
        onClose={handleCloseUploadDialog}
        classes={{ paper: classes.dialogPaper }}
      >
        <UploadDialog open={openUploadDialog} setOpen={setOpenUploadDialog} />
      </Dialog>
    </>
  );
}

export default AddStaff;

function compareDates(a: staffType, b: staffType) {
  return new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf();
}
