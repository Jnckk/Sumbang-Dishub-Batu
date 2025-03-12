const Joi = require("joi");
const moment = require("moment-timezone");
const multer = require("multer");
const sharp = require("sharp");
const supabase = require("../utils/supabase");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFile = async (file, uuid, bucket) => {
  try {
    if (!file) return null;

    let filePath = `${uuid}`;

    if (file.mimetype.startsWith("image/")) {
      file.buffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
      file.mimetype = "image/webp";
      filePath += ".webp";
    } else if (file.mimetype === "application/pdf") {
      filePath += ".pdf";
    } else {
      throw new Error("Format file tidak didukung!");
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) throw uploadError;

    const { data, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60 * 24);

    if (urlError) throw urlError;

    return data.signedUrl;
  } catch (error) {
    console.error("Gagal upload file:", error.message);
    return null;
  }
};

const formatWhatsAppLink = (number) => {
  if (!number) return null;

  let formattedNumber = number.replace(/\D/g, "");

  if (formattedNumber.startsWith("0")) {
    formattedNumber = "62" + formattedNumber.slice(1);
  }

  return `https://wa.me/${formattedNumber}`;
};

const requestSchema = Joi.object({
  nama: Joi.string().max(255).required(),
  alamat: Joi.string().max(255).required(),
  no_whatsapp: Joi.string().max(50).optional(),
  no_hp: Joi.string().max(20).optional(),
  permintaan: Joi.number().integer().required(),
  detail_permintaan: Joi.string().optional(),
  lokasi: Joi.string().max(255).required(),
  status: Joi.number().integer().default(1),
  date: Joi.string().max(50).optional(),
});

const validateRequest = (req, res, next) => {
  if (req.body.no_whatsapp) {
    req.body.no_whatsapp = formatWhatsAppLink(req.body.no_whatsapp);
  }

  req.body.date = moment().tz("Asia/Jakarta").format("HH:mm, DD-MM-YYYY");

  const { error } = requestSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateFileUpload = async (req, res, next) => {
  try {
    if (req.files) {
      if (req.files["surat"]) {
        const suratFile = req.files["surat"][0];
        if (suratFile.mimetype !== "application/pdf") {
          return res.status(400).json({
            success: false,
            message: "File surat harus berformat PDF!",
          });
        }
      }

      if (req.files["foto"]) {
        const fotoFile = req.files["foto"][0];
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedImageTypes.includes(fotoFile.mimetype)) {
          return res.status(400).json({
            success: false,
            message: "File foto harus berformat JPG, JPEG, atau PNG!",
          });
        }

        req.files["foto"][0].buffer = await sharp(fotoFile.buffer)
          .webp({ quality: 80 })
          .toBuffer();
        req.files["foto"][0].mimetype = "image/webp";
        req.files["foto"][0].originalname = "image.webp";
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal memproses file upload!",
      error: error.message,
    });
  }
};

const uploadMiddleware = upload.fields([{ name: "foto" }, { name: "surat" }]);

module.exports = {
  validateRequest,
  validateFileUpload,
  uploadMiddleware,
  uploadFile,
};
