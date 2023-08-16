import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId
import Job from "../models/jobs.js"
import Proposal from "../models/proposal.js"

export const createJob = async (req, res, next) => {
  try {
    const { type, desc } = req.body
    const savedJob = await Job.create({
      type,
      desc,
      userId: req.user._id
    })
    
    res.status(201).json({
      success: true,
      message: `Job Created`,
      data: savedJob
    })
  } catch (err) {
    next(err)
  }
}

export const updateJob = async (req,res,next)=>{
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      data: updatedJob,
      success: true,
      message: `Job Updated`
    })
  } catch (err) {
    next(err)
  }
}

export const deleteJob = async (req,res,next)=>{
  try {
    await Job.findByIdAndDelete(req.params.id)
    res.status(204).json({
      success: true,
      message: `Job has been deleted`
    })
  } catch (err) {
    next(err)
  }
}

export const getJob = async (req,res,next)=>{
  try {
    const job = await Job.find({hospital: req.params.id})
    res.status(200).json({
      success: true,
      data: job
    })
  } catch (err) {
    next(err)
  }
}

export const getJobs = async (req,res,next)=>{
  try {
    const jobs = await Job.find()
    res.status(200).json({
      data: jobs
    })
  } catch (err) {
    next(err)
  }
}

export const getUserJobs = async (req,res,next)=>{
  try {
    const jobs = await Job.find({'userId': req.user._id})
    res.status(200).json({
      data: jobs
    })
  } catch (err) {
    next(err)
  }
}

export const getLawyerJobs = async (req,res,next)=>{
  try {
    const jobs = await Job.find({ progress : 'pending' })
    console.log(jobs)
    res.status(200).json({
      data: jobs
    })
  } catch (err) {
    next(err)
  }
}

//TO GET JOBS A LAWYER/FIRM HAS LANDED
export const getLawyeredJobs = async (req,res,next)=>{
  try {
    const acceptedProposals = await Proposal.find({userId: req.user._id, status: 'accepted'})
    const result = Array.from(new Set(acceptedProposals.map(s => s._id)))
      .map(_id => {
        return _id
    })
    const jobs = await Job.find({_id: {$in: result}}).populate({path: 'userId', select: '-password -__v'})
    res.status(200).json({
      proposals: acceptedProposals,
      jobs: jobs
    })
  } catch (err) {
    next(err)
  }
}

export const applyJobs = async (req,res,next)=>{
  try {
    const savedProposal = await Proposal.create({
      userId: req.user._id,
      jobId: req.body._id,
      desc: req.body.desc
    })
    res.status(200).json({
      message: 'Proposal Sent'
    })
  } catch (err) {
    next(err)
  }
}

export const searchJobs = async (req,res,next)=>{
  try {  
    res.status(200).json(req.body)
  } catch (err) {
    next(err)
  }
}