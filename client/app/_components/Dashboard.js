import WeeklyTaskList from "./WeeklyTaskList";

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-3xl font-bold text-green-900 p-2 border-2 rounded-xl mb-5"> Weekly Dashboard </h1>
      <WeeklyTaskList />
    </div>
  );
}

export default Dashboard;
