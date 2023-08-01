const Job = require('../models/Job')
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')
const {StatusCodes} = require('http-status-codes')

exports. getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort({createdAt: -1})
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
 }
exports. getJob = async (req, res) => {
    const {user: {userId}, params: {id: jobId}} = req
    const job = await Job.findOne({_id: jobId, createdBy: userId})
    if(!job){
        throw new NotFoundError(`No Job found with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
 }
exports. createJob = async (req, res) => {
    req.body.createdBy = req.user.userId  
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
 }
exports. updateJob = async (req, res) => {
    const {body: {jobId}, user: {userId}} = req
    const updateJob = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, reunValidators: true});
    if(!updateJob){
        throw new NotFoundError(`No Job found with id: ${jobId}`)
    }
    // for (const key in req.body) {
    //     if (req.body.hasOwnProperty(key)) {
    //         updateJob[key] = req.body[key];
    //     }
    //   }
      
    // await updateJob.save();
    res.status(StatusCodes.OK).json({msg: 'updated Succesfully', updateJob})
 }
exports. deleteJob = async (req, res) => {
    const {body: {jobId}, user: {userId}} = req
    const delJob = await Job.findByIdAndRemove({
        _id: jobId, createdBy: userId
    })
    if(!delJob){
        throw new NotFoundError(`No Job found with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({msg: 'Deleted Succesfully', delJob})
 
 }
