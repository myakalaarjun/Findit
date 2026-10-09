import mongoose from 'mongoose';

const itemReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Report type (lost or found) is required'],
      enum: {
        values: ['lost', 'found'],
        message: '{VALUE} is not a valid report type',
      },
      lowercase: true,
      trim: true,
    },
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
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Lost', 'Found', 'Returned', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Lost',
    },
    // Extensible reference for authenticated user ownership in later phases
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for keyword search and filtering
itemReportSchema.index({ title: 'text', description: 'text', location: 'text' });
itemReportSchema.index({ type: 1, status: 1, category: 1 });

const ItemReport = mongoose.model('ItemReport', itemReportSchema);

export default ItemReport;
