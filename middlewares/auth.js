const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token)
    return res.status(401).json({ success: false, message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub }; // keep it minimal
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
