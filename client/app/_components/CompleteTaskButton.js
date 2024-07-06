function CompleteTaskButton({ taskId, completed, onTaskChange }) {
  async function handleComplete() {
    const token = localStorage.getItem("firebaseToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/complete/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark task as completed");
      }
      onTaskChange();
    } catch (error) {
      console.error("Error marking task as completed", error);
    }
  }

  return (
    <button
      onClick={handleComplete}
      className="btn btn-success text-white btn-sm"
    >
      {completed ? "Uncomplete" : "Completed"}
    </button>
  );
}

export default CompleteTaskButton;
