import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { TasksProvider } from "../context/TaskContext";

export default function TaskPage() {
  return (
    <div>
      <h1>Task Tracker</h1>
      <TasksProvider>
        <TaskForm />
        <TaskList />
      </TasksProvider>
    </div>
  );
}
