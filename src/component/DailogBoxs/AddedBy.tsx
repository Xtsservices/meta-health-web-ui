import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { authFetch } from "../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

type User = {
  imageURL?: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  gender: string;
  dob: string;
  state: string;
  city: string;
  pinCode: string;
  email: string;
  address: string;
  departmentID: string;
  role: string;
};

const RoleList: { [key: number]: string } = {
  10007: "sAdmin",
  9999: "admin",
  4001: "doctor",
  2003: "nurse",
  1003: "staff",
  3001: "management",
  6001: "reception"
};

interface AddedByProps {
  userID: number | null | undefined;
}

const AddedBy: React.FC<AddedByProps> = ({ userID }) => {
  const user = useSelector(selectCurrentUser);

  const theme = useTheme();
  const [viewDepartment, setViewDepartment] = useState<string | null>(null);
  const [viewRole, setViewRole] = useState<string | null>(null);
  const [viewGender, setViewGender] = useState<string | null>(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [, setSelectedId] = useState<number | null | undefined>(null);

  // Dialog box states
  const [addedByDialogBoxOpen, setAddedByDialogBoxOpen] = useState(false);
  const [addedByData, setAddedByData] = useState<User | null>(null);

  const handleAddedByDialogBoxClickOpen = async () => {
    try {
      const response = await authFetch(`user/${userID}`, user.token);
      if (response.message === "success") {
        const id = response.user.departmentID;
        const departmentData = await authFetch(
          `department/singledpt/${id}`,
          user.token
        );

        // Set role, department, and gender
        setViewRole(RoleList[response.user.role]);
        setViewDepartment(departmentData.department[0].name);

        let gender: string;
        if (response.user.gender === "1") {
          gender = "male";
        } else if (response.user.gender == "2") {
          gender = "female";
        } else {
          gender = "others";
        }

        setViewGender(gender);
        setAddedByData(response.user);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setSelectedId(userID);
    setAddedByDialogBoxOpen(true);
  };

  const handleAddedByDialogBoxClose = () => {
    setAddedByDialogBoxOpen(false);
    setSelectedId(null); // Clear the selected ID on close
  };

  useEffect(() => {
    handleAddedByDialogBoxClickOpen();
  }, [userID]);

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={addedByDialogBoxOpen}
        onClose={handleAddedByDialogBoxClose}
        aria-labelledby="addedByDialogBoxResponsive-dialog-title"
      >
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          {`Added By `}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ textAlign: "center" }}
            id="addedByDialogBoxResponsive-dialog-description"
          >
            {/* User Information */}
            {addedByData?.imageURL && (
              <img
                src={addedByData.imageURL}
                alt="Profile"
                style={{ width: 100, height: 100 }}
                className="addedByDialogBox__profileImage"
              />
            )}
            <p>ID:{userID}</p>
            <div style={{ marginTop: "10px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    value={addedByData?.firstName || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    value={addedByData?.lastName || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Department"
                    value={viewDepartment || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role"
                    value={viewRole || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    value={addedByData?.phoneNo || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Gender"
                    value={viewGender || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    value={addedByData?.dob?.split("T")[0] || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State"
                    value={addedByData?.state || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    value={addedByData?.city || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Pincode"
                    value={addedByData?.pinCode || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Email"
                    value={addedByData?.email || ""}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {addedByData?.address && (
                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Address"
                      value={addedByData?.address || ""}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
              </Grid>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddedByDialogBoxClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddedBy;
