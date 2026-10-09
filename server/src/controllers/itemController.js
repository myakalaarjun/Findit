import ItemReport from '../models/ItemReport.js';

/**
 * @desc Get all item reports with backend filtering & keyword search
 * @route GET /api/items
 */
export const getItems = async (req, res, next) => {
  try {
    const { search, type, category, status, limit = 50, skip = 0 } = req.query;

    const query = {};

    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    if (status && status !== 'all') {
      query.status = status;
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

    const total = await ItemReport.countDocuments(query);
    const items = await ItemReport.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Create a new item report (lost or found)
 * @route POST /api/items
 */
export const createItem = async (req, res, next) => {
  try {
    const { type, title, description, category, location, eventDate, imageUrl, status } = req.body;

    if (!type || !title || !description || !category || !location || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type, title, description, category, location, and eventDate are required.',
      });
    }

    const defaultStatus = status || (type.toLowerCase() === 'lost' ? 'Lost' : 'Found');

    const item = await ItemReport.create({
      type: type.toLowerCase(),
      title,
      description,
      category,
      location,
      eventDate,
      imageUrl: imageUrl || '',
      status: defaultStatus,
    });

    res.status(201).json({
      success: true,
      message: 'Item report created successfully',
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get single item report by ID
 * @route GET /api/items/:id
 */
export const getItemById = async (req, res, next) => {
  try {
    const item = await ItemReport.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update an item report (status or details) in development mode
 * @route PATCH /api/items/:id
 */
export const updateItem = async (req, res, next) => {
  try {
    const allowedUpdates = ['title', 'description', 'category', 'location', 'eventDate', 'imageUrl', 'status'];
    const updates = {};

    for (const key of Object.keys(req.body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const item = await ItemReport.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item report updated successfully',
      data: item,
    });
  } catch (err) {
    next(err);
  }
};
