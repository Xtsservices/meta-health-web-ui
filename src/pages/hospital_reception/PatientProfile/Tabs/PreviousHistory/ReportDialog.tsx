import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./report.module.scss";
import { attachmentType } from "../../../../../types";
import { reportCategory } from "../../../../../utility/role";
import { capitalizeFirstLetter } from "../../../../../utility/global";
import pdf from "../../../../../assets/reception/pdf.png";
import image_icon from "../../../../../assets/reception/image.png";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    // minWidth: 1000,
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    minWidth: 800,
    minHeight: 400,
  },
}));
type dialogProp = {
  timelineID: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};
export default function ReportDialogs({ setOpen, open }: dialogProp) {
  const [reports] = React.useState<attachmentType[]>([]);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        // sx={{ minWidth: 800 }}
        classes={{ paper: "customDialog" }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Report
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className={styles.container}>
            {Object.keys(reportCategory).map((category, index) => {
              return (
                <>
                  {" "}
                  <div className={styles.container_report}>
                    <div className={styles.container_header}>
                      <h2>{capitalizeFirstLetter(category)}</h2>
                    </div>
                    <div className={styles.report}>
                      {reports
                        .filter(
                          (report) =>
                            report.category ===
                            Object.values(reportCategory)[index]
                        )
                        .sort(compareDates)
                        .map((report) => {
                          return (
                            <div className={styles.uploaded_box}>
                              <div className={styles.uploaded_box_file}>
                                <div className={styles.icons}>
                                  <img
                                    src={
                                      report.mimeType === "application/pdf"
                                        ? pdf
                                        : image_icon
                                    }
                                    style={{
                                      height: "4rem",
                                      width: "4rem",
                                      objectFit: "cover",
                                    }}
                                    alt=""
                                  />
                                </div>
                                <h3>
                                  {report.fileName
                                    .slice(
                                      0,
                                      -report.mimeType.split("/")[1].length - 1
                                    )
                                    .slice(
                                      0,
                                      report.fileName.length > 12
                                        ? 12
                                        : report.fileName.length
                                    )}
                                </h3>
                                <br />
                                {/* Added On: {new Date(report.addedOn)} */}
                                <h4>
                                  {" "}
                                  Added on:{" "}
                                  {new Date(report.addedOn).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                    }
                                  )}
                                </h4>{" "}
                              </div>
                              <a
                                href={report.fileURL}
                                target="_blank"
                                style={{ textDecoration: "none" }}
                              >
                                <div className={styles.uploaded_box_buttons}>
                                  <button className="">View </button>
                                </div>
                              </a>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

function compareDates(a: attachmentType, b: attachmentType) {
  return new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf();
}
