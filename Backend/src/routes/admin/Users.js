const express = require("express");
const supabase = require("../../utils/supabase");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

const superAdminMiddleware = async (req, res, next) => {
  const { data: roleData, error: roleError } = await supabase
    .from("role")
    .select("id")
    .eq("name", "SuperAdmin")
    .single();

  if (roleError || !roleData) {
    return res
      .status(500)
      .json({ success: false, message: "Role tidak ditemukan!" });
  }

  const superAdminId = roleData.id;

  if (req.user.role !== superAdminId) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  next();
};

router.post(
  "/add-users",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {
    const { username, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: roleExists, error: roleError } = await supabase
      .from("role")
      .select("id")
      .eq("id", role_id)
      .single();

    if (roleError || !roleExists) {
      return res
        .status(400)
        .json({ success: false, message: "Role ID tidak valid!" });
    }

    const { error } = await supabase.from("users").insert([
      {
        username,
        password: hashedPassword,
        role: role_id,
      },
    ]);

    if (error)
      return res
        .status(400)
        .json({ success: false, message: "Gagal menambahkan user!", error });

    res.json({ success: true, message: "User berhasil ditambahkan!" });
  }
);

router.put(
  "/update/:id",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { newUsername, newPassword } = req.body;

    if (!newUsername && !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Harap berikan username atau password baru!",
      });
    }

    let updateData = {};

    if (newUsername) {
      updateData.username = newUsername;
    }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id);

    if (error)
      return res.status(400).json({ success: false, message: error.message });

    res.json({ success: true, message: "Data berhasil diperbarui!" });
  }
);

router.delete(
  "/delete-user/:id",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {
    const { id } = req.params;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan!",
      });
    }

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Gagal menghapus user!",
        error: error.message,
      });
    }

    res.json({ success: true, message: "User berhasil dihapus!" });
  }
);

router.get(
  "/list-users",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, role");

    if (error)
      return res
        .status(400)
        .json({ success: false, message: "Gagal mengambil data!", error });

    res.json({ success: true, users: data });
  }
);

module.exports = router;
