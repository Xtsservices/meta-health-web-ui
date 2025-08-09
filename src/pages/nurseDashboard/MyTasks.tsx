import React, { useEffect, useState } from "react";
import { Modal, Button, TextareaAutosize, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import { authPost } from "../../axios/useAuthPost";

interface Task {
  id: number;
  task: string;
  status: string;
}

const MyTasks: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTaskContent, setNewTaskContent] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await authFetch(
          "/admintasks/getadminalltasks",
          user.token
        );
        if (response.message === "success") {
          setTasks(response.alerts);
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };
    if (user.token) {
      fetchTasks();
    }
  }, [user]);

  const openEditModal = (task: Task): void => {
    setCurrentTask(task);
    setNewTaskContent(task.task);
    setStatus(task.status);
    setIsEditModalOpen(true);
  };

  const closeEditModal = (): void => {
    setIsEditModalOpen(false);
    setNewTaskContent("");
    setStatus("pending");
  };

  const openAddModal = (): void => {
    setCurrentTask(null);
    setNewTaskContent("");
    setStatus("pending");
    setIsAddModalOpen(true);
  };

  const closeAddModal = (): void => {
    setIsAddModalOpen(false);
  };

  const addTaskToDB = async (
    content: string,
    status: string
  ): Promise<void> => {
    try {
      const body = { userID: user.id, task: content, status };
      const response = await authPost(
        "/admintasks/addnewAdmintask",
        body,
        user.token
      );
      if (response.message === "success") {
        setTasks([...tasks, { id: response.id, task: content, status }]);
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
      const body = { task: content, status };
      const response = await authPost(
        `/admintasks/editAdmintask/${taskId}`,
        body,
        user.token
      );
      if (response.message === "success") {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, task: content, status } : task
          )
        );
      }
    } catch (error) {
      console.error("Failed to edit task", error);
    }
  };

  const deleteTaskFromDB = async (taskId: number): Promise<void> => {
    try {
      const response = await authPost(
        `/admintasks/deleteAdmintask/${taskId}`,
        {},
        user.token
      );
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
    closeEditModal();
    closeAddModal();
  };

  const deleteTask = async (taskId: number): Promise<void> => {
    await deleteTaskFromDB(taskId);
  };

  const truncateText = (text: string): string => {
    const maxLength = 80;
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const colors = [
    "#B2DFFC", // Light Blue
    "#F9B2B2", // Light Red
    "#FFD7A3", // Light Orange
    "#C4F2C0", // Light Green
    "#FFFACD", // Light Yellow
    "#E1C6F4", // Lavender
    "#A7E3E6", // Aqua
    "#FFECB3", // Soft Gold
    "#D3D3D3", // Light Grey
    "#FFCCF9", // Light Pink
  ];

  return (
    <div
      style={{
        padding: "16px",
        background: "#ffffff",
        marginTop: "3rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "15px",
        minHeight: "40vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>My Notes</h1>
        <IconButton
          onClick={openAddModal}
          sx={{
            backgroundColor: "#1977f3",
            marginLeft: "5px",
            marginTop: "8px",
            color: "white",
            "&:hover": {
              backgroundColor: "darkblue",
            },
          }}
        >
          <AddIcon sx={{ color: "white", fontSize: "1.5rem" }} />
        </IconButton>
      </div>

      {tasks?.length === 0 ? (
        <p
          style={{ textAlign: "center",margin:"6rem"}}
        >
          Please Add Notes!!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
          }}
        >
          {tasks.map((task, index) => (
            <div
              key={index}
              style={{
                backgroundColor: colors[index % colors.length],
                padding: "16px",
                borderRadius: "0px",
                height: "150px",
                display: "flex",
                flexDirection: "column",
                wordWrap: "break-word",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Display task time */}
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {/* Edit and Delete icons */}
                <div style={{ display: "flex" }}>
                  <IconButton>
                    <EditIcon onClick={() => openEditModal(task)} />
                    <DeleteIcon onClick={() => deleteTask(task.id)} />
                  </IconButton>
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
      )}

      <Modal open={isAddModalOpen} onClose={closeAddModal}>
        <div
          style={{
            padding: "20px",
            background: "#fff",
            margin: "10% auto",
            width: "50%",
            borderRadius: "8px",
          }}
        >
          <h3>Add Task</h3>
          <TextareaAutosize
            minRows={4}
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <Button
            onClick={saveTask}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Save
          </Button>
        </div>
      </Modal>

      <Modal open={isEditModalOpen} onClose={closeEditModal}>
        <div
          style={{
            padding: "20px",
            background: "#fff",
            margin: "10% auto",
            width: "50%",
            borderRadius: "8px",
          }}
        >
          <h3>Edit Task</h3>
          <TextareaAutosize
            minRows={4}
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <Button
            onClick={saveTask}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyTasks;
