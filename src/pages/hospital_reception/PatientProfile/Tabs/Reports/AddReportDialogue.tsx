import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import AddReport from "./AddReport";

type formDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: number;
};

export default function FormDialog({ open, setOpen }: formDialogType) {
  const [files, setFiles] = React.useState<File[] | undefined>([]);

  const handleClose = () => {
    setOpen(false);
    // setFiles([]);
  };
  const handleSubmit = async () => {
    console.log();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "800px",
            minWidth: "800px",
          },
        }}
      >
        <DialogContent>
          <AddReport files={files} setFiles={setFiles} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
