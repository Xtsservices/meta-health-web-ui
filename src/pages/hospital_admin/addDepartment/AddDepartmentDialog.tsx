import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./addDepartment.module.scss";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
// import { ChangeEventHandler } from "react";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import * as React from "react";
import { departmentType } from "../../../types";
type addStaffProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // data: departmentType[];
  setData: React.Dispatch<React.SetStateAction<departmentType[]>>;
};
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

export default function AddDepartmentDialog({
  setOpen,
  // data,
  setData,
}: addStaffProps) {
  // const [searchList, setSearchList] = React.useState<string[]>([]);
  // const [search, setSearch] = React.useState<string>("");
  const [selectedList, setSelectedList] = React.useState<string[]>([]);
  const [textDepartment, setTextDepartment] = React.useState<string | null>(
    null
  );
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const departmentList = [
    "Emergency Department",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Obstetrics and Gynecology",
    "Oncology",
    "Radiology",
    "Urology",
    "Gastroenterology",
    "Dermatology",
    "Nephrology",
    "Ophthalmology",
    "ENT",
    "General Surgery",
    "Anesthesiology",
    "Pulmonology",
    "Endocrinology",
    "Psychiatry",
    "Rheumatology",
    "Physical Therapy",
    "Speech Therapy",
    "Occupational Therapy",
    "Dietetics",
    "Infectious Diseases",
    "Hematology",
    "Oncological Surgery",
    "Plastic Surgery",
    "Neonatology",
    "Geriatrics",
    "Pain Management",
    "Pathology",
    "Intensive Care Unit (ICU)",
    "Rehabilitation Medicine",
    "Sports Medicine",
    "Allergy and Immunology",
    "Neurosurgery",
    "Dental Services",
    "Psychology",
    "Palliative Care",
  ];


  // const currentDepartment = data
  //   .filter((el) => !departmentList.includes(el.name))
  //   .map((el) => {
  //     return el.name;
  //   });
  // const currentDepartment = data.map((el) => el.name);
  // const filteredDepartmentList = departmentList.filter(
  //   (el) => !currentDepartment.includes(el)
  // );
  // React.useEffect(() => {
  //   if (!search) {
  //     setSearchList(filteredDepartmentList);
  //   } else {
  //     filteredDepartmentList.filter((el) =>
  //       el.toLowerCase().includes(search.toLowerCase())
  //     );
  //     setSearchList(
  //       filteredDepartmentList.filter((el) =>
  //         el.toLowerCase().includes(search.toLowerCase())
  //       )
  //     );
  //   }
  // }, [search]);

  const handleClose = () => {
    setOpen(false);
  };

  // const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   e.preventDefault();
  //   setSearch(e.target.value);
  // };
  // const handleCheckBoxClicked: (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => void = (event) => {
  //   if (event.target.checked) {
  //     setSelectedList((prevValue) => {
  //       return [...prevValue, event.target.value];
  //     });
  //   } else {
  //     setSelectedList((prevValue) => {
  //       return prevValue.filter((el) => el != event.target.value);
  //     });
  //   }
  // };
  const handleSubmit = async () => {
    dispatch(setLoading(true));
    let departments = selectedList.map((el) => {
      return { name: el };
    });
    if (selectedList.length == 0 && textDepartment) {
      departments = [{ name: textDepartment }];
    }
    const obj = {
      departments,
    };

    const data = await authPost(
      `department/${user.hospitalID}`,
      obj,
      user.token
    );
    if (
      data.message == "success" &&
      data?.departments !== "one or more departments with same name exist"
    ) {
      dispatch(setSuccess("Department successfully added"));
      setData((state) => {
        const newDepartment = data.departments.map(
          (department: departmentType) => {
            return { name: department.name, id: department.id, count: 0 };
          }
        );
        return [...newDepartment, ...state];
      });
    } else {
      if (
        data?.departments === "one or more departments with same name exist"
      ) {
        dispatch(setError(data.departments));
      } else {
        dispatch(setError(data.message));
      }
    }
    dispatch(setLoading(false));
    setTimeout(() => {
      handleClose();
    }, 1000);

    // if(data.message=="success")
  };
  const debouncedHandleSubmit = debounce(handleSubmit,DEBOUNCE_DELAY);

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setTextDepartment(event.target.value as string);
  };

  const handleAddDpt = () => {
    if (textDepartment && !selectedList.includes(textDepartment)) {
      setSelectedList((state) => [...state, textDepartment]);
      setTextDepartment("");
    }
  };

  return (
    <div>
      <DialogTitle>Add Department</DialogTitle>
      <DialogContent>
        <div className={styles.department_dialog}>
          {/* <div className={styles.dialog_search}>
            <img src={search_icon} alt="" />
            <input type="text" placeholder="Search" onChange={handleSearch} />
          </div> */}
          <div className={styles.dialog_list}>
            {/* {searchList?.map((element) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleCheckBoxClicked}
                      value={element}
                      checked={selectedList.includes(element)}
                      id={element}
                    />
                  }
                  label={element}
                />
              );
            })} */}
          </div>

          <Grid container alignItems={"center"} spacing={2}>
            <Grid item xs={10}>
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ mt: "10px" }}
              >
                <InputLabel id="department-select-label">
                  Add Department
                </InputLabel>
                <Select
                  labelId="department-select-label"
                  id="department-select"
                  // value={textDepartment}
                  onChange={handleDepartmentChange}
                  label="Add Department"
                >
                  {departmentList.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                disabled={!textDepartment}
                onClick={handleAddDpt}
                endIcon={<AddIcon />}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </div>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          rowGap={1}
          sx={{ mt: "10px" }}
        >
          {selectedList.map((el) => {
            return (
              // <Item>

              <Chip
                label={el}
                onDelete={() => {
                  setSelectedList((curr) => {
                    return curr.filter((dep) => dep != el);
                  });
                }}
              />
              // </Item>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={debouncedHandleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </div>
  );
}
