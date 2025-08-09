import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./TicketDetails.module.scss";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { setError, setSuccess } from "../../../store/error/error.action";
import { TicketType, attachmentType, commentType } from "../../../types";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DoneIcon from "@mui/icons-material/Done";
import { authPost } from "../../../axios/useAuthPost";
import { capitalizeFirstLetter } from "../../../utility/global";
import RefreshIcon from "@mui/icons-material/Refresh";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseTicketDialog from "./CloseTicketDialog";
import { ticketStatus } from "../../../utility/role";
// interface TicketListProps {
//   tickets: TicketType[] | null;
// }
interface TicketHandlerType {
  firstName: string;
  id: number;
  lastName: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
// const initialState: TicketListProps = {
//   tickets: null,
// };
const getIconForMessage = (status: number) => {
  return (
    <>
      {status == 1 && <HourglassBottomIcon color="warning" />}
      {status == 0 && <PriorityHighIcon color="error" />}
      {status == 2 && <DoneIcon color="primary" />}
    </>
  );
};

const TicketDetails: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [status, setStatus] = useState("");
  const [assigned, setAssigned] = useState<number>(0);
  const [priority, setPriority] = useState("");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [subject, setSubject] = useState("");
  // const [ticketsListData, setTicketsListData] =
  //   useState<TicketListProps>(initialState);
  const { id } = useParams();
  // const ticketId = id || "";
  const [comments, setComments] = React.useState<commentType[]>([]);
  const lastChildRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState<string>("");
  const [ticketDetail, setTicketDetail] = React.useState<TicketType | null>(
    null
  );
  const [ticketHandler, setTicketHandler] = React.useState<TicketHandlerType[]>(
    []
  );
  const [attachmentList, setAttachmentList] = React.useState<attachmentType[]>(
    []
  );
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const [openCloseDialog, setOpenCloseDialog] = React.useState(false);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };
  const getAllComments = async () => {
    const res = await authFetch(`ticket/${id}/comment`, user.token);
    // console.log("all comments", res);
    if (res.message == "success") {
      setComments(
        res.comments.map((el: commentType) => ({ ...el, sentStatus: 2 }))
      );
    }
    ////////Ticket handler list//////////////////////
    const res2 = await authFetch(`ticket/handlers`, user.token);
    // console.log("ressss2", res2);
    if (res2.message == "success") {
      setTicketHandler(res2.users);
    }
  };
  const getTicketDetails = async () => {
    const res = await authFetch(`ticket/${id}`, user.token);
    // console.log("resss", res);
    if (res.message == "success") {
      setTicketDetail(res.ticket);
    }
  };

  const getAllAttachments = async () => {
    const res = await authFetch(
      `attachment/tickets/${user.hospitalID}/${ticketDetail?.id}`,
      user.token
    );
    // console.log("resssss from attachemnt", res);
    if (res.message == "success") {
      setAttachmentList(res.attachments);
    }
  };

  React.useEffect(() => {
    getAllComments();
    getTicketDetails();
  }, [user]);

  React.useEffect(() => {
    if (ticketDetail?.id) {
      getAllAttachments();
    }
  }, [ticketDetail]);

  React.useEffect(() => {
    const lastChild = lastChildRef.current?.lastElementChild as HTMLDivElement;
    lastChild?.scrollIntoView({ behavior: "smooth" });
  }, [comments, lastChildRef]);

  const sendText = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text) {
      const index: number = comments.length;
      setComments((prev) => {
        return [
          ...prev,
          {
            addedOn: String(new Date()),
            comment: text,
            id: 0,
            ticketID: 0,
            userID: user.id,
            firstName: "",
            lastName: "",
            sentStatus: 1,
          },
        ];
      });

      // console.log("all commenting", allComment);
      const res = await authPost(
        `ticket/${id}/comment`,
        { comment: text },
        user.token
      );
      setText("");
      // console.log("text resssss", res);
      if (res.message == "success") {
        console.log("");
        setComments((prev) => {
          prev[index].sentStatus = 2;
          return [...prev];
        });
      } else {
        setComments((prev) => {
          prev[index].sentStatus = 0;
          return [...prev];
        });
      }
    }
  };
  const debouncedSendText = debounce(sendText, DEBOUNCE_DELAY);
  useEffect(() => {
    if (ticketDetail) {
      setStatus(ticketDetail?.status.toString());
      setPriority(ticketDetail?.priority.toString());
      setName(ticketDetail?.hospitalName);
      setDueDate(formatDate(ticketDetail?.dueDate));
      setSubject(ticketDetail?.subject);
      setAssigned(ticketDetail?.assignedID);
    }
  }, [ticketDetail]);

  const handleStatusChange = async (
    event: SelectChangeEvent | "",
    status_change = ""
  ) => {
    const newStatus = event ? String(event?.target?.value) : status_change;
    console.log("new status", newStatus);
    if (newStatus === status) {
      // dispatch(setSuccess("Ticket is already in the selected status."));
      return;
    }

    try {
      const response = await authPatch(
        `ticket/${id}/status`,
        { status: parseInt(newStatus) },
        user.token
      );
      if (response && response.message === "success") {
        setStatus(newStatus);
        dispatch(setSuccess("Status Updated Successfully"));
      } else {
        console.error("Invalid API response:", response);
        dispatch(setError("Failed to update status. Please try again later."));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      dispatch(setError("Failed to update status. Please try again later."));
    }
  };

  const handlePriorityChange = async (event: SelectChangeEvent) => {
    const newPriority = event.target.value as string;
    if (newPriority === priority) {
      // dispatch(setSuccess("Priority is already in the selected status."));
      return;
    }

    try {
      const response = await authPatch(
        `ticket/${id}/priority`,
        { priority: parseInt(newPriority) },
        user.token
      );
      // console.log("priority is:", response);
      if (response && response.message === "success") {
        setPriority(newPriority);
        dispatch(setSuccess("Priority Updated Successfully"));
      } else {
        console.error("Invalid API response:", response);
        dispatch(
          setError("Failed to update priority. Please try again later.")
        );
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      dispatch(setError("Failed to update priority. Please try again later."));
    }
  };

  function formatDate(date: string) {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear().toString().padStart(4, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const handleDueDateChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDueDate = event.target.value as string;

    if (newDueDate === dueDate) {
      dispatch(setSuccess("Due Date is already selected."));
      return;
    }
    try {
      const response = await authPatch(
        `ticket/${id}/dueDate`,
        { dueDate: newDueDate },
        user.token
      );

      if (response && response.message === "success") {
        setDueDate(formatDate(newDueDate));
        dispatch(setSuccess("Due Date Updated Successfully"));
      } else {
        console.error("Invalid API response:", response);
        dispatch(
          setError("Failed to update due date. Please try again later.")
        );
      }
    } catch (error) {
      console.error("Error updating due date:", error);
      dispatch(setError("Failed to update due date. Please try again later."));
    }
  };

  async function handleAssignedChange(event: SelectChangeEvent) {
    const res = await authPatch(
      `ticket/${id}/assign`,
      { assignedID: event.target.value },
      user.token
    );
    if (res.message == "success") {
      setAssigned(Number(event.target.value));
      dispatch(setSuccess("Ticket successfully assigned"));
    } else {
      dispatch(setError(res.message));
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_ticketdetailsTop}>
          <IconButton aria-label="delete" onClick={() => navigate("../.")}>
            <ArrowBackIosIcon />
          </IconButton>
          <h3
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Ticket Detail
            {ticketDetail?.status == ticketStatus.Closed ? (
              ""
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setOpenCloseDialog(true);
                }}
              >
                Change Status
              </Button>
            )}
          </h3>
          <h3> Ticket ID: {id}</h3>
        </div>

        <div className={styles.container_ticketdetailsRight}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              // border: "1px solid black",
              // height: "auto",
              padding: "50px",
            }}
          >
            <b>Hospital Name: {name || "NA"}</b>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={status}
                onChange={(event) => handleStatusChange(event)}
                disabled
              >
                <MenuItem value="0">Open</MenuItem>
                <MenuItem value="1">Paused</MenuItem>
                <MenuItem value="2">Closed</MenuItem>
              </Select>
            </FormControl>
            {/* <FormControl> */}
            {/* <img
                src={ylogo}
                alt=""
                className={styles.profile}
                style={{ borderColor: "lightblue" }}
              /> */}
            {/* <InputLabel sx={{ marginLeft: "28%" }}> */}

            {/* <br /> */}
            {/* <b>Hospital Id:</b> {} */}
            {/* </InputLabel> */}
            {/* </FormControl> */}
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                label="Assigned To"
                value={String(assigned)}
                onChange={handleAssignedChange}
              >
                {ticketHandler.map((el) => {
                  return (
                    <MenuItem value={el.id}>
                      {capitalizeFirstLetter(el.firstName) +
                        " " +
                        capitalizeFirstLetter(el.lastName)}
                    </MenuItem>
                  );
                })}
                {/* <MenuItem value="Smith">Smith</MenuItem>
                <MenuItem value="Joy">Joy</MenuItem> */}
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                value={priority}
                onChange={handlePriorityChange}
              >
                <MenuItem value="0">Low</MenuItem>
                <MenuItem value="1">Medium</MenuItem>
                <MenuItem value="2">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth>
              <TextField
                label="Due Date"
                type="date"
                value={dueDate ? formatDate(dueDate) : ""}
                onChange={handleDueDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <FormControl>
              <InputLabel>
                {/* <b>Request time:</b> 10:45 AM <br /> */}
                {/* <br /> */}
                <b>Notes:</b> {subject}
              </InputLabel>
            </FormControl>
          </div>
          <div className={styles.imageContainer}>
            <div className={styles.icon}>
              <IconButton onClick={() => getAllAttachments()}>
                <RefreshIcon />
              </IconButton>
            </div>
            <div className={styles.images}>
              {attachmentList.map((attachment) => (
                <img
                  src={attachment.fileURL}
                  onClick={() => openImageModal(attachment.fileURL)}
                />
              ))}
            </div>
          </div>
        </div>
        <div
          className={styles.container_ticketdetailsBottom}
          style={{ border: "1px solid black" }}
        >
          <div className={styles.chatContainer} ref={lastChildRef}>
            {comments.length
              ? comments.map((comment) => {
                  return (
                    <div
                      className={
                        comment.userID == user.id
                          ? styles.chatMessage + " " + styles.chat_outgoing
                          : styles.chatMessage + " " + styles.chat_incoming
                      }
                    >
                      <div className={styles.messageText}>
                        <div className="">
                          {" "}
                          {comment.userID == user.id
                            ? "~You"
                            : comment.firstName
                            ? "~" +
                              capitalizeFirstLetter(comment.firstName) +
                              " " +
                              capitalizeFirstLetter(comment.lastName)
                            : "~Unknown"}
                        </div>
                        <div className={styles.big_text}>
                          {" "}
                          {comment.comment}
                        </div>
                      </div>
                      <div className={styles.messageTime}>
                        {new Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          day: "2-digit",
                          month: "short",
                          hour12: true,
                        }).format(new Date(comment.addedOn))}

                        {comment.userID == user.id ? (
                          <div>{getIconForMessage(comment.sentStatus)}</div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })
              : "Start conversation!"}
          </div>
          <form
            className={styles.chatInputContainer}
            onSubmit={(e) => {
              e.preventDefault();
              debouncedSendText(e);
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              className={styles.chatInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setText(event.target.value);
              }}
              value={text}
            />
            <button className={styles.sendButton} type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
      <Modal
        open={selectedImage ? true : false}
        onClose={closeImageModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <img
            src={selectedImage || ""}
            alt=""
            style={{ objectFit: "contain", height: "400px", width: "600px" }}
          />
        </Box>
      </Modal>
      {openCloseDialog ? (
        <CloseTicketDialog
          open={openCloseDialog}
          setOpen={setOpenCloseDialog}
          id={ticketDetail?.id || 0}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default TicketDetails;
