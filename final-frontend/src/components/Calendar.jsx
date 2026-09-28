import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavButton = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid #ececec;
  background: white;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;

  &:hover {
    background: #f7f7f6;
  }
`;

const PeriodLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  min-width: 150px;
`;

const ModeTabs = styled.div`
  display: flex;
  gap: 4px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 10px;
`;

const ModeTab = styled.button`
  border: none;
  background: ${({ $active }) => ($active ? "#ff6b1a" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#777")};
  font-size: 12px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 7px;
  cursor: pointer;

  &:hover {
    color: ${({ $active }) => ($active ? "white" : "#333")};
  }
`;

const MonthGrid = styled.div`
  border: 1px solid #ececec;
  border-radius: 16px;
  overflow: hidden;
`;

const WeekdaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #fafafa;
`;

const WeekdayCell = styled.div`
  padding: 10px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #9a9a9a;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayCell = styled.div`
  min-height: 100px;
  padding: 8px;
  border-top: 1px solid #f2f2f2;
  border-left: 1px solid #f2f2f2;
  box-sizing: border-box;
  opacity: ${({ $muted }) => ($muted ? 0.4 : 1)};

  &:nth-child(7n + 1) {
    border-left: none;
  }
`;

const DayNumber = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $isToday }) => ($isToday ? "#ff6b1a" : "#444")};
  margin-bottom: 6px;
`;

const TaskChip = styled.div`
  font-size: 10px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 6px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: ${({ $tone }) =>
    $tone === "urgent" ? "#e0433a" : $tone === "medium" ? "#c9781a" : "#6a4fd9"};
  background: ${({ $tone }) =>
    $tone === "urgent" ? "#fbe6e5" : $tone === "medium" ? "#fbedd9" : "#ece8fb"};
`;

const MoreLabel = styled.div`
  font-size: 10px;
  color: #9a9a9a;
  padding: 2px 7px;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DayGroup = styled.div`
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 16px;
`;

const DayGroupTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 14px;
  color: #1a1a1a;
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fafafa;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;

const TaskRowTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #222;
`;

const PriorityBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 20px;
  white-space: nowrap;
  color: ${({ $tone }) =>
    $tone === "urgent" ? "#e0433a" : $tone === "medium" ? "#c9781a" : "#6a4fd9"};
  background: ${({ $tone }) =>
    $tone === "urgent" ? "#fbe6e5" : $tone === "medium" ? "#fbedd9" : "#ece8fb"};
