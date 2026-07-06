const fs = require("fs/promises");

const deleteFile = async (path) => {
  if (!path) return;

  try {
    await fs.unlink(path);
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }
};

module.exports = deleteFile;