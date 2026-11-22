
const overviewService = require('../services/overview.service');
const mongoose = require('mongoose');
const Branch = require('../models/branch.model');


exports.getNextActions = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const data = await overviewService.getNextActions(businessId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Overview getNextActions error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch next actions',
    });
  }
};

exports.getAspectScores = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const { branchId, startDate, endDate } = req.query;

    // Validate branchId
    if (branchId && branchId !== 'all') {
      if (!mongoose.isValidObjectId(branchId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid branchId',
        });
      }

      const branchExists = await Branch.exists({
        _id: branchId,
        businessId,
      });

      if (!branchExists) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }
    }

    // Validate dates
    const isValidDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

      const date = new Date(`${value}T00:00:00.000Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    };

    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate. Use YYYY-MM-DD',
      });
    }

    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate. Use YYYY-MM-DD',
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate must be before or equal to endDate',
      });
    }

    const data = await overviewService.getAspectScores(
      businessId,
      { branchId, startDate, endDate }
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Overview getAspectScores error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch aspect scores',
    });
  }
};

exports.getSentiment = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const { branchId, startDate, endDate } = req.query;

    if (branchId && branchId !== 'all') {
      if (!mongoose.isValidObjectId(branchId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid branchId',
        });
      }

      const branchExists = await Branch.exists({
        _id: branchId,
        businessId,
      });

      if (!branchExists) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }
    }

    const isValidDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

      const date = new Date(`${value}T00:00:00.000Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    };

    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate. Use YYYY-MM-DD',
      });
    }

    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate. Use YYYY-MM-DD',
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate must be before or equal to endDate',
      });
    }

    const data = await overviewService.getSentimentDistribution(
      businessId,
      { branchId, startDate, endDate }
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Overview getSentiment error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sentiment distribution',
    });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const { branchId, startDate, endDate } = req.query;

    // Validate branch ownership
    if (branchId && branchId !== 'all') {
      if (!mongoose.isValidObjectId(branchId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid branchId',
        });
      }

      const branchExists = await Branch.exists({
        _id: branchId,
        businessId,
      });

      if (!branchExists) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }
    }

    // Validate dates
    const isValidDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

      const date = new Date(`${value}T00:00:00.000Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    };

    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate. Use YYYY-MM-DD',
      });
    }

    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate. Use YYYY-MM-DD',
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate must be before or equal to endDate',
      });
    }

    const data = await overviewService.getResponseTrends(
      businessId,
      { branchId, startDate, endDate }
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Overview getTrends error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch response trends',
    });
  }
};

exports.getBranches = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const branches = await overviewService.getBranches(businessId);

    return res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error('Overview getBranches error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch branches',
    });
  }
};


exports.getMetrics = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const { branchId, startDate, endDate } = req.query;

    if (branchId && branchId !== 'all') {
      if (!mongoose.isValidObjectId(branchId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid branchId',
        });
      }

      const branchExists = await Branch.exists({
        _id: branchId,
        businessId,
      });

      if (!branchExists) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found',
        });
      }
    }

    if (
      startDate &&
      (Number.isNaN(Date.parse(startDate)) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(startDate))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate. Use YYYY-MM-DD',
      });
    }

    if (
      endDate &&
      (Number.isNaN(Date.parse(endDate)) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(endDate))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate. Use YYYY-MM-DD',
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate must be before or equal to endDate',
      });
    }

    const data = await overviewService.getOverviewMetrics(
      businessId,
      { branchId, startDate, endDate }
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Overview getMetrics error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch overview metrics',
    });
  }
};



