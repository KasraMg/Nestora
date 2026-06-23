const jwt = require("jsonwebtoken");

const tokenFormatter = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded.id;
};

module.exports = { tokenFormatter };
