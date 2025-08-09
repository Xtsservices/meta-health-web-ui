import React from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { removeCurrentUser } from '../../store/user/user.action';
import { useNavigate } from 'react-router-dom';
type Logoutpros = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
function Logout({ setOpen }: Logoutpros) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };

 
  
  

  
  const handleLogout = () => {
    localStorage.removeItem('user')
    handleClose();
    dispatch(removeCurrentUser());
    navigate('/login');
    // window.location.reload() 
  };

  return (
    <>
      <DialogTitle>{'Logout'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure, you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button variant="contained" onClick={handleLogout}>
          Yes
        </Button>
      </DialogActions>
    </>
  );
}

export default Logout;
