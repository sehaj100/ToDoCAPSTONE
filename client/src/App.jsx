import React, { useState, useEffect } from "react";
import "./style.css";
import { getTodos, addTodo, deleteTodo, toggleTodo } from "./services/api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [task, setTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const items = await getTodos();
      setTodos(items ?? []);
    }
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (task.trim() === "") return;
    const newTodo = await addTodo({ title: task, completed: false });
    setTodos([...todos, newTodo]);
    setTask("");
  };

  const handleToggle = async (id) => {
    const todo = todos.find((t) => t.id === id || t._id === id);
    const updated = await toggleTodo(id, { title: todo.title, completed: !todo.completed });
    setTodos(
      todos.map((t) => (t.id === id || t._id === id ? updated : t))
    );
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id && todo._id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className={`app-container${darkMode ? " dark" : ""}`}>
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
      <div className="todo-card">
        <h1 className="todo-title">Todo App</h1>
        <div className="input-row">
          <input
            className="todo-input"
            value={task}
            placeholder="Add a new task"
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button className="add-btn" onClick={handleAdd}>Add</button>
        </div>
        <div className="filter-row">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>In Progress</button>
          <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
        </div>
        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-list">No tasks here.</li>
          ) : (
            filteredTodos.map((todo) => (
              <li key={todo.id || todo._id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                <span onClick={() => handleToggle(todo.id || todo._id)}>{todo.title}</span>
                <button className="delete-btn" onClick={() => handleDelete(todo.id || todo._id)}>
                  &#10005;
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
