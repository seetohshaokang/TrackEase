import { Toaster } from "react-hot-toast";
import Dashboard from "../_components/Dashboard";
import MediaQuery from "../_components/MediaQuery";
import Navbar from "../_components/Navbar";
import { TasksProvider } from "../context/TaskContext";

export default function DashboardPage() {
  return (
    <MediaQuery>
      <Toaster
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <div>
        <TasksProvider>
          <Navbar />
          <Dashboard />
        </TasksProvider>
      </div>
    </MediaQuery>
  );
}
