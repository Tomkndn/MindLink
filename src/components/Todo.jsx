import React, { useState } from 'react';
import "../Todo.css"
const Todo = () => {
  // State to manage the list of tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Function to handle adding a new task
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  // Function to handle toggling the completion status of a task
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  // Function to handle deleting a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="App">

      {/* Input field and add button */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask} className='add-task-btn'>Add</button>
      </div>

      {/* List of tasks */}
      <div className="task-list">
  {tasks.map((task) => (
    <div key={task.id} className="task-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div
        onClick={() => toggleTaskCompletion(task.id)}
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          cursor: 'pointer',
          flexGrow: 1,
        }}
      >
        {task.text}
      </div>
      <button
      className="task-delete-button"
        onClick={() => deleteTask(task.id)}
        style={{
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        Delete
      </button>
    </div>
  ))}
</div>
    </div>
  );
}

export default Todo;
