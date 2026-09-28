import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import Header from "./Header";
import API_URL from "../store/api";
import useAuth from "../store/useAuth";

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  background: rgb(255, 255, 255);
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
`;

const Content = styled.div`
  padding: 28px;
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  margin: 0 0 5px;
  font-size: 24px;
  color: #1a1a1a;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #888;
  font-size: 13px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  border: none;
  background: #ff6b1a;
  color: white;
  padding: 10px 15px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e85f13;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #ececec;
  margin-bottom: 22px;
  overflow-x: auto;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  padding: 10px 2px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "#ff6b1a" : "#9a9a9a")};
  border-bottom: 2px solid ${({ $active }) => ($active ? "#ff6b1a" : "transparent")};

  &:hover {
    color: ${({ $active }) => ($active ? "#ff6b1a" : "#555")};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 18px;
  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`;

const PriorityBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 5px 9px;
  border-radius: 20px;
  white-space: nowrap;
  color: ${({ $tone }) =>
    $tone === "urgent" ? "#e0433a" : $tone === "medium" ? "#c9781a" : "#6a4fd9"};
  background: ${({ $tone }) =>
    $tone === "urgent" ? "#fbe6e5" : $tone === "medium" ? "#fbedd9" : "#ece8fb"};
`;

const CompleteButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ $done }) => ($done ? "#1a9c5c" : "#c5c5c5")};
  cursor: pointer;
  display: flex;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    color: #1a9c5c;
  }

  svg {
    font-size: 22px;
  }
`;

const TaskTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 15px;
  color: #222;
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  opacity: ${({ $done }) => ($done ? 0.55 : 1)};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 11px;

  svg {
    font-size: 14px;
  }
`;

const ProjectTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #6a6a6a;
  background: #f5f5f5;
  padding: 4px 9px;
  border-radius: 20px;
  white-space: nowrap;
`;

const State = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 18px;
  padding: 24px 26px;
  box-sizing: border-box;
`;

const ModalTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #9a9a9a;
  cursor: pointer;
  display: flex;

  &:hover {
    color: #222;
  }
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
`;

const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

const inputStyle = `
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  background: white;

  &:focus {
    border-color: #ff6b1a;
  }
`;

const TextInput = styled.input`
  ${inputStyle}
`;

const Select = styled.select`
  ${inputStyle}
  color: ${({ value }) => (value ? "#1a1a1a" : "#999")};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
`;

const CancelButton = styled.button`
  border: 1px solid #e2e2e2;
  background: white;
  color: #555;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: #ff6b1a;
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #e85f13;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function initials(name) {
  if (!name) return "U";
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").toUpperCase().slice(0, 2);
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() > today.getTime() && !isToday(dateStr);
}

