const express = require("express");
const jobController = require("../controllers/jobs");

const router = express.Router();

router
  .route("/")
  .post(jobController.createJob)
  .get(jobController.getAllJobs)
  .put(jobController.updateJob)
  .delete(jobController.deleteJob);
router.route("/:id").get(jobController.getJob);
//router.route("/py").get(jobController.getPython);

module.exports = router;
