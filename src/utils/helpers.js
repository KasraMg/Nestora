const jwt = require("jsonwebtoken");
const env = require("../config/env");

const tokenFormatter = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, env.JWT_SECRET);

  return decoded.id;
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

module.exports = { tokenFormatter, generateToken };
