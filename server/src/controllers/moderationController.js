import ModerationReport from '../models/ModerationReport.js';
import MarketplaceListing from '../models/MarketplaceListing.js';

/**
 * @desc Create a moderation report for a listing
 * @route POST /api/moderation/reports
 */
export const createReport = async (req, res, next) => {
  try {
    const { listing, listingId, reason } = req.body;
    const targetListingId = listing || listingId;

    if (!targetListingId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID and reason are required.',
      });
    }

    const listingExists = await MarketplaceListing.findById(targetListingId);
    if (!listingExists) {
      return res.status(404).json({
        success: false,
        message: 'Listing does not exist.',
      });
    }

    const report = await ModerationReport.create({
      listing: targetListingId,
      reason: reason.trim(),
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Moderation report submitted successfully',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all moderation reports for admin review
 * @route GET /api/admin/reports
 */
export const getAdminReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    const reports = await ModerationReport.find(query)
      .populate('listing')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update a moderation report status (resolved / dismissed)
 * @route PATCH /api/admin/reports/:id
 */
export const updateAdminReport = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'resolved', 'dismissed'].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, resolved, or dismissed.',
      });
    }

    const report = await ModerationReport.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status.toLowerCase() } },
      { new: true }
    ).populate('listing');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Moderation report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};
