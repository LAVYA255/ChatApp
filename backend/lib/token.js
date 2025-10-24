import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
  const secret = process.env.JWT_SECRET || process.env.secretkey;
  if (!secret) throw new Error("JWT secret is not configured");

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";
  // For cross-domain cookies (Vercel frontend → Render backend):
  // - secure: true (requires HTTPS, which both Vercel and Render provide)
  // - sameSite: "none" (allows cross-site cookies)
  // - path: "/" (available to all routes)
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true, // Always true for HTTPS (local HTTPS won't work, but Vercel/Render both use HTTPS)
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);
  console.log("Cookie set:", { name: "jwt", secure: cookieOptions.secure, sameSite: cookieOptions.sameSite });
};
