const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "banner_db",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

app.get("/api/banner", (req, res) => {
    db.query("SELECT * FROM banner LIMIT 1", (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

app.post("/api/banner", (req, res) => {
    const { description, timer, link } = req.body;
    db.query(
        "UPDATE banner SET description = ?, timer = ?, link = ?",
        [description, timer, link],
        (err) => {
            if (err) throw err;
            res.sendStatus(200);
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
