const Joi = require("joi");
const moment = require("moment-timezone");

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

const validateFileUpload = (req, res, next) => {
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
    }
  }

  next();
};

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

module.exports = { validateRequest, validateFileUpload };
