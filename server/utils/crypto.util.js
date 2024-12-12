import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");
if (secretKey.length !== 32) {
  throw new Error("SECRET_KEY must be exactly 32 bytes for aes-256-cbc.");
}

export const encryptPassword = (password) => {
  const iv = crypto.randomBytes(16); // Tạo IV dài 16 byte
  const cipher = crypto.createCipheriv(process.env.ALGORITHM, secretKey, iv);

  let encrypted = cipher.update(password, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

export const decryptPassword = (hashedPassword) => {
  const [ivHex, encrypted] = hashedPassword.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    process.env.ALGORITHM,
    secretKey,
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};
