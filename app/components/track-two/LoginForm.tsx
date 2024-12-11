import React, { useState } from "react";
import axios from "~/utils/axiosConfig";
import { useAuth } from "~/providers/AuthProvider";

const LoginForm = () => {
	const { login } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/user/login`,
				{
					username,
					password,
				},
			);
			login(response.data.token);
		} catch (err: any) {
			setError(err.response?.data?.error || "Login failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleLogin}
			className="space-y-4">
			<h2 className="text-xl font-semibold">Login</h2>
			{error && <p className="text-red-500">{error}</p>}
			<div>
				<label className="block mb-1">Username</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					className="w-full px-4 py-2 border rounded bg-white"
				/>
			</div>
			<div>
				<label className="block mb-1">Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full px-4 py-2 border rounded bg-white"
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
				{loading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
};

export default LoginForm;
