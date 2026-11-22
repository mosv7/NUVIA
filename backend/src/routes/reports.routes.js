const express = require("express");
const router = express.Router();
const { generateReport, getReports, getReportById } = require("../controllers/reports.controller");
const authenticate = require("../middlewares/auth.middleware");

// "Generate New Report" button in the UI
router.post("/", 
    authenticate,
     generateReport);

// Retrieve the list of reports
router.get("/", 
    authenticate, 
    getReports);

// Bring a detailed report 
router.get("/:id",
     authenticate, 
     getReportById);

module.exports = router;