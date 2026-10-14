
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState("Low");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Study");
    setPriority("Low");
    setEditingTaskId(null);
  };

  const saveTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const existingTask = tasks.find(
      (task) => task.id === editingTaskId
    );

    const taskData = {
      title: title.trim(),
      description,
      category,
      priority,
      status: existingTask?.status || "Pending",
      due_date: existingTask?.due_date ?? null
    };

    try {
      if (editingTaskId !== null) {
        const response = await axios.put(
          `${API}/${editingTaskId}`,
          taskData
        );

        setTasks((previous) =>
          previous.map((task) =>
            task.id === editingTaskId ? response.data : task
          )
        );
      } else {
        const response = await axios.post(API, taskData);
        setTasks((previous) => [...previous, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const editTask = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setCategory(task.category || "Study");
    setPriority(task.priority || "Low");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateTaskStatus = async (task, newStatus) => {
    try {
      const response = await axios.put(`${API}/${task.id}`, {
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: newStatus,
        due_date: task.due_date ?? null
      });

      setTasks((previous) =>
        previous.map((item) =>
          item.id === task.id ? response.data : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update task status.");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );

      if (editingTaskId === id) resetForm();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const highPriority = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      `${task.title} ${task.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return (
      matchesSearch &&
      (filterCategory === "All" ||
        task.category === filterCategory) &&
      (filterPriority === "All" ||
        task.priority === filterPriority) &&
      (filterStatus === "All" ||
        task.status === filterStatus)
    );
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✓</span>
          <div>
            <h2>TaskManager</h2>
            <p>Plan · Organize · Achieve</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-link active" href="#dashboard">⌂ Dashboard</a>
          <a className="nav-link" href="#tasks">☷ All Tasks</a>
          <a className="nav-link" href="#tasks">✓ My Progress</a>
        </nav>

        <div className="sidebar-note">
          Small steps make big progress!
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="page-header">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>Task Management Dashboard</h1>
            <p className="subtitle">
              Stay organized, get things done.
            </p>
          </div>
          <div className="profile-badge">S</div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon blue">▤</span>
            <div>
              <p>Total Tasks</p>
              <h2>{tasks.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <div>
              <p>Completed</p>
              <h2>{completed}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon orange">◷</span>
            <div>
              <p>Pending</p>
              <h2>{pending}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon purple">⚑</span>
            <div>
              <p>High Priority</p>
              <h2>{highPriority}</h2>
            </div>
          </div>
        </section>

        <section className="panel form-panel">
          <div className="section-heading">
            <div className="heading-icon">＋</div>
            <div>
              <h2>
                {editingTaskId !== null ? "Edit Task" : "Add New Task"}
              </h2>
              <p>
                {editingTaskId !== null
                  ? "Update your task details."
                  : "Capture a task and keep moving forward."}
              </p>
            </div>
          </div>

          <div className="task-form">
            <label className="field">
              <span>Task title <b>*</b></span>
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="field description-field">
              <span>Description</span>
              <textarea
                placeholder="What needs to be done?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Study</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Other</option>
              </select>
            </label>

            <label className="field">
              <span>Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <button className="primary-button" onClick={saveTask}>
              {editingTaskId !== null ? "Save Changes" : "+ Add Task"}
            </button>

            {editingTaskId !== null && (
              <button className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </section>

        <section className="panel tasks-panel" id="tasks">
          <div className="tasks-heading">
            <div>
              <h2>My Tasks</h2>
              <p>{filteredTasks.length} tasks shown</p>
            </div>
          </div>

          <div className="filter-bar">
            <input
              className="search-input"
              type="search"
              placeholder="⌕  Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              <option>Study</option>
              <option>Work</option>
              <option>Personal</option>
              <option>Other</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="All">All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>

            <button
              className="text-button"
              onClick={() => {
                setSearch("");
                setFilterCategory("All");
                setFilterPriority("All");
                setFilterStatus("All");
              }}
            >
              Clear filters
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div>✓</div>
              <h3>No tasks found</h3>
              <p>Add a task or adjust your search and filters.</p>
            </div>
          ) : (
            <div className="task-grid">
              {filteredTasks.map((task) => (
                <article
                  className={`task-card ${
                    task.status === "Completed" ? "is-completed" : ""
                  }`}
                  key={task.id}
                >
                  <div className="task-card-top">
                    <span className="task-symbol">✓</span>
                    <span
                      className={`status-badge ${
                        task.status === "Completed"
                          ? "status-completed"
                          : "status-pending"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <h3>{task.title}</h3>
                  <p className="task-description">
                    {task.description || "No description provided."}
                  </p>

                  <div className="task-tags">
                    <span className={`tag category-${(task.category || "other").toLowerCase()}`}>
                      {task.category || "Other"}
                    </span>
                    <span className={`tag priority-${(task.priority || "low").toLowerCase()}`}>
                      {task.priority || "Low"} Priority
                    </span>
                  </div>

                  <label className="status-control">
                    <span>Update status</span>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>

                  <div className="task-actions">
                    <button
                      className="edit-button"
                      onClick={() => editTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          Built with React, Node.js, Express and PostgreSQL
        </footer>
      </main>
    </div>
  );
}

export default App;
