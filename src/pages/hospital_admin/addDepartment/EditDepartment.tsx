import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { authPatch } from "../../../axios/usePatch";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch } from "react-redux";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
// import { departmentType } from "../../../types";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";

type  editDepartmentProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // data: departmentType[];
    currentDep: any;
    setNameChanged: React.Dispatch<React.SetStateAction<boolean>>;
  };

export default function EditDepartment(
    {
    setOpen,
    currentDep,
    setNameChanged
    }:editDepartmentProps
) {
    const [name,setName] = React.useState(currentDep.name.slice(0, 1).toUpperCase() +
        currentDep.name.slice(1).toLowerCase())
    const [localLoading, setLocalLoading] = React.useState(false);

    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSave = async()=>{
    setLocalLoading(true)
    dispatch(setLoading(true));
    const response = await authPatch(
      `department/${currentDep.hospitalID}/${currentDep.id}`,
      {name},
      user.token
    );
    if (response?.message == "success") {
      
    dispatch(setSuccess("Department successfully updated"));
    setNameChanged(true)
    setTimeout(() => {
        handleClose();
      }, 1000);
    } else {
      dispatch(setError(response.message));
    }
    dispatch(setLoading(false));
    setLocalLoading(false)
  }
  const debouncedHandleOnSave = debounce(handleOnSave, DEBOUNCE_DELAY);

  return (
    <div>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Department Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            disabled={localLoading}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const inputValue = event.target.value;
                const capitalizedInput = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                setName(capitalizedInput);
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={localLoading}>Cancel</Button>
          <Button onClick={debouncedHandleOnSave} disabled={localLoading}>Save</Button>
        </DialogActions>
    </div>
  );
}
