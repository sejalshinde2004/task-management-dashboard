const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Task Manager API is running!");
});

// Test database connection
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "Database connected successfully!",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});

// Create a new task
app.post("/api/tasks", async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority,
            status,
            due_date
        } = req.body;

        const result = await pool.query(
            `INSERT INTO tasks
            (title, description, category, priority, status, due_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [title, description, category, priority, status, due_date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create task"
        });
    }
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            priority,
            status,
            due_date
        } = req.body;

        const result = await pool.query(
            `UPDATE tasks
             SET title = $1,
                 description = $2,
                 category = $3,
                 priority = $4,
                 status = $5,
                 due_date = $6
             WHERE id = $7
             RETURNING *`,
            [title, description, category, priority, status, due_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update task"
        });
    }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete task"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});