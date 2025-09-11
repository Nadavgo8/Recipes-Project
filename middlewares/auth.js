// const jwt = require("jsonwebtoken");

// module.exports = function auth(req, res, next) {
//   const header = req.headers.authorization || "";
//   const token = header.startsWith("Bearer ") ? header.slice(7) : null;

//   if (!token)
//     return res.status(401).json({ success: false, message: "Missing token" });

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: payload.sub }; // keep it minimal
//     next();
//   } catch (e) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };
// middleware/auth.js
const jwt = require("jsonwebtoken");

function sign(user) {
  // include only safe fields in the token payload
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
}

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { sign, auth };
