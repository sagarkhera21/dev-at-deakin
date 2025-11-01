
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
const app = express();

// ✅ FIX CORS for deployed frontend
app.use((req, res, next) => {
  // Replace with your deployed frontend URL
  res.header("Access-Control-Allow-Origin", "https://dev-deakins.netlify.app"); 
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight OK
  }
  next();
});

app.use(express.json());

const PORT = process.env.PORT || 5050;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const verificationCodes = {};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===== Route: Send 2FA =====
app.post("/send-2fa", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const code = generateCode();
  const expires = Date.now() + 2 * 60 * 1000;
  verificationCodes[email] = { code, expires };

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Your DEV@Deakin Verification Code",
    text: `Your verification code is ${code}`,
    html: `<p>Your verification code is <b>${code}</b>. It expires in 2 minutes.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Code sent to ${email}: ${code}`);
    res.json({ success: true });
  } catch (error) {
    console.error("SendGrid error:", error);
    res.status(500).json({ error: "Failed to send verification email" });
  }
});

// ===== Route: Verify 2FA =====
app.post("/verify-2fa", (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];
  if (!record) return res.status(400).json({ error: "No code found" });
  if (Date.now() > record.expires) return res.status(400).json({ error: "Code expired" });
  if (record.code !== code) return res.status(400).json({ error: "Invalid code" });
  delete verificationCodes[email];
  res.json({ success: true });
});

// ===== Start Server =====
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
