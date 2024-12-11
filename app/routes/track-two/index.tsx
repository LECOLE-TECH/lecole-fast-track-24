import type { Route } from "../track-one/+types";
import React, { useEffect, useState, type ChangeEvent } from "react";
import AuthPage from "~/components/track-two/AuthPage";
import AdminDashboard from "~/components/track-two/AdminDashboard";
import Dashboard from "~/components/track-two/Dashboard";
import { useAuthStore } from "~/store/authStore";
import { Button } from "~/components/ui/button";
import { io, Socket } from "socket.io-client";

interface User {
	id: number;
	username: string;
	roles: string;
}

export function meta({}: Route.MetaArgs) {
	return [{ title: "Track Two - RBAC" }];
}

export default function TrackTwo() {
	const { user, isHydrated, token } = useAuthStore();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// New States for Search, Sort, and Pagination
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortKey, setSortKey] = useState<"username" | "id">("username");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 10;

	useEffect(() => {
		if (!user) {
			const fetchUsers = async () => {
				setLoading(true);
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/api/user/usernames`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
					if (!response.ok) {
						throw new Error("Failed to fetch users.");
					}
					const data: User[] = await response.json();
					setUsers(data);
				} catch (err: any) {
					setError(err.message || "An error occurred while fetching users.");
				} finally {
					setLoading(false);
				}
			};

			fetchUsers();
		}
	}, [user]);

	useEffect(() => {
		if (user) return; // Only run if the user is not logged in

		const socket: Socket = io(`${import.meta.env.VITE_API_URL}/auth`, {
			transports: ["websocket"],
		});

		// Listen for connection
		socket.on("connect", () => {
			console.log("Connected to /auth namespace for real-time user updates.");
		});

		// Listen for 'new-user' events
		socket.on("new-user", (newUser: User) => {
			console.log("New user registered via WebSocket:", newUser);
			setUsers((prevUsers) => [...prevUsers, newUser]);
		});

		// Handle disconnection
		socket.on("disconnect", (reason) => {
			console.log("Socket disconnected:", reason);
		});

		// Handle errors
		socket.on("error", (error: any) => {
			console.error("Socket error:", error);
		});

		// Cleanup on component unmount
		return () => {
			socket.disconnect();
			console.log("Socket connection to /auth namespace closed.");
		};
	}, [user]);

	// Handlers for Search and Sort
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const handleSortKeyChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSortKey(e.target.value as "username" | "id");
	};

	const handleSortOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(e.target.value as "asc" | "desc");
	};

	// Pagination Handlers
	const handleNextPage = () => {
		setCurrentPage((prev) => prev + 1);
	};

	const handlePrevPage = () => {
		setCurrentPage((prev) => prev - 1);
	};

	// Apply Search Filter
	const filteredUsers = users.filter((user) =>
		user.username.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Apply Sorting
	const sortedUsers = filteredUsers.sort((a, b) => {
		let comparison = 0;
		if (sortKey === "username") {
			comparison = a.username.localeCompare(b.username);
		} else if (sortKey === "id") {
			comparison = a.id - b.id;
		}
		return sortOrder === "asc" ? comparison : -comparison;
	});

	// Apply Pagination
	const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
	const paginatedUsers = sortedUsers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	if (!isHydrated) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-gray-700 dark:text-gray-300">Loading...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4">
				<h1 className="text-2xl font-semibold mb-4">User List</h1>
				<div className="space-x-4 mb-6 flex flex-row items-center justify-center">
					<AuthButton mode="login" />
					<AuthButton mode="register" />
				</div>

				{/* Search and Sort Controls */}
				<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
					<input
						type="text"
						placeholder="Search by username"
						value={searchTerm}
						onChange={handleSearchChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
					/>
					<select
						value={sortKey}
						onChange={handleSortKeyChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800">
						<option value="username">Sort by Username</option>
						<option value="id">Sort by ID</option>
					</select>
					<select
						value={sortOrder}
						onChange={handleSortOrderChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800">
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</select>
				</div>

				{loading && <p className="text-gray-600">Loading users...</p>}
				{error && <p className="text-red-500 mb-4">{error}</p>}
				{!loading && !error && users.length > 0 ? (
					<>
						<div className="overflow-x-auto w-full max-w-md">
							<table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200">
								<thead className="bg-gray-200 dark:bg-gray-700">
									<tr>
										<th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											ID
										</th>
										<th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Username
										</th>
									</tr>
								</thead>
								<tbody>
									{paginatedUsers.map((u) => (
										<tr
											key={u.id}
											className="hover:bg-gray-100 dark:hover:bg-gray-600">
											<td className="py-2 px-4 border-b text-sm text-gray-800 dark:text-gray-200">
												{u.id}
											</td>
											<td className="py-2 px-4 border-b text-sm text-gray-800 dark:text-gray-200">
												{u.username}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination Controls */}
						<div className="flex justify-center items-center mt-4 space-x-4">
							<Button
								onClick={handlePrevPage}
								disabled={currentPage === 1}
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:bg-gray-200">
								Previous
							</Button>
							<span className="text-gray-700 dark:text-gray-300">
								Page {currentPage} of {totalPages}
							</span>
							<Button
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:bg-gray-200">
								Next
							</Button>
						</div>
					</>
				) : (
					!loading && !error && <p className="text-gray-600">No users found.</p>
				)}
			</div>
		);
	}

	if (user.roles === "admin") {
		return <AdminDashboard />;
	}

	return <Dashboard />;
}

interface AuthButtonProps {
	mode: "login" | "register";
}

function AuthButton({ mode }: AuthButtonProps) {
	const [showAuth, setShowAuth] = useState<boolean>(false);

	const handleClick = () => {
		setShowAuth(true);
	};

	return (
		<div>
			<Button
				variant={mode === "login" ? "default" : "secondary"}
				onClick={handleClick}>
				{mode === "login" ? "Login" : "Register"}
			</Button>
			{showAuth && (
				<div className="fixed bg-opacity-25 bg-black inset-0 flex items-center justify-center z-50 w-full h-full">
					<AuthPage onClose={() => setShowAuth(false)} />
				</div>
			)}
		</div>
	);
}
