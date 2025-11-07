const bycrypt = require("bcryptjs");
const connectDB = require("../db/db");
const db = connectDB();

async function getDashboardStats(req, res) {
  try {
    const [[usersCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM users"
    );
    const [[storeCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM stores"
    );
    const [[ratingsCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM ratings"
    );

    return res.status(200).json({
      users: usersCount.count,
      stores: storeCount.count,
      ratings: ratingsCount.count,
    });
  } catch (err) {
    console.error("Error in getDashboard:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createuser(req, res) {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || name.length < 20 || name.length > 60) {
      return res
        .status(400)
        .json({ message: "Name must be between 20 and 60 characters" });
    }
    if (!address || address.length > 400) {
      return res
        .status(400)
        .json({ message: "Address cannot exceed 400 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars, include at least 1 uppercase & 1 special character",
      });
    }
    const [exists] = await db.query("SELECT id FROM users WHERE email=?", [
      email,
    ]);
    if (exists.length)
      return res.status(400).json({ message: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name,email,address,password,role) VALUES (?,?,?,?,?)",
      [name, email, address, hashed, role]
    );
    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Error in createuser:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

function SortandFilter({ name, email, address, role, sortBy, sortDir }) {
  const conditions = [];
  const params = [];
  if (name) {
    conditions.push("u.name LIKE ?");
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push("u.email LIKE ?");
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push("u.address LIKE ?");
    params.push(`%${address}%`);
  }
  if (role) {
    conditions.push("u.role = ?");
    params.push(role);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const sortable = new Set(["name", "email", "address", "role"]);
  const dir = sortDir && sortDir.toUpperCase() === "DESC" ? "DESC" : "ASC";
  const order = sortable.has(sortBy) ? `ORDER BY u.${sortBy} ${dir}` : "";
  return { where, order, params };
}

async function listUsers(req, res) {
  try {
    const { where, order, params } = buildFilterAndSort({
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      role: req.query.role,
      sortBy: req.query.sortBy,
      sortDir: req.query.sortDir,
    });
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.address, u.role FROM users u ${where} ${order}`,
      params
    );
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function listStores(req, res) {
  try {
    const name = req.query.name;
    const email = req.query.email;
    const address = req.query.address;
    const sortBy = req.query.sortBy;
    const sortDir = req.query.sortDir;

    const conditions = [];
    const params = [];
    if (name) { conditions.push("s.name LIKE ?"); params.push(`%${name}%`); }
    if (email) { conditions.push("s.email LIKE ?"); params.push(`%${email}%`); }
    if (address) { conditions.push("s.address LIKE ?"); params.push(`%${address}%`); }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sortable = new Set(["name", "email", "address"]);
    const dir = sortDir && sortDir.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const order = sortable.has(sortBy) ? `ORDER BY s.${sortBy} ${dir}` : "";

    const [rows] = await db.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating),2) as averageRating
       FROM stores s
       LEFT JOIN rating r ON r.store_id = s.id
       ${where}
       GROUP BY s.id
       ${order}`,
      params
    );
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getDashboardStats, createuser, listStores };
