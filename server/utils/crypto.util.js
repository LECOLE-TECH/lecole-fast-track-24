import crypto from "crypto";

export const encryptPassword = (password) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    process.env.ALGORITHM,
    Buffer.from(process.env.SECRET_KEY),
    iv
  );
  let encrypted = cipher.update(password, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export const decryptPassword = (hashedPassword) => {
  const [ivHex, encrypted] = hashedPassword.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    process.env.ALGORITHM,
    Buffer.from(process.env.SECRET_KEY),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
