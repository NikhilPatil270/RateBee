const connectDB = require("../db/db");
const db = connectDB();

async function listStores(req, res) {
  try {
    const userId = req.user?.id;
    const name = req.query.name;
    const address = req.query.address;
    const conditions = [];
    const params = [];
    if (name) { conditions.push("s.name LIKE ?"); params.push(`%${name}%`); }
    if (address) { conditions.push("s.address LIKE ?"); params.push(`%${address}%`); }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating),2) as averageRating,
              (SELECT rating FROM rating WHERE user_id=? AND store_id=s.id LIMIT 1) as myRating
       FROM stores s
       LEFT JOIN rating r ON r.store_id=s.id
       ${where}
       GROUP BY s.id
       ORDER BY s.name ASC`,
      [userId || 0, ...params]
    );
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createStore(req, res) {
  try {
    const { name, email, address } = req.body;
    if (!name || name.length < 1 || name.length > 100) {
      return res.status(400).json({ message: "Store name is required (max 100)" });
    }
    if (address && address.length > 300) {
      return res.status(400).json({ message: "Address cannot exceed 300 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    await db.query("INSERT INTO stores (name,email,address,created_at) VALUES (?,?,?,?,NOW())", [name, email, address || null]);
    return res.status(201).json({ message: "Store created" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { listStores, createStore };
