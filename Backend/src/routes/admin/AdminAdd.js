const express = require("express");
const bcrypt = require("bcryptjs");
const supabase = require("../../utils/supabase");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: roleData, error: roleError } = await supabase
      .from("role")
      .select("id")
      .eq("name", "SuperAdmin")
      .single();

    if (roleError || !roleData) {
      return res.status(400).json({
        success: false,
        message: "Gagal mendapatkan role SuperAdmin!",
        error: roleError?.message || "Role tidak ditemukan",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password: hashedPassword, role: roleData.id }]);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal menambahkan SuperAdmin!",
        error: error.message,
      });
    }

    res.json({ success: true, message: "SuperAdmin berhasil didaftarkan!" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server!",
      error: err.message,
    });
  }
});

module.exports = router;
