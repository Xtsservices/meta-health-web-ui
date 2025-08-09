import React, { useState } from "react";
import styles from "./NewTicket.module.scss";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton, Button, TextField, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authPost } from "../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../utility/debounce";
import { setError, setSuccess } from "../../store/error/error.action";
import Autocomplete from "@mui/material/Autocomplete";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { authFetch } from "../../axios/useAuthFetch";
import { Role_NAME } from "../../utility/role";
import { userType } from "../../interfaces";
// import { capitalizeFirstLetter } from "../../utility/global";

// import { Subject } from "@mui/icons-material";
// const styles2 = {
//   disabledMenuItem: {
//     color: "black", // Lighter text color for disabled option
//     fontStyle: "italic", // Italic style for disabled option
//     backgroundColor: "white",
//   },
// };
const NewTicketStaff = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  // const [ticketFor, setTicketFor] = useState<number>(0);
  // const [userID, setUserID] = useState<number>(0);
  const [, setUsersList] = useState<userType[]>([]);
  const user = useSelector(selectCurrentUser);
  const [module, setModule] = useState<string>("");
  const dispatch = useDispatch();
  const getAllUsers = async () => {
    const res = await authFetch(
      `user/${user.hospitalID}/usersList/${Role_NAME.staff}`,
      user.token
    );
    if (res.message == "success") {
      setUsersList(res.users);
    }
  };
  React.useEffect(() => {
    if (user.token) getAllUsers();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validate userID

    if (files.length > 3) {
      dispatch(
        setError(
          "Maximum Limit exceeded, cannot upload more than 3 images at a time"
        )
      );
    }
    const formData = new FormData();

    files.forEach((file) => {
      formData.append(`files`, file);
    });
    const userID = user.id;
    const res = await authPost(
      `ticket/hospital/${user.hospitalID}`,
      { userID, type, subject: description, createdBy: user.id, module },
      user.token
    );
    // console.log("res", res);

    if (res.message === "success") {
      dispatch(setSuccess("Ticket successfully generated"));
      if (files.length) {
        const attachmentRes = await authPost(
          `attachment/tickets/${user.hospitalID}/${res.ticket.id}`,
          formData,
          user.token
        );
        if (attachmentRes.message == "success") {
          setTimeout(() => {
            dispatch(setSuccess("Attachments successfully uploaded"));
          }, 1000);
        } else {
          setTimeout(() => {
            dispatch(setError(attachmentRes.message));
          }, 1000);
        }
        setTimeout(() => {
          navigate("../tickets");
        }, 2000);
      } else {
        setTimeout(() => {
          navigate("../tickets");
        }, 2000);
      }

      setDescription("");
      setType("");
      setFiles([]);
    } else {
      dispatch(setError(res.message));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  const handleCancel = () => {
    navigate("./..");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton aria-label="delete" onClick={() => navigate("./..")}>
          <ArrowBackIosIcon />
        </IconButton>
        <h2 style={{ flex: "1", justifyContent: "center" }}>
          {" "}
          Create New Ticket
        </h2>
      </div>
      <form
        className={styles.container_form}
        onSubmit={(e) => {
          e.preventDefault();
          debouncedHandleSubmit(e);
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              value={type || null}
              onChange={(_, newValue: string | null) => {
                setType(newValue || "");
              }}
              inputValue={type || ""}
              onInputChange={(_, newInputValue) => {
                setType(newInputValue);
              }}
              options={[
                "Bug",
                "Feature request",
                "Technical issue",
                "Support query",
              ]}
              renderInput={(params) => (
                <TextField {...params} label="Issue Type" required />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="module-select-label">Module</InputLabel>
              <Select
                labelId="module-select-label"
                id="module-select"
                value={String(module)}
                label="Module"
                onChange={(event: SelectChangeEvent) => {
                  setModule(event.target.value);
                }}
                sx={{
                  textAlign: "left",
                }}
              >
                {[
                  "Inpatient",
                  "OPD",
                  "OT",
                  "Triage",
                  "Emergency Red zone",
                  "Emergency Yellow zone",
                  "Emergency Green zone",
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-helper-label">For</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={String(ticketFor)}
                label="For"
                onChange={(event: SelectChangeEvent) => {
                  setTicketFor(Number(event.target.value));
                  if (event.target.value == String(ticketForObj.self)) {
                    setUserID(user.id);
                  }
                }}
                name="departmentID"
              >
                {Object.keys(ticketForObj).map((el, index) => (
                  <MenuItem
                    key={index}
                    value={Object.values(ticketForObj)[index]}
                  >
                    {capitalizeFirstLetter(el)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-helper-label">User</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={String(userID)}
                label="User"
                onChange={(event: SelectChangeEvent) => {
                  setUserID(Number(event.target.value));
                }}
                name="departmentID"
                disabled={ticketFor == ticketForObj.self}
              >
                {usersList.length == 0 ? (
                  <MenuItem disabled value="" style={styles2.disabledMenuItem}>
                    No user available
                  </MenuItem>
                ) : (
                  usersList.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {capitalizeFirstLetter(
                        `${el.firstName + "_" + el.lastName}`
                      )}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid> */}

          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              fullWidth
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <div className={styles.fileInputContainer}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setFiles((prev) => [...prev, ...(e.target.files ?? [])])
                }
                className={styles.fileInput}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">+</label>
              <div className={styles.filePreview}>
                {files.map((file, index) => (
                  <div key={index} className={styles.previewItem}>
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className={styles.previewImage}
                    />
                    <div
                      className={styles.removeIcon}
                      onClick={() => handleRemoveImage(index)}
                    >
                      &times;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px", justifyContent: "flex-end" }}
        >
          <Grid item>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default NewTicketStaff;
