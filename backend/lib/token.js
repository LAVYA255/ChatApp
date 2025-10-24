import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
  const secret = process.env.JWT_SECRET || process.env.secretkey;
  if (!secret) throw new Error("JWT secret is not configured");

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";
  // Use secure cross-site cookies in production when frontend and backend are on different domains
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);
};
