import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  MenuItem,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const testTypes: string[] = ['MRI', 'CFR', 'ECG'];

interface Report {
  id: number;
  type: string;
  date: string;
  file: File | null;
}

const LabPatientReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
  const [newReport, setNewReport] = useState<
    Pick<Report, 'type' | 'date' | 'file'>
  >({
    type: '',
    date: '',
    file: null,
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleUploadDialogOpen = () => {
    setOpenUploadDialog(true);
  };

  const handleUploadDialogClose = () => {
    setOpenUploadDialog(false);
  };

  const handleViewDialogOpen = (report: Report) => {
    setSelectedReport(report);
    setOpenViewDialog(true);
  };

  const handleViewDialogClose = () => {
    setOpenViewDialog(false);
  };

  const handleReportChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setNewReport((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleAddReport = () => {
    setReports((prev) => [...prev, { ...newReport, id: Date.now() }]);
    setNewReport({ type: '', date: '', file: null });
    setOpenUploadDialog(false);
  };

  const handleDeleteReport = (id: number) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };

  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={'bold'} gutterBottom>
          PATHOLOGY
        </Typography>
        <Button
          color="primary"
          variant="contained"
          aria-label="add"
          onClick={handleUploadDialogOpen}
          sx={{ display: 'inline-flex', gap: 1 }}
        >
          <AddIcon sx={{ color: 'white' }} />
          <Typography variant="body2">Add reports</Typography>
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {reports.map((report) => (
          <Card key={report.id} sx={{ minWidth: 275, maxWidth: 275 }}>
            <CardContent>
              <PictureAsPdfIcon sx={{ fontSize: 60, color: 'red' }} />
              <Typography variant="h6" component="div">
                {report.type} Report
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Added on: {report.date}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleDeleteReport(report.id)}>
                <DeleteIcon color="error" />
              </IconButton>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleViewDialogOpen(report)}
              >
                View
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={openUploadDialog} onClose={handleUploadDialogClose}>
        <DialogTitle>Add Report</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Test Type"
            name="type"
            value={newReport.type}
            onChange={handleReportChange}
            fullWidth
            margin="normal"
          >
            {testTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={newReport.date}
            onChange={handleReportChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button
            onClick={handleAddReport}
            disabled={!newReport.type || !newReport.date || !newReport.file}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openViewDialog} onClose={handleViewDialogClose}>
        <DialogTitle>View Report</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedReport?.type} Report</Typography>
          <Typography variant="body1">
            Added on: {selectedReport?.date}
          </Typography>
          {selectedReport?.file && (
            <Box sx={{ mt: 2 }}>
              <iframe
                src={URL.createObjectURL(selectedReport.file)}
                title="PDF"
                width="100%"
                height="400px"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          marginTop: reports.length === 0 ? 25 : 5,
        }}
      >
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default LabPatientReports;
