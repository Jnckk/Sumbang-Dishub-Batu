const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const supabase = require("../../utils/supabase");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !user)
    return res
      .status(401)
      .json({ success: false, message: "User tidak ditemukan" });

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return res.status(401).json({ success: false, message: "Password salah" });

  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  await supabase
    .from("users")
    .update({ refresh_token: refreshToken })
    .eq("id", user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, accessToken });
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await supabase
      .from("users")
      .update({ refresh_token: null })
      .eq("refresh_token", refreshToken);
    res.clearCookie("refreshToken");
  }

  res.json({ success: true, message: "Logout berhasil!" });
});

router.get("/role", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    res.json({ success: true, role: decoded.role });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
});


router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const { data: user, error } = await supabase
    .from("users")
    .select("id, role, refresh_token")
    .eq("refresh_token", refreshToken)
    .single();

  if (error || !user)
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });
  }
});

module.exports = router;
