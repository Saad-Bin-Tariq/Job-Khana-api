const Job = require("../models/Job");
const { PythonShell } = require("python-shell");
const { spawn } = require("child_process");

const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort({
    createdAt: -1,
  });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
exports.getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No Job found with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
exports.createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
exports.updateJob = async (req, res) => {
  const {
    body: { jobId },
    user: { userId },
  } = req;
  const updateJob = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, reunValidators: true }
  );
  if (!updateJob) {
    throw new NotFoundError(`No Job found with id: ${jobId}`);
  }
  // for (const key in req.body) {
  //     if (req.body.hasOwnProperty(key)) {
  //         updateJob[key] = req.body[key];
  //     }
  //   }

  // await updateJob.save();
  res.status(StatusCodes.OK).json({ msg: "updated Succesfully", updateJob });
};
exports.deleteJob = async (req, res) => {
  const {
    body: { jobId },
    user: { userId },
  } = req;
  const delJob = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!delJob) {
    throw new NotFoundError(`No Job found with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Deleted Succesfully", delJob });
};

// exports.getPython = async (req, res) => {
//   const py = spawn("python3", ["script.py"]);
//   //   res.send(py);
//   py.stdout.on("data", (data) => {
//     console.log(`stout: ${data}`);
//   });
//   res.send(py);
// };

exports.getPytho = async (req, res) => {
  //   // Set the path to your Python script
  //   const scriptPath =
  //     "C:/Usersmsaad.tariqDesktop/node-express-course-main/node-express-course-main/06-jobs-apijob-khana-API/python/script.py";

  //   // Define options for the PythonShell
  //   const options = {
  //     pythonPath: "python3", // Use "python3" if Python 3 is needed
  //     args: [], // Optional arguments to pass to the Python script (if any)
  //   };

  //   // Create the PythonShell instance
  //   const pyshell = new PythonShell(scriptPath, options);

  //   let responseData = "";

  //   // Collect data from the Python script as it writes to stdout
  //   pyshell.on("message", (message) => {
  //     responseData += message;
  //   });

  //   // Handle the end of the Python script execution
  //   pyshell.end((err, code, signal) => {
  //     if (err) {
  //       // If there was an error executing the Python script, send an error response
  //       res.status(500).send(err);
  //     } else {
  //       // If the Python script finished successfully, send the response back to the client
  //       res.send(responseData);
  //     }
  //   });
  let options = {
    scriptPath:
      "C:/Usersmsaad.tariqDesktop/node-express-course-main/node-express-course-main/06-jobs-apijob-khana-API/python",
    pythonPath: "C:/Users/msaad.tariq/Downloads/python-3.11.4-amd64.exe",
  };
  let out = "";
  await PythonShell.run("script.py", options, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error executing Python script.");
      return;
    }
    console.log(result);
    out = result.join(""); // Join the output array into a string

    // Send the output as the response
    res.send(out);
  });
};

exports.getPython = async (req, res) => {
  const scriptPath = "../script.py";
  const pythonExecutable = "python"; // or "python3" if using Python 3

  const py = spawn(pythonExecutable, [scriptPath]);

  let responseData = "";

  py.stdout.on("data", (data) => {
    responseData += data.toString();
  });

  py.on("close", (code) => {
    if (code) {
      res.send(responseData);
    } else {
      res.status(500).send("Error executing Python script.");
    }
  });
};
