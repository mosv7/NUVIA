const crypto = require("crypto");

const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

const randomSuffix = (bytes = 3) => crypto.randomBytes(bytes).toString("hex");

module.exports = { slugify, randomSuffix };