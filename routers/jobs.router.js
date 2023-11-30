const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobs.controller');

// Create a new job
router.post('/post', jobController.postJob);

// Get a list of all jobs
router.get('/all', jobController.getAllJobs);

// Submit a proposal for a job
router.post('/send-proposal', jobController.sendProposal);

// Accept a proposal
router.put('/accept-proposal', jobController.acceptProposal);

// Reject a proposal
router.put('/reject-proposal', jobController.rejectProposal);

module.exports = router;
