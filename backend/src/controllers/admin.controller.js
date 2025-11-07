const bcrypt = require("bcryptjs");
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

async function listUsers(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, address, role FROM users"
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function listStores(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating),2) AS averageRating
       FROM stores s
       LEFT JOIN rating r ON r.store_id = s.id
       GROUP BY s.id`
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getDashboardStats, createuser, listStores, listUsers };
