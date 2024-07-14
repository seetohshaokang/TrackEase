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
      className="btn rounded-full btn-sm w-10 h-10 flex items-center justify-center text-white bg-green-400 hover:bg-green-600"
      title={completed ? "Undo Complete" : "Mark as Complete"}
    >
      {completed ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
      </svg>
      
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      
      )}
    </button>
  );
}

export default CompleteTaskButton;
