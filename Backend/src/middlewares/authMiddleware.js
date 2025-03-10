const jwt = require("jsonwebtoken");
const supabase = require("../utils/supabase");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const TOKEN_EXPIRY = "15m";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken)
        return res.status(403).json({
          success: false,
          message: "Token expired, please log in again.",
        });

      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

        const { data: dbUser, error } = await supabase
          .from("users")
          .select("id, role, refresh_token")
          .eq("refresh_token", refreshToken)
          .single();

        if (error || !dbUser)
          return res
            .status(403)
            .json({ success: false, message: "Invalid refresh token" });

        const newAccessToken = jwt.sign(
          { id: dbUser.id, role: dbUser.role },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRY }
        );

        req.user = dbUser;
        req.newAccessToken = newAccessToken;
        return next();
      } catch (refreshErr) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid refresh token" });
      }
    } else {
      req.user = user;
      return next();
    }
  });
};

module.exports = authMiddleware;
