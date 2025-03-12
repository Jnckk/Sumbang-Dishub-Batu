const express = require("express");
const supabase = require("../../utils/supabase");
const authMiddleware = require("../../middlewares/authMiddleware");
const { getSignedUrl } = require("../../middlewares/validateDetail");

const router = express.Router();

router.get("/users-dashboard", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("requests")
      .select("id, nama, no_hp, lokasi");

    if (error) throw error;

    const response = { success: true, data };

    if (req.newAccessToken) response.newAccessToken = req.newAccessToken;

    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data!",
      error: err.message,
    });
  }
});

router.get("/detail/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("requests")
      .select(
        "id, nama, alamat, no_whatsapp, no_hp, lokasi, detail_permintaan, date, permintaan (name), status (name), surat, foto"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan!",
      });
    }

    const suratUrl = data.surat
      ? await getSignedUrl("pdf", `${data.id}.pdf`)
      : null;
    const fotoUrl = data.foto
      ? await getSignedUrl("images", `${data.id}.webp`)
      : null;

    const formattedData = {
      id: data.id,
      nama: data.nama,
      alamat: data.alamat,
      no_whatsapp: data.no_whatsapp,
      no_hp: data.no_hp,
      lokasi: data.lokasi,
      date: data.date,
      permintaan: data.permintaan?.name || "Unknown",
      detail_permintaan: data.detail_permintaan,
      surat: suratUrl,
      foto: fotoUrl,
      status: data.status?.name || "Unknown",
    };

    const response = { success: true, data: formattedData };

    if (req.newAccessToken) response.newAccessToken = req.newAccessToken;

    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data!",
      error: err.message,
    });
  }
});

router.patch("/edit-status/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  if (!status_id) {
    return res.status(400).json({
      success: false,
      message: "status_id harus diberikan!",
    });
  }

  try {
    const { data: existingRequest, error: requestError } = await supabase
      .from("requests")
      .select("id")
      .eq("id", id)
      .single();

    if (requestError || !existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Request tidak ditemukan!",
      });
    }

    const { data: existingStatus, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("id", status_id)
      .single();

    if (statusError || !existingStatus) {
      return res.status(400).json({
        success: false,
        message: "status_id tidak valid!",
      });
    }

    const { error: updateError } = await supabase
      .from("requests")
      .update({ status: status_id })
      .eq("id", id);

    if (updateError) throw updateError;

    const response = {
      success: true,
      message: "Status berhasil diperbarui!",
    };

    if (req.newAccessToken) response.newAccessToken = req.newAccessToken;

    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui status!",
      error: err.message,
    });
  }
});

module.exports = router;
