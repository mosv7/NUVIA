const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const onboardingRoutes = require("./src/routes/onboarding.routes");
const surveyRoutes = require("./src/routes/survey.routes");
const surveyTemplateRoutes = require("./src/routes/surveyTemplate.routes");
const branchRoutes = require("./src/routes/branch.routes");
const businessRoutes = require("./src/routes/business.routes");

const app = express();

app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:5173").split(","),
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Customer Feedback API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/survey-templates", surveyTemplateRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/business", businessRoutes);



module.exports = app;