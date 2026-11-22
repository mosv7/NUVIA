const mongoose = require('mongoose');
const sentimentService = require('../services/overviewSentiment.service');
const Branch = require('../models/branch.model');

const validateFilters = async (req, res) => {
  const { startDate, endDate, branchId, language } = req.query;

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (startDate && !dateRegex.test(startDate)) {
    res.status(400).json({
      success: false,
      message: 'Invalid startDate format. Use YYYY-MM-DD',
    });
    return null;
  }

  if (endDate && !dateRegex.test(endDate)) {
    res.status(400).json({
      success: false,
      message: 'Invalid endDate format. Use YYYY-MM-DD',
    });
    return null;
  }

  // Validate actual calendar dates
  const isValidDate = (value) => {
    if (!value) return true;

    const date = new Date(`${value}T00:00:00.000Z`);

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  };

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({
      success: false,
      message: 'Invalid calendar date',
    });
    return null;
  }

  // Validate date range
  if (startDate && endDate && startDate > endDate) {
    res.status(400).json({
      success: false,
      message: 'startDate cannot be after endDate',
    });
    return null;
  }

  // Validate branch ID
  if (branchId && !mongoose.Types.ObjectId.isValid(branchId)) {
    res.status(400).json({
      success: false,
      message: 'Invalid branch ID',
    });
    return null;
  }

  // Validate language
  if (language && !['en', 'ar'].includes(language)) {
    res.status(400).json({
      success: false,
      message: 'Language must be en or ar',
    });
    return null;
  }

  // Make sure branch belongs to authenticated business
  if (branchId) {
    const branchExists = await Branch.exists({
      _id: branchId,
      businessId: req.user.businessId,
    });

    if (!branchExists) {
      res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
      return null;
    }
  }

  return {
    startDate,
    endDate,
    branchId,
    language,
  };
};

// GET /summary
const getSummary = async (req, res, next) => {
  try {
    const filters = await validateFilters(req, res);

    if (!filters) return;

    const result = await sentimentService.getSentimentSummary(req.user.businessId, filters);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /trends
const getTrends = async (req, res, next) => {
  try {
    const filters = await validateFilters(req, res);

    if (!filters) return;

    const result = await sentimentService.getSentimentTrends(req.user.businessId, filters);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /responses
const getResponses = async (req, res, next) => {
  try {
    const filters = await validateFilters(req, res);

    if (!filters) return;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters',
      });
    }

    const result = await sentimentService.getSentimentResponses(req.user.businessId, filters, {
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /responses/:responseId
const getResponseAnalysis = async (req, res, next) => {
  try {
    const { responseId } = req.params;

    // Validate Response ID
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid response ID',
      });
    }

    // Get response details and AI analysis
    const result = await sentimentService.getResponseAnalysis(
      req.user.businessId,
      responseId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    // Log the actual error for debugging
    console.error('Get Response Analysis Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    // Pass error to Global Error Handler
    next(error);
  }
};

module.exports = {
  getSummary,
  getTrends,
  getResponses,
  getResponseAnalysis,
};
