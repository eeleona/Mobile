const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  a_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adoption',
    required: true,
  },
  p_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  v_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verified', // Changed to match correct user schema
    required: true,
  },
  adoptionRatings: {
    requirementsClear: { type: Number, min: 1, max: 5, required: true },
    petInfoClear: { type: Number, min: 1, max: 5, required: true },
    teamHelpfulness: { type: Number, min: 1, max: 5, required: true },
    processSmoothness: { type: Number, min: 1, max: 5, required: true },
    petMatchedDescription: { type: Number, min: 1, max: 5, required: true }
  },
  websiteRatings: {
    easyNavigation: { type: Number, min: 1, max: 5, required: true },
    searchHelpful: { type: Number, min: 1, max: 5, required: true },
    formUserFriendly: { type: Number, min: 1, max: 5, required: true },
    goodPerformance: { type: Number, min: 1, max: 5, required: true },
    recommend: { type: Number, min: 1, max: 5, required: true }
  },
  feedbackText: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
