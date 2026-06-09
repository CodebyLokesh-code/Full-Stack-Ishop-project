const path = require("path");

const generateRandomNames = (originalName) => {
  const ext = path.extname(originalName);
  return Date.now() + "-" + Math.floor(Math.random() * 10000) + ext;
};

module.exports = { generateRandomNames };
