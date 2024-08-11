const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Create a connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "AAd!tyAA$ravi",
    database: "tuf_assignment",
    connectionLimit: 10, // Adjust as needed
});

const promisePool = pool.promise(); // Promisify the pool for async/await usage

app.get("/", (req, res) => {
    res.send("Node is Working!");
});

app.get("/api/banner", async (req, res) => {
    try {
        const [results] = await promisePool.query("SELECT * FROM banner");
        res.json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/banner", async (req, res) => {
    const { description, timer, link, visible, id } = req.body;

    try {
        const [result] = await promisePool.query(
            `UPDATE banner SET description = ?, timer = ?, link = ?, visible = ? WHERE id = ?`,
            [
                description,
                timer,
                link,
                visible ? 1 : 0, // Use 1 for true and 0 for false
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Banner not found or no changes made" });
        }

        res.status(200).json({ message: "Banner updated successfully" });
    } catch (err) {
        console.error("Database update error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/latest-banners", async (req, res) => {
    try {
        const [results] = await promisePool.query(
            "SELECT * FROM banner ORDER BY id DESC LIMIT 3"
        );
        res.json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("Connected to MySQL!");
        connection.release(); // Release the connection back to the pool
    });
});
