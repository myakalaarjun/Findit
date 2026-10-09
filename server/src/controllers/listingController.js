import MarketplaceListing from '../models/MarketplaceListing.js';

/**
 * @desc Get all marketplace listings with backend filtering, searching, and sorting
 * @route GET /api/listings
 */
export const getListings = async (req, res, next) => {
  try {
    const { search, category, sort = 'newest', status, limit = 50, skip = 0 } = req.query;

    const query = {};

    // By default, hide removed listings from general marketplace browse
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    } else {
      query.status = { $ne: 'removed' };
    }

    if (category && category !== 'All Categories') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { category: regex },
      ];
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const total = await MarketplaceListing.countDocuments(query);
    const listings = await MarketplaceListing.find(query)
      .sort(sortOptions)
      .skip(Number(skip))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      data: listings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Create a new marketplace listing
 * @route POST /api/listings
 */
export const createListing = async (req, res, next) => {
  try {
    const { title, description, price, category, condition, location, imageUrl, sellerContact } = req.body;

    if (!title || !description || price === undefined || !category || !condition || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, price, category, condition, and location are required.',
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number.',
      });
    }

    const listing = await MarketplaceListing.create({
      title,
      description,
      price: numericPrice,
      category,
      condition,
      location,
      imageUrl: imageUrl || '',
      sellerContact: sellerContact || '',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Marketplace listing created successfully',
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get single marketplace listing by ID
 * @route GET /api/listings/:id
 */
export const getListingById = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update a marketplace listing in development mode
 * @route PATCH /api/listings/:id
 */
export const updateListing = async (req, res, next) => {
  try {
    const allowedUpdates = ['title', 'description', 'price', 'category', 'condition', 'location', 'imageUrl', 'sellerContact', 'status'];
    const updates = {};

    for (const key of Object.keys(req.body)) {
      if (allowedUpdates.includes(key)) {
        if (key === 'price') {
          const num = Number(req.body[key]);
          if (isNaN(num) || num < 0) {
            return res.status(400).json({
              success: false,
              message: 'Price must be a valid non-negative number',
            });
          }
          updates.price = num;
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    const listing = await MarketplaceListing.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Mark a listing as Sold
 * @route POST /api/listings/:id/sold
 */
export const markListingAsSold = async (req, res, next) => {
  try {
    const listing = await MarketplaceListing.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'sold' } },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace listing not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing marked as sold',
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};
