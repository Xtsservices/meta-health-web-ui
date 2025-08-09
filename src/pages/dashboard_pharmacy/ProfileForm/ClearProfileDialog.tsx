import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function AlertDialog({ open, setOpen }: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
   
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to remove the profile image?'}
        </DialogTitle>
        <DialogContent>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <Button onClick={handleSubmit} autoFocus variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
