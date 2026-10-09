import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    sellerContact: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'sold', 'removed'],
        message: '{VALUE} is not a valid listing status',
      },
      default: 'active',
      lowercase: true,
    },
    // Extensible reference for authenticated user ownership in later phases
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for text search, filtering and sorting
marketplaceListingSchema.index({ title: 'text', description: 'text', location: 'text' });
marketplaceListingSchema.index({ status: 1, category: 1, price: 1, createdAt: -1 });

const MarketplaceListing = mongoose.model('MarketplaceListing', marketplaceListingSchema);

export default MarketplaceListing;
