const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, "data", "db.json");

app.use(cors());
app.use(express.json());

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function setupResourceRoutes(resource) {
  app.get(`/${resource}`, (req, res) => {
    const db = readDB();
    let results = db[resource] || [];
    Object.keys(req.query).forEach((key) => {
      results = results.filter((item) => String(item[key]) === String(req.query[key]));
    });
    res.json(results);
  });

  app.get(`/${resource}/:id`, (req, res) => {
    const db = readDB();
    const item = (db[resource] || []).find((i) => String(i.id) === String(req.params.id));
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  app.post(`/${resource}`, (req, res) => {
    const db = readDB();
    const newItem = { id: generateId(), ...req.body };
    if (!db[resource]) db[resource] = [];
    db[resource].push(newItem);
    writeDB(db);
    res.status(201).json(newItem);
  });

  app.put(`/${resource}/:id`, (req, res) => {
    const db = readDB();
    const index = (db[resource] || []).findIndex((i) => String(i.id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db[resource][index] = { ...db[resource][index], ...req.body, id: req.params.id };
    writeDB(db);
    res.json(db[resource][index]);
  });

  app.patch(`/${resource}/:id`, (req, res) => {
    const db = readDB();
    const index = (db[resource] || []).findIndex((i) => String(i.id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db[resource][index] = { ...db[resource][index], ...req.body };
    writeDB(db);
    res.json(db[resource][index]);
  });

  app.delete(`/${resource}/:id`, (req, res) => {
    const db = readDB();
    const index = (db[resource] || []).findIndex((i) => String(i.id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db[resource].splice(index, 1);
    writeDB(db);
    res.status(204).end();
  });
}

["users", "admin", "products", "orders"].forEach(setupResourceRoutes);

app.get("/", (req, res) => {
  res.json({ message: "BookNest API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
