const express = require("express");
const users = require("../routes/admin/Users")
const adminadd = require("../routes/admin/AdminAdd")

const router = express.Router();

router.use("/", users);
router.use("/", adminadd);

module.exports = router;
