import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TicketDetails.module.scss";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import ylogo from "./../../../../src/assets/cross_logo.png";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import { authFetch } from "../../../axios/useAuthFetch";
// import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import { selectCurrentUser } from "../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { TicketType, attachmentType, commentType } from "../../types";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DoneIcon from "@mui/icons-material/Done";
import { capitalizeFirstLetter, formatDate2 } from "../../utility/global";
import { priorityDict, statusDict } from "../../utility/role";
import RefreshIcon from "@mui/icons-material/Refresh";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { authPost } from "../../axios/useAuthPost";
import { setError } from "../../store/error/error.action";

//////////Message status code/////////////////////
// {
//   sent:2,
//   sending:1,
//   notSent:0

// }
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
const getIconForMessage = (status: number) => {
  return (
    <>
      {status == 1 && <HourglassBottomIcon color="warning" />}
      {status == 0 && <PriorityHighIcon color="error" />}
      {status == 2 && <DoneIcon color="primary" />}
    </>
  );
};

const TicketDetailStaff: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const user = useSelector(selectCurrentUser);
  const [comments, setComments] = React.useState<commentType[]>([]);
  const lastChildRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState<string>("");
  const [ticketDetail, setTicketDetail] = React.useState<TicketType | null>(
    null
  );
  const [attachmentList, setAttachmentList] = React.useState<attachmentType[]>(
    []
  );
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };
  // const [files, setFiles] = React.useState<File[]>([]);
  const dispatch = useDispatch();
  const getAllComments = async () => {
    const res = await authFetch(
      `ticket/hospital/${user.hospitalID}/${ticketId}/comment`,
      user.token
    );
    if (res.message == "success") {
      setComments(
        res.comments.map((el: commentType) => ({ ...el, sentStatus: 2 }))
      );
    }
  };

  const getTicketDetails = async () => {
    const res = await authFetch(
      `ticket/hospital/${user.hospitalID}/${ticketId}`,
      user.token
    );
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
        `ticket/hospital/${user.hospitalID}/${ticketId}/comment`,
        { comment: text },
        user.token
      );
      setText("");
      // console.log("text resssss", res);
      if (res.message == "success") {
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

  React.useEffect(() => {
    const lastChild = lastChildRef.current?.lastElementChild as HTMLDivElement;
    lastChild?.scrollIntoView({ behavior: "smooth" });
  }, [comments, lastChildRef]);

  const submitNewFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("function called");
    const formData = new FormData();
    [...(e.target.files ?? [])].forEach((file: File) => {
      formData.append("files", file);
    });
    const attachmentRes = await authPost(
      `attachment/tickets/${user.hospitalID}/${ticketDetail?.id}`,
      formData,
      user.token
    );
    // console.log("responseeeee", attachmentRes);
    if (attachmentRes.message == "success") {
      setAttachmentList((prev) => [...prev, ...attachmentRes.attachements]);
    } else {
      dispatch(setError(attachmentRes.message));
    }
    // setFiles((prev) => [...prev, ...(e.target.files ?? [])])
  };
  // console.log("attachments", attachmentList);
  return (
    <div className={styles.container}>
      <div className={styles.container_ticketdetailsTop}>
        <IconButton onClick={() => navigate("./..")}>
          <ArrowBackIosIcon />
        </IconButton>
        <h2>Ticket Detail</h2>
        <p>
          <span style={{ fontWeight: 600 }}>Subject:</span>{" "}
          {ticketDetail?.subject}
        </p>
        <div className={styles.detail}>
          <div className={styles.left}>
            <p>Ticket ID: {ticketId}</p>
            <p>
              Status: {ticketDetail ? statusDict[ticketDetail?.status] : ""}
            </p>
            <p>
              Due Date:{" "}
              {ticketDetail?.dueDate
                ? formatDate2(ticketDetail.dueDate)
                : "Not assigned"}
            </p>
          </div>
          <div className={styles.right}>
            <p>
              Assigned To:{" "}
              {ticketDetail
                ? capitalizeFirstLetter(ticketDetail?.assignedName) ||
                  "Not assigned yet"
                : ""}
            </p>
            <p>
              Priority:{" "}
              {ticketDetail ? priorityDict[ticketDetail?.priority] : ""}
            </p>
          </div>
        </div>
      </div>

      {/* <div className={styles.container_ticketdetailsRight}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
            border: "1px solid black",
            height: "92%",
            padding: "30px",
          }}
        >
          <FormControl>
            <InputLabel>
              <b>Status:</b> Open
            </InputLabel>
          </FormControl> */}
      {/* <FormControl></FormControl> */}
      {/* <img src={ylogo} alt="" className={styles.profile} /> */}

      {/* <FormControl> */}
      {/* <InputLabel> */}
      {/* <b>Hospital Name:</b> Apollo Hospital */}
      {/* </InputLabel> */}
      {/* </FormControl> */}
      {/* <FormControl>
            <InputLabel>
              <b>Hospital Id:</b> {user.hospitalID}
            </InputLabel>
          </FormControl> */}

      {/* <FormControl>
            <InputLabel>
              <b>Assigned To:</b> Sid
            </InputLabel>
          </FormControl>
          <FormControl>
            <InputLabel>
              <b>Priority:</b> High
            </InputLabel>
          </FormControl>
          <FormControl>
            <InputLabel>
              <b>Request time:</b> 10:45 AM
            </InputLabel>
          </FormControl>
          <FormControl>
            <InputLabel>
              <b>Due Date:</b> 10/09/2023
            </InputLabel>
          </FormControl>
        </div>
      </div> */}
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
          <div className={styles.fileInputContainer}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                // setFiles((prev) => [...prev, ...(e.target.files ?? [])])
                submitNewFiles(e)
              }
              className={styles.fileInput}
              style={{ display: "none" }}
              id="fileInput"
            />
            <label htmlFor="fileInput">+</label>
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
                      <div className={styles.big_text}> {comment.comment}</div>
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
        <form className={styles.chatInputContainer} onSubmit={sendText}>
          <input
            type="text"
            placeholder={
              ticketDetail?.status == 2
                ? "Ticket closed"
                : "Type your message..."
            }
            className={styles.chatInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
            value={text}
            disabled={ticketDetail?.status == 2}
          />
          <button
            className={styles.sendButton}
            type="submit"
            // disabled={ticketDetail?.status == 2}
          >
            Send
          </button>
        </form>
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
    </div>
  );
};

export default TicketDetailStaff;
