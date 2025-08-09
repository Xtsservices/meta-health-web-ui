import React, { useEffect, useState } from 'react';
import { Modal, Button, TextareaAutosize, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import { authFetch } from '../../axios/useAuthFetch';
import { authPost } from '../../axios/useAuthPost';
import { debounce, DEBOUNCE_DELAY } from '../../utility/debounce';

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
    const [newTaskContent, setNewTaskContent] = useState<string>('');
    const [status, setStatus] = useState<string>('pending');

    // Fetch tasks on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await authFetch('/admintasks/getadminalltasks', user.token);
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
        setNewTaskContent('');
        setStatus('pending');
    };

    const openAddModal = (): void => {
        setCurrentTask(null);
        setNewTaskContent('');
        setStatus('pending');
        setIsAddModalOpen(true);
    };

    const closeAddModal = (): void => {
        setIsAddModalOpen(false);
    };

    const addTaskToDB = async (content: string, status: string): Promise<void> => {
        try {
            const body = { userID: user.id, task: content, status };
            const response = await authPost('/admintasks/addnewAdmintask', body, user.token);
            console.log("admintasks", response)
            if (response.message === "success") {
                setTasks([...tasks, { id: response.id, task: content, status }]);
            }
        } catch (error) {
            console.error("Failed to add task", error);
        }
    };
    const debouncedAddTaskToDB = debounce(addTaskToDB, DEBOUNCE_DELAY);

    const editTaskInDB = async (taskId: number, content: string, status: string): Promise<void> => {
        try {
            const body = { task: content, status };
            const response = await authPost(`/admintasks/editAdmintask/${taskId}`, body, user.token);
            if (response.message === "success") {
                setTasks(tasks.map(task => task.id === taskId ? { ...task, task: content, status } : task));
            }
        } catch (error) {
            console.error("Failed to edit task", error);
        }
    };
    const debouncedEditTaskInDB = debounce(editTaskInDB, DEBOUNCE_DELAY);

    const deleteTaskFromDB = async (taskId: number): Promise<void> => {
        try {
            const response = await authPost(`/admintasks/deleteAdmintask/${taskId}`, {}, user.token);
            if (response.message === "success") {
                setTasks(tasks.filter(task => task.id !== taskId));
            }
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };
    const debouncedDeleteTaskFromDB = debounce(deleteTaskFromDB, DEBOUNCE_DELAY);

    const saveTask = async (): Promise<void> => {
        if (currentTask) {
            await debouncedEditTaskInDB(currentTask.id, newTaskContent, status);
        } else {
            await debouncedAddTaskToDB(newTaskContent, status);
        }
        closeEditModal();
        closeAddModal();
    };

    const deleteTask = async (taskId: number): Promise<void> => {
        await debouncedDeleteTaskFromDB(taskId);
    };

    const truncateText = (text: string): string => {
        const maxLength = 30;
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <h1>My Tasks</h1>

                <IconButton
                    onClick={openAddModal}
                    sx={{
                        backgroundColor: '#1977f3',
                        marginLeft: '5px',
                        marginTop: '8px',
                        color: 'white',
                        width: '28px',
                        height: '28px',
                        '&:hover': {
                            backgroundColor: 'darkblue',
                        },
                    }}
                >
                    <AddIcon sx={{ color: 'white', fontSize: '1.5rem' }} /> {/* Increase the font size of the "+" icon */}
                </IconButton>
            </div>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {tasks.map((task) => (
                    <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>{truncateText(task.task)}</p>
                        <div>
                            <IconButton onClick={() => openEditModal(task)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => deleteTask(task.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={isAddModalOpen} onClose={closeAddModal}>
                <div style={{ padding: '20px', background: '#fff', margin: '10% auto', width: '50%', borderRadius: '8px' }}>
                    <h3>Add Task</h3>
                    <TextareaAutosize
                        minRows={4}
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    <Button onClick={saveTask} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                        Save
                    </Button>
                </div>
            </Modal>

            <Modal open={isEditModalOpen} onClose={closeEditModal}>
                <div style={{ padding: '20px', background: '#fff', margin: '10% auto', width: '50%', borderRadius: '8px' }}>
                    <h3>Edit Task</h3>
                    <TextareaAutosize
                        minRows={4}
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    <Button onClick={saveTask} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                        Save
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default MyTasks;
