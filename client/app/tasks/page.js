import TaskForm from "../_components/TaskForm";
import TaskList from "../_components/TaskList";
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
