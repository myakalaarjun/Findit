/**
 * ReLoop Server Services
 * Encapsulates reusable business logic and queries
 */

import ItemReport from '../models/ItemReport.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import ModerationReport from '../models/ModerationReport.js';

export const itemService = {
  findItems: (query, sort = { createdAt: -1 }, skip = 0, limit = 50) => {
    return ItemReport.find(query).sort(sort).skip(skip).limit(limit);
  },
  countItems: (query) => ItemReport.countDocuments(query),
  findItemById: (id) => ItemReport.findById(id),
  createItem: (data) => ItemReport.create(data),
  updateItemById: (id, updates) => ItemReport.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }),
};

export const listingService = {
  findListings: (query, sort = { createdAt: -1 }, skip = 0, limit = 50) => {
    return MarketplaceListing.find(query).sort(sort).skip(skip).limit(limit);
  },
  countListings: (query) => MarketplaceListing.countDocuments(query),
  findListingById: (id) => MarketplaceListing.findById(id),
  createListing: (data) => MarketplaceListing.create(data),
  updateListingById: (id, updates) => MarketplaceListing.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }),
};

export const moderationService = {
  findReports: (query, sort = { createdAt: -1 }) => {
    return ModerationReport.find(query).populate('listing').sort(sort);
  },
  createReport: (data) => ModerationReport.create(data),
  updateReportById: (id, status) => ModerationReport.findByIdAndUpdate(id, { $set: { status } }, { new: true }).populate('listing'),
};
