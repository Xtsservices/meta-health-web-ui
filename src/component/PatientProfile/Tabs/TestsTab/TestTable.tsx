import React, { useState, useEffect } from "react";
import styles from "./SymptompsTable.module.scss";
import { testType } from "../../../../types";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { authDelete } from "../../../../axios/authDelete";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import { TransitionProps } from "@mui/material/transitions";
import AddedBy from "../../../DailogBoxs/AddedBy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { authPost } from "../../../../axios/useAuthPost";
import { setError } from "../../../../store/error/error.action";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type RowType = {
  test: string;
  code: number | null;
  id: number;
  userID: number | null;
  addedOn: string | null;
  loinc_num_: string;
  category: string;
  status: string;
};

function createData(
  test: string,
  code: number | null,
  addedOn: string | null,
  userID: number | null,
  id: number,
  loinc_num_: string,
  category: string,
  status: string
): RowType {
  return { test, code, addedOn, userID, id, loinc_num_, category, status };
}

type TestsTableProps = {
  selectedList: testType[];
  setSelectedList: React.Dispatch<React.SetStateAction<testType[]>>;
  navigateToReports: () => void;
};

export default function TestsTable({
  selectedList,
  setSelectedList,
  navigateToReports,
}: TestsTableProps) {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [rows, setRows] = useState<RowType[]>([]);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<number>(0);
  const [showID, setShowID] = useState<number | null>(0);
  const [hoveredUserID, setHoveredUserID] = useState<number | null>(null);
  const [render, setRender] = React.useState<boolean>(false);
  const [anchorEls, setAnchorEls] = useState<
    Record<number, HTMLElement | null>
  >({});

  const dispatch = useDispatch();

  useEffect(() => {
    setRows(
      selectedList.map((test) => {
        return createData(
          test.test,
          test.id,
          test.addedOn,
          test.userID,
          test.id,
          test.loinc_num_,
          test.category,
          test.status
        );
      })
    );
  }, [selectedList]);

  const deleteTest = async (code: number) => {
    try {
      const response = await authDelete(
        `test/${timeline.id}/${code}`,
        user.token
      );
      if (response.message === "success") {
        setSelectedList((currentList) => {
          const newList = currentList.filter((el) => el.id !== code);
          return newList;
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    setAnchorEls((prev) => ({
      ...prev,
      [id]: event.currentTarget,
    }));
  };

  const handleMenuClose = (id: number) => {
    setAnchorEls((prev) => ({
      ...prev,
      [id]: null,
    }));
  };

  const handleRepeat = async (id: number) => {
    const testToRepeat = rows.find((row) => row.id === id);
    if (!testToRepeat || testToRepeat.status?.toLowerCase() !== "completed") {
      console.log("Test not completed or not found, cannot repeat.");
      return;
    }

    // Find the latest repeated test, and check if it's already been repeated
    const latestRepeatedTest = rows.find(
      (row) =>
        row.test === testToRepeat.test &&
        ["pending", "processing"].includes(row.status?.toLowerCase() || "")
    );

    // Check if the latest test is already a repeat
    if (latestRepeatedTest) {
      dispatch(
        setError(
          `Test "${testToRepeat.test}" has already been repeated with ID ${latestRepeatedTest.id}.`
        )
      );
      return;
    }

    try {
      const response = await authPost(
        `test/repeatTest/${user.hospitalID}/${timeline.id}/${id}`,
        {},
        user.token
      );
      console.log("handleRepeat", response);

      if (response.message === "success" && response.tests) {
        // Add the new test to the rows state
        const newTest = response.tests;

        // Update the rows state to include the newly added test
        setRows((prevRows) => {
          // Adding the new test and sorting the rows by addedOn date (you can customize this sorting logic if needed)
          const updatedRows = [
            ...prevRows,
            createData(
              newTest.test,
              newTest.id,
              newTest.addedOn,
              newTest.userID,
              newTest.id,
              newTest.loinc_num_,
              newTest.category,
              newTest.status
            ),
          ];

          //  sort by addedOn to ensure the newest test is displayed first
          return updatedRows.sort(compareDates);
        });

        handleMenuClose(id);
      }
    } catch (error) {
      console.error("Error repeating test:", error);
    }
  };

  return (
    <div className={styles.table}>
      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Lonic Code</th>
              <th>Test</th>
              <th>Department</th>
              <th>Time and Date</th>
              <th>Added By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.sort(compareDates).map((row, index) => {
              return (
                <tr key={row.code}>
                  <td>{index + 1}</td>
                  <td>{row.loinc_num_}</td>
                  <td>
                    {row.test.slice(0, 1).toUpperCase() +
                      row.test.slice(1).toLowerCase()}
                  </td>
                  <td>
                    {row?.category.charAt(0).toUpperCase() +
                      row.category.slice(1)}
                  </td>

                  <td>
                    {new Date(row.addedOn || "").toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                      month: "short",
                      year: "2-digit",
                      day: "numeric",
                    })}
                  </td>
                  <td
                    style={{
                      cursor: "pointer",
                      color: hoveredUserID === row.id ? "blue" : "initial",
                      fontWeight: hoveredUserID === row.id ? "bold" : "normal",
                    }}
                    onClick={() => {
                      setHoveredUserID(row.id || null);
                      setShowID(row.userID || 0);
                      setRender(!render);
                      setTimeout(() => {
                        setRender(true);
                      }, 100);
                    }}
                  >
                    {row.userID}
                  </td>
                  <td>
                    {row.status === "completed" ? (
                      <span
                        onClick={navigateToReports}
                        style={{ cursor: "pointer" }}
                      >
                        <VisibilityIcon />
                      </span>
                    ) : (
                      row.status // Display status if it's not 'completed'
                    )}
                  </td>
                  <td>
                    <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEls[row.id]}
                      open={Boolean(anchorEls[row.id])}
                      onClose={() => handleMenuClose(row.id)}
                    >
                      <MenuItem
                        onClick={() => handleRepeat(row.id)}
                        disabled={
                          row.status?.trim().toLowerCase() !== "completed"
                        } // Disable if not 'completed'
                      >
                        Repeat
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setCode(row.code || 1);
                          setOpen(true);
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        "No Test Added"
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Test"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure, you want to delete this test?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              deleteTest(code || 1);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {showID !== 0 && render && <AddedBy userID={showID} />}
    </div>
  );
}

function compareDates(a: RowType, b: RowType) {
  return (
    new Date(b.addedOn || "").valueOf() - new Date(a.addedOn || "").valueOf()
  );
}
