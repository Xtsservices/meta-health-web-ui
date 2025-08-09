import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import { selectErrorStatus } from "../store/error/error.selector";
import { setCloseSnackbar } from "../store/error/error.action";
import { useSelector } from "react-redux";
import { ReactNode } from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
type MyComponentProps = {
  children: ReactNode;
};
export default function Snackbars({ children }: MyComponentProps) {
  const action = useSelector(selectErrorStatus);
  const dispatch = useDispatch();
  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setCloseSnackbar());
  };

  React.useEffect(() => {
    if (action.display)
      setTimeout(() => {
        dispatch(setCloseSnackbar());
      }, 4000);
  }, [action, dispatch]);
  return (
    <>
      <Snackbar
        open={action.display}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={action.severity}
          sx={{ width: "100%" }}
        >
          {action.message}
        </Alert>
      </Snackbar>
      {children}
    </>
  );
}
