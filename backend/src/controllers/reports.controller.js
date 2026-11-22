const Report = require("../models/report.model");
const Feedback = require("../models/customerResponse.model"); // استدعاء موديل الفيدباك
const { callService } = require("../integrations/ai-service/reports");
const Business = require("../models/business.model");

const generateReport = async (req, res) => {
  try {
   // 1. Identify the Business ID for the user or branch (from the request or authentication)
    let business = await Business.findOne({ user: req.user?.id });
    const targetBusinessId = business ? business._id : (req.user?.businessId || req.body?.businessId);

    if (!targetBusinessId) {
      return res.status(400).json({ message: "Business ID could not be resolved." });
    }

    // 2. Perform Query to fetch actual customer feedback along with associated branch data (if available)
    const feedbacks = await Feedback.find({ businessId: targetBusinessId })
      .populate('branchId', 'name') // to fetch the branch name if branchId is a Reference
      .sort({ submittedAt: -1 })
    //   .limit(10); // maximum of 10 texts based on AI service constraints

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(400).json({ 
        message: "No customer feedback found in the database to generate a report." 
      });
    }

    // --- Extract unique branches from the feedbacks to populate the branchesCovered field ---
    const branchesSet = new Set();
    feedbacks.forEach(fb => {
      if (fb.branchId) {
        if (typeof fb.branchId === 'object' && fb.branchId.name) {
          branchesSet.add(fb.branchId.name);
        } else {
          branchesSet.add(fb.branchId.toString());
        }
      }
    });
    const uniqueBranches = Array.from(branchesSet);

    // --- Calculate the report period (Period Covered) based on the oldest and newest feedback ---
    const dates = feedbacks.map(fb => new Date(fb.submittedAt)).filter(d => !isNaN(d));
    
    let calculatedPeriod = "Recent Submissions";
    if (dates.length > 0) {
      const newestDate = new Date(Math.max(...dates));
      const oldestDate = new Date(Math.min(...dates));

      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formattedOldest = oldestDate.toLocaleDateString('en-US', options);
      const formattedNewest = newestDate.toLocaleDateString('en-US', options);

      calculatedPeriod = formattedOldest === formattedNewest 
        ? formattedOldest 
        : `${formattedOldest} to ${formattedNewest}`;
    }

    // 3. Prepare the Payload in the format that the AI service understands
    const textsPayload = feedbacks.map((fb, index) => ({
      id: `r${index + 1}`,
      text: fb.feedbackText // the actual text extracted from the Feedback database
    }));

    const aiPayload = {
      texts: textsPayload,
      locale: req.body?.locale || "en",
      objective: req.body?.objective || "Identify service issues and useful next actions."
    };

    // 4. Send the data to the AI service
    let aiResponse;
    try {
      aiResponse = await callService("reports", aiPayload);
    } catch (aiError) {
      return res.status(aiError.status || 502).json({ 
        message: "AI Service failed", 
        error: aiError.message 
      });
    }

    // Extract the result (whether it's in a common envelope or returned directly)
    const aiResult = aiResponse.result || aiResponse;

    // 5. Save the response from the AI in the Reports table with the new dynamic values
    const newReport = await Report.create({
      business: targetBusinessId,
      reportName: req.body?.reportName || "Automated AI Experience Report",
      periodCovered: calculatedPeriod, // the calculated period dynamically
      branchesCovered: uniqueBranches.length > 0 ? uniqueBranches : ["General / Unspecified Branch"], // the extracted branches
      totalReviewsAnalyzed: feedbacks.length,
      executiveSummary: `Generated automatically from customer feedback covering ${calculatedPeriod}.`,
      
      // Save the extracted Strengths from the AI
      strengths: (aiResult.strengths || []).map((s) => ({
        text: s.text,
        citations: s.citations,
      })),

      // Save the extracted Problems from the AI
      problems: (aiResult.problems || []).map((p) => ({
        text: p.text,
        citations: p.citations,
      })),

      // Save the extracted Suggested Actions from the AI
      suggestedActions: (aiResult.suggested_actions || []).map((a) => ({
        suggestion: a.suggestion,
        citations: a.citations,
      })),
    });

    return res.status(201).json({
      message: "Report generated from DB feedback, processed by AI, and saved successfully!",
      report: newReport,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

const getReports = async (req, res) => {
  try {
    // Use .select() to fetch only specific fields and reduce the size of the returned data
    const reports = await Report.find()
      .select("reportName periodCovered branchesCovered language createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({ reports });
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to fetch reports", 
      error: error.message 
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    return res.status(200).json({ report });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch report details",
      error: error.message,
    });
  }
};

module.exports = {
  generateReport,
  getReports,
  getReportById,
};