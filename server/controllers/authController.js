import { getUserByUsername } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

export const handleLogin = async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.json({ error: "Username and password are required." });
	}

	try {
		const user = await getUserByUsername(username);
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials." });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials." });
		}

		console.log(process.env.JWT_SECRET);

		const token = jwt.sign(
			{
				id: user.id,
				username: user.username,
				roles: user.roles,
				secret_phrase: user.secret_phrase,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" },
		);

		res.json({ token });
	} catch (err) {
		next(err);
	}
};
