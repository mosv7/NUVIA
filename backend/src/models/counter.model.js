const mongoose = require("mongoose");

// Atomic counters. Used to give every business its own feedback numbers: #1, #2, #3...
// _id looks like "feedback:<businessId>".
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 0 },
});

counterSchema.statics.next = async function (key) {
  const doc = await this.findOneAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return doc.seq;
};

module.exports = mongoose.model("Counter", counterSchema);
