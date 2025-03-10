const express = require("express");
const users = require("../routes/admin/users")
const adminadd = require("../routes/admin/adminadd")

const router = express.Router();

router.use("/", users);
router.use("/", adminadd);

module.exports = router;
