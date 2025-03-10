const express = require("express");
const AddRequest = require("../routes/public/AddRequest");
const ShowRequest = require("../routes/public/ShowRequest")

const router = express.Router();

router.use("/", AddRequest);
router.use("/", ShowRequest);

module.exports = router;
