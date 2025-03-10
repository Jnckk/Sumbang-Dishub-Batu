const express = require("express");
const supabase = require("../utils/supabase");

const router = express.Router();

router.get("/check-connection", async (req, res) => {
  try {
    if (!supabase) {
      throw new Error("Supabase client tidak tersedia!");
    }

    res.json({ success: true, message: "Koneksi ke Supabase berhasil!" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Koneksi ke Supabase gagal!",
      error: err.message,
    });
  }
});

module.exports = router;
