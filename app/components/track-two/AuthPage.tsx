import React, { useState } from "react";
import LoginForm from "~/components/track-two/LoginForm";
import RegisterForm from "~/components/track-two/RegisterForm";
import { Button } from "~/components/ui/button";

interface AuthPageProps {
	onClose?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onClose }) => {
	const [isLogin, setIsLogin] = useState<boolean>(true);

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">
					{isLogin ? "Login" : "Register"}
				</h2>
				{onClose && (
					<Button
						variant="ghost"
						onClick={onClose}>
						✕
					</Button>
				)}
			</div>
			<div className="mb-4">
				<button
					onClick={() => setIsLogin(true)}
					className={`mr-2 ${
						isLogin
							? "text-blue-500 border-b-2 border-blue-500"
							: "text-gray-500"
					}`}>
					Login
				</button>
				<button
					onClick={() => setIsLogin(false)}
					className={`${
						!isLogin
							? "text-blue-500 border-b-2 border-blue-500"
							: "text-gray-500"
					}`}>
					Register
				</button>
			</div>
			{isLogin ? <LoginForm /> : <RegisterForm />}
		</div>
	);
};

export default AuthPage;
