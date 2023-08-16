import express from "express"
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js"
import { createJob, updateJob, getLawyerJobs, deleteJob, getJob, getJobs, applyJobs, searchJobs, getUserJobs, getLawyeredJobs } from "../controllers/jobs.js"

const router = express.Router()

//CREATE
router.post("/", verifyToken, createJob)

//POST
router.post("/apply", verifyToken, applyJobs)
router.post("/search/jobs", verifyToken, searchJobs)

//UPDATE
router.put("/:id", verifyToken, updateJob)

//DELETE
router.delete("/:id", verifyToken, deleteJob)

//GET
router.get("/find/:id", verifyToken, getJob)

//GET ALL
router.get("/:id", verifyUser, getUserJobs)
router.get("/", verifyToken, getJobs)
router.get("/lawyer_jobs", verifyToken, getLawyerJobs)
router.get("/lawyer/:id", verifyToken, getLawyerJobs)
router.get("/lawyered/:id", verifyToken, getLawyeredJobs)



export default router
