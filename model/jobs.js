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
    description: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  
  const Job = mongoose.model('Job', JobSchema);
  
  module.exports = Job;
  