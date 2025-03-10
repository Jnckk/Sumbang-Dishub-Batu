const express = require("express");
const auth = require("../routes/users/Auth");
const usersdashboard = require("../routes/users/UserDashboard");

const router = express.Router();

router.use("/", auth);
router.use("/", usersdashboard);

module.exports = router;
