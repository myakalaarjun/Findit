import mongoose from 'mongoose';

const moderationReportSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceListing',
      required: [true, 'Marketplace listing reference is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      trim: true,
      maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'resolved', 'dismissed'],
        message: '{VALUE} is not a valid moderation status',
      },
      default: 'pending',
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

moderationReportSchema.index({ status: 1, createdAt: -1 });

const ModerationReport = mongoose.model('ModerationReport', moderationReportSchema);

export default ModerationReport;
