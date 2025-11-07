const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

function authorize(authorizedRoles = []) {
  return (req, res, next) => {
    if (!authorizedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You don't have permission to access this resource",
        });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  authorize,
};