`;

const State = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

function priorityTone(priority) {
  if (priority === "URGENT" || priority === "HIGH") return "urgent";
  if (priority === "MEDIUM") return "medium";
  return "progress";
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthCells(referenceDate) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();

  const cells = [];
  const start = new Date(year, month, 1 - startOffset);

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(start);
    cellDate.setDate(start.getDate() + i);
    cells.push(cellDate);
  }

  return cells;
}

function Calendar() {
  const navigate = useNavigate();
  const token = useAuth((state) => state.token);

  const [mode, setMode] = useState("month");
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    let url = "";
    if (mode === "month") {
      url = `${API_URL}/api/calendar/month?year=${referenceDate.getFullYear()}&month=${
        referenceDate.getMonth() + 1
      }`;
    } else if (mode === "week") {
      url = `${API_URL}/api/calendar/week?date=${formatDate(referenceDate)}`;
    } else {
      url = `${API_URL}/api/calendar/day?date=${formatDate(referenceDate)}`;
    }

    fetch(url, { headers })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error();
        const payload = result.data ?? result;
        setTasks(payload?.tasks ?? []);
      })
      .catch(() => toast.error("Failed to load calendar"))
      .finally(() => setLoading(false));
  }, [token, mode, referenceDate]);

  const goPrev = () => {
    const next = new Date(referenceDate);
    if (mode === "month") next.setMonth(next.getMonth() - 1);
    else if (mode === "week") next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setReferenceDate(next);
  };

  const goNext = () => {
    const next = new Date(referenceDate);
    if (mode === "month") next.setMonth(next.getMonth() + 1);
    else if (mode === "week") next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setReferenceDate(next);
  };

  const handleTaskClick = (task) => {
    if (task.projectId) navigate(`/projects/${task.projectId}`);
  };

  const periodLabel =
    mode === "month"
      ? referenceDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : mode === "week"
      ? `Week of ${referenceDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : referenceDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  return (
    <Layout>
      <Sidebar />

      <Main>
        <Header />

        <Content>
          <Top>
            <div>
              <Title>Calendar</Title>
              <Subtitle>See your tasks based on their due dates</Subtitle>
            </div>
          </Top>

          <ControlsRow>
            <NavGroup>
              <NavButton type="button" onClick={goPrev}>
                <ChevronLeftIcon fontSize="small" />
              </NavButton>
              <PeriodLabel>{periodLabel}</PeriodLabel>
              <NavButton type="button" onClick={goNext}>
                <ChevronRightIcon fontSize="small" />
              </NavButton>
            </NavGroup>

            <ModeTabs>
              <ModeTab $active={mode === "month"} onClick={() => setMode("month")}>
                Monthly
              </ModeTab>
              <ModeTab $active={mode === "day"} onClick={() => setMode("day")}>
                Daily
              </ModeTab>
              <ModeTab $active={mode === "week"} onClick={() => setMode("week")}>
                Weekly
              </ModeTab>
            </ModeTabs>
          </ControlsRow>

          {loading ? (
            <State>
              <CircularProgress sx={{ color: "#ff751f" }} fontSize="medium" />
            </State>
          ) : mode === "month" ? (
            <MonthGrid>
              <WeekdaysRow>
                {weekdayLabels.map((label) => (
                  <WeekdayCell key={label}>{label}</WeekdayCell>
                ))}
              </WeekdaysRow>

              <DaysGrid>
                {buildMonthCells(referenceDate).map((cellDate) => {
                  const muted = cellDate.getMonth() !== referenceDate.getMonth();
                  const dayTasks = tasks.filter(
                    (task) => task.dueDate && sameDay(new Date(task.dueDate), cellDate)
                  );
                  const visibleTasks = dayTasks.slice(0, 2);
                  const extraCount = dayTasks.length - visibleTasks.length;

                  return (
                    <DayCell key={cellDate.toISOString()} $muted={muted}>
                      <DayNumber $isToday={sameDay(cellDate, today)}>{cellDate.getDate()}</DayNumber>

                      {visibleTasks.map((task) => (
                        <TaskChip
                          key={task.id}
                          $tone={priorityTone(task.priority)}
                          onClick={() => handleTaskClick(task)}
                        >
                          {task.title}
                        </TaskChip>
                      ))}

                      {extraCount > 0 && <MoreLabel>+{extraCount} more</MoreLabel>}
                    </DayCell>
                  );
                })}
              </DaysGrid>
            </MonthGrid>
          ) : tasks.length === 0 ? (
            <State>No tasks for this period</State>
          ) : mode === "day" ? (
            <ListWrapper>
              <DayGroup>
                {tasks.map((task) => (
                  <TaskRow key={task.id} onClick={() => handleTaskClick(task)}>
                    <TaskRowTitle>{task.title}</TaskRowTitle>
                    {task.priority && (
                      <PriorityBadge $tone={priorityTone(task.priority)}>{task.priority}</PriorityBadge>
                    )}
                  </TaskRow>
                ))}
              </DayGroup>
            </ListWrapper>
          ) : (
            <ListWrapper>
              {Array.from({ length: 7 }).map((_, i) => {
                const dayDate = new Date(referenceDate);
                dayDate.setDate(dayDate.getDate() - dayDate.getDay() + i);
                const dayTasks = tasks.filter(
                  (task) => task.dueDate && sameDay(new Date(task.dueDate), dayDate)
                );

                if (dayTasks.length === 0) return null;

                return (
                  <DayGroup key={i}>
                    <DayGroupTitle>
                      {dayDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </DayGroupTitle>

                    {dayTasks.map((task) => (
                      <TaskRow key={task.id} onClick={() => handleTaskClick(task)}>
                        <TaskRowTitle>{task.title}</TaskRowTitle>
                        {task.priority && (
                          <PriorityBadge $tone={priorityTone(task.priority)}>{task.priority}</PriorityBadge>
                        )}
                      </TaskRow>
                    ))}
                  </DayGroup>
                );
              })}
            </ListWrapper>
          )}
        </Content>
      </Main>
    </Layout>
  );
}

export default Calendar;
