export default function Task({ task }) {
  return (
    <div key={task.id}>
      <h3>{task.title}</h3>
      <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
      <p>Remarks: {task.remarks}</p>
    </div>
  );
}
