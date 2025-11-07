const connectDB = require("../db/db");
const db = connectDB();

async function ratings(req, res) {
  try {
    const userId = req.user?.id;
    const { store_id, rating } = req.body;
    const numeric = Number(rating);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!store_id) return res.status(400).json({ message: "store_id is required" });
    if (!Number.isInteger(numeric) || numeric < 1 || numeric > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }
    const [existing] = await db.query("SELECT id FROM rating WHERE user_id=? AND store_id=?", [userId, store_id]);
    if (existing.length) {
      await db.query("UPDATE rating SET rating=?, created_at=NOW() WHERE id=?", [numeric, existing[0].id]);
    } else {
      await db.query("INSERT INTO rating (rating,user_id,store_id,created_at) VALUES (?,?,?,NOW())", [numeric, userId, store_id]);
    }
    return res.status(200).json({ message: "Rating saved" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { ratings };


