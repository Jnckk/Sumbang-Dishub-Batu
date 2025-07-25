const express = require("express");
const { v4: uuidv4 } = require("uuid");
const {
  validateRequest,
  validateFileUpload,
  uploadMiddleware,
  uploadFile,
} = require("../../middlewares/validateRequest");
const supabase = require("../../utils/supabase");

const router = express.Router();

router.post(
  "/add-request",
  uploadMiddleware,
  validateFileUpload,
  validateRequest,
  async (req, res) => {
    try {
      const {
        nama,
        alamat,
        no_whatsapp,
        no_hp,
        permintaan,
        detail_permintaan,
        lokasi,
        status = 1,
        date,
      } = req.body;

      const newId = uuidv4();

      const suratUrl = req.files["surat"]
        ? await uploadFile(req.files["surat"][0], newId, "pdf")
        : null;
      const fotoUrl = req.files["foto"]
        ? await uploadFile(req.files["foto"][0], newId, "images")
        : null;

      const { data, error } = await supabase
        .from("requests")
        .insert([
          {
            id: newId,
            nama,
            alamat,
            no_whatsapp,
            no_hp,
            permintaan,
            detail_permintaan,
            lokasi,
            surat: suratUrl,
            foto: fotoUrl,
            status,
            date,
          },
        ])
        .select(`*, permintaan: complaint(name), status(name)`);

      if (error) {
        throw error;
      }

      res.status(201).json({
        success: true,
        message: "Data berhasil ditambahkan!",
        data: {
          id: data[0].id,
          nama: data[0].nama,
          alamat: data[0].alamat,
          no_whatsapp: data[0].no_whatsapp,
          no_hp: data[0].no_hp,
          permintaan: data[0].permintaan.name,
          detail_permintaan: data[0].detail_permintaan,
          lokasi: data[0].lokasi,
          surat: data[0].surat,
          foto: data[0].foto,
          status: data[0].status.name,
          date: data[0].date,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan data!",
        error: err.message,
      });
    }
  }
);

module.exports = router;
