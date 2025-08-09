import React, { useEffect, useState } from "react";
import { Modal, TextareaAutosize, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import { authPost } from "../../axios/useAuthPost";
import EditIcon2 from "../../assets/tabler_edit.png";
import radiologydashbaordDeleteButton from "../../assets/radiology/radiologydashbaordDeleteButton.png";
import taskPopupBanner from "../../assets/radiology/taskpopup_banner.png";
import no_sticky_notes from "../../assets/radiology/no_sticky_notes.png"

interface Task {
  id: number;
  task: string;
  status: string;
  addedon?: string;
  colour?: string;
}

const MyTasks: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTaskContent, setNewTaskContent] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const [selectColor, setSelectedColor] = useState<string>("#E1C6F4");

  const fetchTasks = async () => {
    try {
      const response = await authFetch("/admintasks/getadminalltasks", user.token);
      if (response.message === "success") {
        setTasks(response.alerts);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    if (user.token) {
      fetchTasks();
    }
  }, [user.token]);

  const openModal = (task: Task | null = null): void => {
    setCurrentTask(task);
    setNewTaskContent(task ? task.task : "");
    setStatus(task ? task.status : "pending");
    setSelectedColor(task ? task.colour || "#E1C6F4" : "#E1C6F4");
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setNewTaskContent("");
    setStatus("pending");
    setSelectedColor("#E1C6F4");
  };

  const addTaskToDB = async (content: string, status: string): Promise<void> => {
    try {
      const body = { userID: user.id, task: content, status, colour: selectColor };
      const response = await authPost("/admintasks/addnewAdmintask", body, user.token);
      if (response.message === "success") {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const editTaskInDB = async (
    taskId: number,
    content: string,
    status: string
  ): Promise<void> => {
    try {
      const body = { task: content, status,colour:selectColor };
      const response = await authPost(
        `/admintasks/editAdmintask/${taskId}`,
        body,
        user.token
      );
      if (response.message === "success") {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, task: content, status,colour:selectColor} : task
          )
        );
      }
    } catch (error) {
      console.error("Failed to edit task", error);
    }
  };

  const deleteTaskFromDB = async (taskId: number): Promise<void> => {
    try {
      const response = await authPost(`/admintasks/deleteAdmintask/${taskId}`, {}, user.token);
      if (response.message === "success") {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const saveTask = async (): Promise<void> => {
    if (currentTask) {
      await editTaskInDB(currentTask.id, newTaskContent, status);
    } else {
      await addTaskToDB(newTaskContent, status);
    }
    closeModal();
  };

  const deleteTask = async (taskId: number): Promise<void> => {
    await deleteTaskFromDB(taskId);
  };

  const truncateText = (text: string): string => {
    const maxLength = 80;
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const colors = ["#BAE9FF", "#FFC8DD", "#E2FFD2", "#BBA0FF", "#FAFAA0", "#B0BDFF", "#D9D9D9","#FDBB98"];
  const color = ["#094865", "#cd6420", "#BB3307", "#2A1E1A", "#a59b04", "#9711f6", "#04a9b1", "#a98005", "#525151", "#B11450"];

  const formatedDateTest = (dateString: string) => {
    const date = new Date(dateString);
    const utcOffsetTime = 5.5 * 60 * 60 * 1000;
    const correctedTime = new Date(date.getTime() + utcOffsetTime);
    return correctedTime.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "#ffffff",
        boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "26px",
        minHeight: "50vh",
        height: "100%",
        margin: "25px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "60px",
        }}
      >
        <h1 style={{ display: "flex", gap: "20px", fontWeight: "500" }}>
          <div style={{ fontWeight: 600, fontSize: "20px" }}>My Notes</div>
          <img src={EditIcon2} alt="" />
        </h1>
        <IconButton
          onClick={() => openModal(null)}
          sx={{
            backgroundColor: "#1977F3",
            marginLeft: "5px",
            marginTop: "8px",
            color: "white",
            "&:hover": {
              backgroundColor: "#0c5eca",
            },
          }}
        >
          <AddIcon sx={{ color: "white", fontSize: "1.5rem" }} />
        </IconButton>
      </div>

      {tasks?.length === 0 ? (
        <div style = {{display:"flex", flexDirection:"column",alignItems:"center"}}>
          <img src = {no_sticky_notes} alt = "no Notes Added illustration" style ={{width:"200px"}} />
          <p style={{ textAlign: "center", margin: "1rem", color:"#9B9B9B", fontStyle:"italic", fontWeight:"400" }}>Nothing here yet! Start fresh by jotting down your thoughts or adding a new note</p>
        </div>
      ) : (
        <div
          style={{
            width: "75vw",
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: "10px",
            scrollbarWidth: "thin",
            display: "flex",
            height: "390px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(2, 1fr)",
              gridAutoColumns: "minmax(250px, 1fr)",
              gap: "20px",
              maxHeight: "400px",
              alignContent: "flex-start",
            }}
          >
            {tasks.map((task, index) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: task.colour ? task.colour : "#fc7ac9",
                  padding: "10px",
                  height: "170px",
                  minWidth: "250px",
                  display: "flex",
                  flexDirection: "column",
                  wordWrap: "break-word",
                  overflow: "auto",
                  flex: "0 0 250px",
                  maxWidth: "250px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: color[index % color.length] }}>
                    {task.addedon ? formatedDateTest(task.addedon) : ""}
                  </div>
                  <div style={{ display: "flex" }}>
                    <div>
                      <EditIcon sx={{ width: "20px", marginRight: "10px", cursor: "pointer" }} onClick={() => openModal(task)} />
                      <img src={radiologydashbaordDeleteButton} style={{ width: "18px", cursor: "pointer" }} onClick={() => deleteTask(task.id)} />
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    margin: "8px 0",
                    color: "#333",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                  }}
                >
                  {truncateText(task.task)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={isModalOpen} onClose={closeModal}>
        <div
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "12px",
            margin: "10% auto",
            width: "45%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <h3 style={{ textAlign: "center" }}>{currentTask ? "Edit Note" : "My Notes"}</h3>
          <div style={{ display: "flex", padding: "10px", alignItems: "center" }}>
            <span>Select Colour</span>
            {colors.map((color, index) => (
              <button
                key={index}
                style={{
                  background: color,
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  margin: "2px",
                  border: selectColor === color ? "2px solid #1C5E7D" : "none",
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <img src={taskPopupBanner} alt="task pop up banner" style={{ width: "135px", position: "absolute", right: 0, zIndex: 0 }} />
          <TextareaAutosize 
            placeholder="Note"
            name = "Note"
            minRows={5}
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            style={{ width: "100%", padding: "8px", background: "#ffffff", zIndex: 5, outline:"none", borderRadius:"6px", height:"200px" }}
          />
          <div style={{ display: "flex", alignSelf: "flex-end", marginTop: "10px" }}>
            <button style={{ width: "120px", height: "40px", border: "none", background: "transparent", cursor:"pointer", fontSize:"15px" }} onClick={closeModal}>
              Cancel
            </button>
            <button
              onClick={saveTask}
              style={{ background: "#1977F3", height: "40px", width: "120px", color: "#ffffff", borderRadius: "4px", border: "none", cursor:"pointer", fontSize:"15px" }}
            >
              {currentTask ? "Save" : "Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyTasks;