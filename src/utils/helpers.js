const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { default: z } = require("zod");

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


const optionalString = (message, min = 1) =>
  z.preprocess(
    (value) => {
      if (value === "") return undefined;
      return value;
    },
    z
      .string()
      .trim()
      .min(min, message)
      .optional()
  );
  
module.exports = { tokenFormatter, generateToken, optionalString };
