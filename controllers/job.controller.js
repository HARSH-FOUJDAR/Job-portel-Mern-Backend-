import { Job } from "../models/job.model.js";

// post by admin
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      requirements,
      location,
      experienceLevel,
      jobType,
      position,
      company,
    } = req.body;

    if (
      !title ||
      !description ||
      !salary ||
      !requirements ||
      !location ||
      !experienceLevel ||
      !jobType ||
      !position
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const userId = req.id;
    const job = new Job({
      title,
      description,
      salary,
      requirements: requirements.split(","),
      location,
      experienceLevel,
      jobType,
      position: Number(position),
      company,
      created_by: userId,
    });
    await job.save();
    res.status(201).json({
      message: "job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log("error in post job", error);
  }
};

// get All jobs
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    console.log("error in get all jobs", error);
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate({
      path: "application",
    });
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "job fetched successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log("error in get all jobs", error);
  }
};

// admin jobs

export const adminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId });
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    console.log("error in get all jobs", error);
  }
};
