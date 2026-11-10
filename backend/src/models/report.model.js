const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  reportName: {
    type: String,
    required: true, // مثل: "September customer experience"
  },
  periodCovered: {
    type: String,
    required: true, // مثل: "1-30 Sep, 2026"
  },
  branchesCovered: {
    type: [String], // مثل: ["Cairo", "El Zamalek", "Alex"]
    default: [],
  },
  language: {
    type: String,
    default: "en",
  },
  totalReviewsAnalyzed: {
    type: Number,
    default: 0, // مطابق لـ 1,250 في الـ UI
  },
  executiveSummary: {
    type: String, // الملخص التنفيذي الظاهر أعلى التقرير
  },
  // مخرجات الـ AI المباشرة مطابقة لعقد القسم 05
  strengths: [
    {
      text: String,
      metricsText: String, // لإظهار تفاصيل مثل "640 mentions · 86% positive" المستخرجة من الباك إند
      citations: [{ id: String, quote: String }]
    }
  ],
  problems: [
    {
      priority: { type: String, enum: ["High", "Medium", "Low", "Opportunity"] },
      category: String, // مثل "Operations" أو "Commercial"
      text: String,
      metricsText: String,
      citations: [{ id: String, quote: String }]
    }
  ],
  suggestedActions: [
    {
      priority: String,
      category: String,
      suggestion: String,
      citations: [{ id: String, quote: String }]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);