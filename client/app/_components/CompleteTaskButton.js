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
      className={`btn rounded-full btn-sm w-10 h-10 flex items-center justify-center border-1 transition group ${
        completed ? 'bg-green-400 hover:bg-white border-transparent' : 'bg-white border-green-500 hover:bg-green-500 hover:text-black'
      }`}
      title={completed ? 'Undo Complete' : 'Mark as Complete'}
    >
      {completed ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white opacity-100 group-hover:opacity-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6  text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>

      )}
    </button>
  );
}

export default CompleteTaskButton;
