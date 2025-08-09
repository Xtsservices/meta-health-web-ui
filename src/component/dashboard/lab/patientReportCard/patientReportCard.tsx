import  { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { amber } from '@mui/material/colors';
import { QrCode2 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// const steps = {
//   'qr code generated': 1,
//   processing: 2,
//   completed: 3,
// };

const PATIENT_LAB_REPORT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  QR_GENERATED: 'qr-generated',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
};

const getCompletionPercent = (reportStatus: string) => {
  switch (reportStatus) {
    case PATIENT_LAB_REPORT_STATUS.COMPLETED:
      return 100;
    case PATIENT_LAB_REPORT_STATUS.PENDING:
      return 0;
    case PATIENT_LAB_REPORT_STATUS.QR_GENERATED:
      return 15;
    case PATIENT_LAB_REPORT_STATUS.UPLOADING:
      return 50;
    case PATIENT_LAB_REPORT_STATUS.PROCESSING:
      return 30;
    default:
      return 0;
  }
};

interface PatientReportCardProps {
  title: string;
  reportStatus: string;
  fetchUrl: string;
}

const PatientReportCard = ({
  title,
  reportStatus,
}: PatientReportCardProps) => {
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(reportStatus);

  const navigate = useNavigate();
  const handleClickOpen = () => {
    navigate('reports');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    setStatus('uploading');
    setTimeout(() => {
      setStatus('completed');
      setOpen(false);
    }, 3000); // Simulate file upload time
  };

  const handleQrClickOpen = () => {
    setQrOpen(true);
  };

  const handleQrClose = () => {
    setQrOpen(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        marginBottom: 4,
        padding: 2,
        paddingInline: 4,
        border: '1px solid #ccc',
        borderRadius: 8,
        backgroundColor: '#fbfbfb',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingLeft: 1,
          }}
        >
          <Typography variant="body2">QR Code</Typography>
          <QrCode2 sx={{ height: 40, width: 40 }} />
          <IconButton onClick={handleQrClickOpen}>
            <RemoveRedEyeIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 2, flexGrow: 1 }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 0,
                alignItems: 'center',
                flexGrow: 1,
                marginInline: 10,
              }}
            >
              {/* <IconButton sx={{ padding: 0 }}> */}
              <CheckCircleIcon
                sx={{
                  color: status === 'completed' ? amber[700] : 'disabled',
                  height: 35,
                  width: 35,
                }}
              />
              {/* </IconButton> */}
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={getCompletionPercent(status)}
                />
              </Box>
              <IconButton onClick={handleClickOpen} sx={{ padding: 0 }}>
                <CheckCircleIcon
                  sx={{
                    color: status === 'completed' ? amber[700] : 'disabled',
                    height: 35,
                    width: 35,
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 0,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexGrow: 1,
              marginInline: 10,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={'bold'}
              sx={{ color: amber[700] }}
            >
              QR Code Generated
            </Typography>
            <Typography
              variant="body2"
              fontWeight={'bold'}
              sx={{ color: amber[700] }}
            >
              {reportStatus === PATIENT_LAB_REPORT_STATUS.COMPLETED
                ? 'Submitted'
                : 'Processing'}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={'bold'}
              sx={{ color: amber[700] }}
            >
              Submit
            </Typography>
          </Box>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" disabled={!file}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={qrOpen} onClose={handleQrClose}>
        <DialogTitle>QR Code</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <QrCode2 sx={{ height: 200, width: 200 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQrClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientReportCard;
