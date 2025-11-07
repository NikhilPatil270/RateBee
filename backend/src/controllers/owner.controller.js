const connectDB = require("../db/db");
const db = connectDB();

async function ownerDashboard(req, res) {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const [[store]] = await db.query("SELECT id, name FROM stores WHERE owner_id=? LIMIT 1", [ownerId]);
    if (!store) return res.json({ store: null, averageRating: null, raters: [] });

    const [[avg]] = await db.query("SELECT ROUND(AVG(rating),2) as avgRating FROM rating WHERE store_id=?", [store.id]);
    const [raters] = await db.query(
      `SELECT u.id, u.name, u.email, u.address, r.rating, r.created_at
       FROM rating r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id=?
       ORDER BY r.created_at DESC`,
      [store.id]
    );
    return res.json({ store, averageRating: avg.avgRating || 0, raters });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { ownerDashboard };
