import Dashboard from "../_components/Dashboard";
import MediaQuery from "../_components/MediaQuery";
import Navbar from "../_components/Navbar";
import { TasksProvider } from "../context/TaskContext";

export default function DashboardPage() {
  return (
    <MediaQuery>
      <div>
        <TasksProvider>
          <Navbar />
          <Dashboard />
        </TasksProvider>
      </div>
    </MediaQuery>
  );
}
