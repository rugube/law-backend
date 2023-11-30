const Job = require('../model/jobs.model');

exports.postJob = async (req, res) => {
  try {
    const { userId, title, serviceType, description, budget } = req.body;

    // Validate that required fields are present
    if (!userId || !title || !serviceType || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new job using the Job model
    const newJob = new Job({
      userId,
      title,
      serviceType,
      description,
      budget,
    });

    // Save the job to the database
    await newJob.save();

    res.status(201).json({ message: 'Job posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post job' });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

exports.sendProposal = async (req, res) => {
  try {
    const { jobId, lawyerId, proposal } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.proposals.push({ lawyerId, proposal });
    await job.save();
    res.status(200).json({ message: 'Proposal sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send proposal' });
  }
};

exports.acceptProposal = async (req, res) => {
  try {
    const { jobId, proposalId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const proposal = job.proposals.id(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    // Set the proposal status to "accepted"
    proposal.status = 'accepted';
    await job.save();
    res.status(200).json({ message: 'Proposal accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept proposal' });
  }
};

exports.rejectProposal = async (req, res) => {
  try {
    const { jobId, proposalId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const proposal = job.proposals.id(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    // Set the proposal status to "rejected"
    proposal.status = 'rejected';
    await job.save();
    res.status(200).json({ message: 'Proposal rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject proposal' });
  }
};
