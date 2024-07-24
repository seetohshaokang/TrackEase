import WeeklyTaskList from "./WeeklyTaskList";

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-gray-100">
      <h1 className="text-3xl font-bold underline mb-5"> Weekly Dashboard </h1>
      <WeeklyTaskList />
    </div>
  );
}

export default Dashboard;