function formatProjectDate(dateStr) {
  if (!dateStr) return "No date";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "No date";
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (isToday(dateStr)) return `Today, ${formattedDate}`;
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function formatPriority(priority) {
  const map = { LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent" };
  return map[priority] || "No priority";
}

function priorityTone(priority) {
  if (priority === "URGENT" || priority === "HIGH") return "urgent";
  if (priority === "MEDIUM") return "medium";
  return "progress";
}

function getArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

const TABS = [
  { key: "all", label: "All Task" },
  { key: "today", label: "Due Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

const emptyForm = {
  title: "",
  projectId: "",
  priority: "",
  dueDate: "",
};

function Tasks() {
  const navigate = useNavigate();
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const loadTasks = () => {
    if (!token || !user?.id) return;

    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/api/tasks?assignedTo=${user.id}`, { headers }),
      fetch(`${API_URL}/api/projects`, { headers }),
    ])
      .then(async ([tasksRes, projectsRes]) => {
        const tasksJson = await tasksRes.json();
        const projectsJson = await projectsRes.json();
        setTasks(getArray(tasksJson));
        setProjects(getArray(projectsJson));
      })
      .catch(() => toast.error("Failed to load tasks"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.id]);

  const findProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "No project";
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "today") return isToday(task.dueDate);
    if (activeTab === "upcoming") return isUpcoming(task.dueDate);
    if (activeTab === "completed") return task.status === "DONE";
    return true;
  });

  const toggleComplete = async (task) => {
    const nextStatus = task.status === "DONE" ? "TODO" : "DONE";

    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));

    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) throw new Error();
    } catch {
      toast.error("Failed to update task");
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
    }
  };

  const openModal = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Task name is required");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          priority: form.priority || undefined,
          dueDate: form.dueDate || undefined,
          projectId: form.projectId || undefined,
          assignedTo: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to create task");
        return;
      }

      const createdTask = result.data ?? result;
      setTasks((prev) => [createdTask, ...prev]);
      toast.success("Task created");
      setModalOpen(false);
    } catch {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <Sidebar />

      <Main>
        <Header />

        <Content>
          <Top>
            <div>
              <Title>My Tasks</Title>
              <Subtitle>All tasks assigned to you</Subtitle>
            </div>

            <AddButton type="button" onClick={openModal}>
              <AddIcon fontSize="small" />
              Add Task
            </AddButton>
          </Top>

          <Tabs>
            {TABS.map((tab) => (
              <Tab key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </Tab>
            ))}
          </Tabs>

          {loading ? (
            <State>
              <CircularProgress sx={{ color: "#ff751f" }} fontSize="medium" />
            </State>
          ) : filteredTasks.length === 0 ? (
            <State>No tasks found</State>
          ) : (
            <Grid>
              {filteredTasks.map((task) => (
                <Card key={task.id}>
                  <CardTop>
                    <CompleteButton
                      type="button"
                      $done={task.status === "DONE"}
                      onClick={() => toggleComplete(task)}
                    >
                      <CheckCircleOutlineIcon />
                    </CompleteButton>

                    {task.priority && (
                      <PriorityBadge $tone={priorityTone(task.priority)}>
                        {formatPriority(task.priority)}
                      </PriorityBadge>
                    )}
                  </CardTop>

                  <TaskTitle $done={task.status === "DONE"}>{task.title}</TaskTitle>

                  <InfoRow>
                    <Info>
                      <CalendarTodayOutlinedIcon />
                      {formatProjectDate(task.dueDate)}
                    </Info>

                    {task.projectId && (
                      <ProjectTag onClick={() => navigate(`/projects/${task.projectId}`)} style={{ cursor: "pointer" }}>
                        {findProjectName(task.projectId)}
                      </ProjectTag>
                    )}
                  </InfoRow>
                </Card>
              ))}
            </Grid>
          )}
        </Content>
      </Main>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTopRow>
              <ModalTitle>Add Task</ModalTitle>
              <CloseButton type="button" onClick={() => setModalOpen(false)}>
                <CloseIcon />
              </CloseButton>
            </ModalTopRow>

            <form onSubmit={handleCreateTask}>
              <FieldGroup>
                <FieldLabel>Task Name</FieldLabel>
                <TextInput
                  placeholder="Type the task name"
                  value={form.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Project (optional)</FieldLabel>
                <Select value={form.projectId} onChange={(e) => handleFieldChange("projectId", e.target.value)}>
                  <option value="">No project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </FieldGroup>

              <Row>
                <FieldGroup>
                  <FieldLabel>Priority</FieldLabel>
                  <Select value={form.priority} onChange={(e) => handleFieldChange("priority", e.target.value)}>
                    <option value="">Add priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </Select>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Due Date</FieldLabel>
                  <TextInput
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                  />
                </FieldGroup>
              </Row>

              <ModalFooter>
                <CancelButton type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </CancelButton>

                <SubmitButton type="submit" disabled={creating}>
                  {creating ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Create Task"}
                </SubmitButton>
              </ModalFooter>
            </form>
          </ModalBox>
        </ModalOverlay>
      )}
    </Layout>
  );
}

export default Tasks;
