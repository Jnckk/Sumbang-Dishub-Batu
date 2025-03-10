const express = require("express");
const supabase = require("../../utils/supabase");

const router = express.Router();

router.get("/public-status", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("requests")
      .select(
        `
        nama, 
        lokasi, 
        date, 
        permintaan (name), 
        status (name)
      `
      )
      .order("date", { ascending: false });

    if (error) throw error;

    const formattedData = data.map((item) => ({
      nama: item.nama,
      lokasi: item.lokasi,
      date: item.date,
      permintaan: item.permintaan?.name || "Unknown",
      status: item.status?.name || "Unknown",
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data!",
      error: err.message,
    });
  }
});

module.exports = router;
