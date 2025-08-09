import { Backdrop, CircularProgress } from "@mui/material";
import { selectBackdropStatus } from "../../store/error/error.selector";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import styles from "./BackDropStyle.module.scss";

export default function SimpleBackdrop({ children }: { children: ReactNode }) {
  const isOpen: boolean = useSelector(selectBackdropStatus);

  return (
    <>
      <div className={styles.container}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isOpen}
        >
          <CircularProgress color="secondary" style={{ color: "#2196F3" }} />
        </Backdrop>
      </div>
      {children}
    </>
  );
}
