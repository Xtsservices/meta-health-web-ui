import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import DialogActions from "@mui/material/DialogActions";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import Typography from "@mui/material/Typography";
import Logs from './Logs';
import { vitalsType } from '../../../../../../types';
import LineChart from './Chart';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '800px',
    minWidth: '800px',
    minHeight: '40rem',
  },
  // blueDialogTitle: {
  //   backgroundColor: "#1977f3", // Change this to the desired background color
  //   color: "white", // Optionally, you can set the text color
  // },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
type formDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: keyof vitalsType;
  unit: string;
};
export default function VitalsDialog({
  open,
  setOpen,
  category,
  unit,
}: formDialogType) {
  const handleClose = () => {
    setOpen(false);
  };
  const [option, setOption] = React.useState('logs');

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {' '}
          <div
            className=""
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {category !== 'bp' &&
              category.slice(0, 1).toUpperCase() +
                category.slice(1).toLowerCase()}{' '}
            {category == 'bp' && 'Blood Pressure '}
            History
            <Button
              sx={{ ml: 'auto', mr: '10px',backgroundColor:"1977f3" }}
              onClick={() => {
                setOption('logs');
              }}
              variant={option == 'logs' ? 'contained' : 'outlined'}
            >
              Logs
            </Button>
            <Button
              sx={{ mr: '30px',backgroundColor:"1977f3" }}
              onClick={() => {
                setOption('chart');
              }}
              variant={option == 'chart' ? 'contained' : 'outlined'}
            >
              Chart
            </Button>
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {option == 'logs' && <Logs category={category} unit={unit} />}
          {option == 'chart' && <LineChart category={category} unit={unit} />}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
