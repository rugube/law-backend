const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
  }],
  serviceType: {
    type: String,
    required: true,
    enum: ['contract review', 'litigation', 'legal consultation', 'other'],
  },
  status: {
    type: String,
    enum: ['open', 'in progress', 'closed'],
    default: 'open',
  },
  title: {
    type: String,
    default: '', // Set a default value or adjust according to your needs
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number, // Change the type based on your requirements
    default: 0,   // Set a default value or adjust according to your needs
  },
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
