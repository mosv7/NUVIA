// Every enum from the diagram, in one place. Import with: const ENUMS = require("./enums");
const e = (...values) => Object.freeze(values);

module.exports = Object.freeze({
  USER_STATUS: e("active", "suspended", "deleted"),
  BUSINESS_TYPE: e("food_beverage", "retail", "healthcare", "hospitality", "education", "services", "restaurant", "clinic", "store", "other"),
  BRANCH_STATUS: e("active", "archived"),
  MEMBER_ROLE: e("manager", "viewer"),
  MEMBER_STATUS: e("active", "invited", "suspended"),
  SUBSCRIPTION_STATUS: e("active", "expired", "cancelled"),
  BILLING_CYCLE: e("monthly", "yearly"),
  CREATION_METHOD: e("manual", "template", "ai_generated"),
  QUESTIONNAIRE_STATUS: e("draft", "live", "paused", "closed"),
  QUESTION_TYPE: e("short_text", "long_text", "rating", "multiple_choice", "dropdown", "yes_no"),
  LANGUAGE: e("en", "ar"),
  CHANNEL_TYPE: e("short_link", "qr_code"),
  ANALYSIS_STATUS: e("pending", "processing", "completed", "failed"),
  JOB_STATUS: e("queued", "running", "completed", "failed"),
  JOB_STAGE: e("preprocessing", "sentiment", "aspect_analysis", "clustering", "scoring"),
  SENTIMENT_TYPE: e("positive", "negative", "neutral", "mixed"),
  POLARITY_TYPE: e("positive", "negative", "neutral"),
  ALERT_TYPE: e("change_point", "anomaly", "at_risk"),
  SEVERITY_TYPE: e("low", "medium", "high"),
  RECOMMENDATION_PRIORITY: e("low", "medium", "high"),
  ACTION_STATUS: e("to_do", "in_progress", "done"),
  MESSAGE_ROLE: e("user", "assistant"),
  GENERATION_STATUS: e("pending", "completed", "failed"),
  REPORT_STATUS: e("pending", "generating", "completed", "failed"),
});
