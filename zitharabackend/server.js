const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "zitharatask",
  password: "1234",
  port: 5432,
});

app.get("/api/data", async (req, res) => {
  try {
    const { searchTerm, sortby } = req.query;

    let query = "SELECT * FROM data";

    if (searchTerm) {
      query += ` WHERE LOWER(customer_name) LIKE LOWER('%${searchTerm}%') OR LOWER(location) LIKE LOWER('%${searchTerm}%')`;
    }

    if (sortby=="date") {
      query += " ORDER BY created_at::date DESC";
    } else if (sortby=="time") {
      query += " ORDER BY created_at::time DESC";
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
