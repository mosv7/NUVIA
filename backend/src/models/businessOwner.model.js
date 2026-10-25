const mongoose = require("mongoose");
const { USER_STATUS } = require("./enums");

const businessOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 255 },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true, maxlength: 30 },
    preferredLanguage: { type: String, required: true, trim: true, maxlength: 10 }, // Arabic or English
    
    status: { type: String, enum: USER_STATUS, required: true, default: "active" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("BusinessOwner", businessOwnerSchema);
