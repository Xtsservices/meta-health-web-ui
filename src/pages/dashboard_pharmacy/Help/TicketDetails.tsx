import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ticketDetails.module.scss";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RefreshIcon from "@mui/icons-material/Refresh";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { attachmentType, commentType, TicketType } from "../../../types";
import { priorityDict, statusDict } from "../../../utility/role";
import { capitalizeFirstLetter, formatDate2 } from "../../../utility/global";

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

const TicketDetailStaff: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [comments] = React.useState<commentType[]>([]);
  const lastChildRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState<string>("");
  const [ticketDetail] = React.useState<TicketType | null>(null);
  const [attachmentList] = React.useState<attachmentType[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };
  // const [files, setFiles] = React.useState<File[]>([]);

  const sendText = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    const lastChild = lastChildRef.current?.lastElementChild as HTMLDivElement;
    lastChild?.scrollIntoView({ behavior: "smooth" });
  }, [comments, lastChildRef]);

  function submitNewFiles(_e: React.ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

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

      <div className={styles.imageContainer}>
        <div className={styles.icon}>
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </div>
        <div className={styles.images}>
          {attachmentList.map((attachment) => (
            <img
              src={attachment.fileURL}
              alt=""
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
                  <div>
                    <div className={styles.messageText}>
                      <div className=""></div>
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
              ticketDetail?.status === 2
                ? "Ticket closed"
                : "Type your message..."
            }
            className={styles.chatInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
            value={text}
            disabled={ticketDetail?.status === 2}
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
