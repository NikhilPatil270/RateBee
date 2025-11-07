const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../db/db");
const db = connectDB();

async function registerUser(req, res) {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters",
      });
    }
    if (!address || address.length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars, include at least 1 uppercase & 1 special character",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    
    const [existingUser] = await db.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name,email,address,password,role) VALUES (?,?,?,?,?)",
      [name, email, address, hashedPassword, role, Date.now()]
    );

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    return res
      .status(201)
      .json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function changePassword(req, res) {
  try{
    const { email, oldPassword, newPassword } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = users[0];
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);  
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password=? WHERE email=?", [
      newHashedPassword,
      email,
    ]);
    return res.status(200).json({ message: "Password changed successfully" });
  }catch(error){
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error" });
}
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
};
