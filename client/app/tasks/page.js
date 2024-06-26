import TaskForm from "../_components/TaskForm";
import TaskList from "../_components/TaskList";
import { TasksProvider } from "../context/TaskContext";
import Navbar from "../_components/Navbar";

export default function TaskPage() {
  return (
    <div>
      <Navbar />
    <div className="px-40">
      <h1>Task Tracker</h1>
      <TasksProvider>
        <TaskForm />
        <TaskList />
      </TasksProvider>
    </div>
    </div>
  );
}
