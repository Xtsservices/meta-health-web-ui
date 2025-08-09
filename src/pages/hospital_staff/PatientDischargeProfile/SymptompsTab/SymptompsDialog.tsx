import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./../../../hospital_admin/addDepartment/addDepartment.module.scss";
import search_icon from "./../../../../../src/assets/sidebar/search_icon.png";
import { ChangeEventHandler } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
type addStaffProps = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
  selectedList: string[];
};
const departmentList = ["Stomach Ache", "Fever", "Cough", "Throat pain"];

export default function AddSymptomsDialog({
  setOpen,
  setSelectedList,
  selectedList,
}: addStaffProps) {
  const [searchList, setSearchList] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    if (!search) {
      setSearchList(departmentList);
    } else {
      console.log(
        departmentList.filter((el) =>
          el.toLowerCase().includes(search.toLowerCase())
        )
      );
      setSearchList(
        departmentList.filter((el) =>
          el.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };
  const handleCheckBoxClicked: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    if (event.target.checked) {
      setSelectedList((prevValue) => {
        return [...prevValue, event.target.value];
      });
    } else {
      setSelectedList((prevValue) => {
        return prevValue.filter((el) => el != event.target.value);
      });
    }
  };

  return (
    <div>
      <DialogTitle>Add Department</DialogTitle>
      <DialogContent>
        <div className={styles.department_dialog}>
          <div className={styles.dialog_search}>
            <img src={search_icon} alt="" />
            <input type="text" placeholder="Search" onChange={handleSearch} />
          </div>
          <div className={styles.dialog_list}>
            {searchList?.map((element) => {
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
            })}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </div>
  );
}
