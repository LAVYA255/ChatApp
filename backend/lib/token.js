import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
  const secret = process.env.JWT_SECRET || process.env.secretkey;
  if (!secret) throw new Error("JWT secret is not configured");

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";
  // For Vercel → Render cross-domain setup:
  // - In production: use SameSite=None + Secure for cross-site cookies
  // - In dev: use Lax for localhost
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true, // HTTPS required (Vercel & Render both have HTTPS)
    sameSite: isProd ? "none" : "lax", // "none" allows cross-site; "lax" for localhost
    path: "/",
    domain: undefined, // Don't set explicit domain; let browser handle it
  };

  res.cookie("jwt", token, cookieOptions);
  console.log("✓ Cookie set with options:", { sameSite: cookieOptions.sameSite, secure: cookieOptions.secure });
};
