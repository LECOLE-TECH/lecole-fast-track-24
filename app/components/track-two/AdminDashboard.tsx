import React, { useEffect, useState, type ChangeEvent } from "react";
import { useAuthStore } from "~/store/authStore";
import { Button } from "~/components/ui/button";
import useSocket from "~/hooks/useSocket";

interface User {
	id: number;
	username: string;
	roles: string;
	secret_phrase: string;
}

const AdminDashboard = () => {
	const { user, logout, token } = useAuthStore();
	const socket = useSocket();
	const [users, setUsers] = useState<User[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [editingSecretId, setEditingSecretId] = useState<number | null>(null);
	const [newSecret, setNewSecret] = useState<string>("");
	const [newAdminSecret, setNewAdminSecret] = useState<string>("");

	// New States for Search, Sort, and Pagination
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortKey, setSortKey] = useState<"username" | "id">("username");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const fetchUsers = async () => {
			if (!token) return;
			setLoading(true);
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/user`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
				const data = await response.json();
				setUsers(data);
			} catch (err: any) {
				setError(err.response?.data?.error || "Failed to fetch users.");
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [token]);

	useEffect(() => {
		if (!socket) return;

		console.log("Socket instance ID:", socket.id);

		const handleNewUser = (newUser: User) => {
			console.log("New user received via socket:", newUser);
			setUsers((prevUsers) => [...prevUsers, newUser]);
		};

		// Listen for secret phrase updates
		const handleSecretPhraseUpdated = (data: {
			userId: number;
			newSecretPhrase: string;
		}) => {
			console.log("Secret phrase updated via socket:", data);
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === data.userId
						? { ...user, secret_phrase: data.newSecretPhrase }
						: user,
				),
			);
		};

		// Listen for error events
		const handleError = (error: any) => {
			console.error("Socket error:", error);
			setError(error.error || "An error occurred.");
		};

		// Listen for success events
		const handleSuccess = (message: any) => {
			console.log("Socket success:", message);
			alert(message.message);
		};

		// Register event listeners
		socket.on("new-user", handleNewUser);
		socket.on("secret-phrase-updated", handleSecretPhraseUpdated);
		socket.on("error", handleError);
		socket.on("success", handleSuccess);

		// Cleanup event listeners on component unmount or socket change
		return () => {
			socket.off("new-user", handleNewUser);
			socket.off("secret-phrase-updated", handleSecretPhraseUpdated);
			socket.off("error", handleError);
			socket.off("success", handleSuccess);
		};
	}, [socket]);

	// Handlers for Search and Sort
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1); // Reset to first page on search
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

	// Function to update secret phrase via Socket.io
	const handleUpdateSecret = (id?: number) => {
		if (!id) return;
		if (!newSecret) {
			alert("Please enter a new secret phrase.");
			return;
		}
		if (!socket) {
			alert("Socket connection not established.");
			return;
		}

		// Emit 'update-secret-phrase' event to the server
		socket.emit("update-secret-phrase", {
			userId: id,
			newSecretPhrase: newSecret,
			actorId: user?.username,
		});

		// Reset input fields
		setEditingSecretId(null);
		setNewSecret("");
	};

	const handleUpdateAdminSecret = (id?: number) => {
		if (!id) return;
		if (!newAdminSecret) {
			alert("Please enter a new secret phrase.");
			return;
		}
		if (!socket) {
			alert("Socket connection not established.");
			return;
		}

		// Emit 'update-secret-phrase' event to the server
		socket.emit("update-secret-phrase", {
			userId: id,
			newSecretPhrase: newAdminSecret,
			actorId: user?.username,
		});

		// Reset input fields
		setEditingSecretId(null);
		setNewAdminSecret("");
	};

	return (
		<div className="p-6">
			{/* Admin Account Details */}
			<div className="flex justify-between items-center mb-4">
				<div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
					<h2 className="text-2xl">Admin Dashboard</h2>
					<p>
						<strong>ID:</strong> {user?.id}
					</p>
					<p>
						<strong>Username:</strong> {user?.username}
					</p>
					<p>
						<strong>Roles:</strong> {user?.roles}
					</p>
					<p>
						<strong>Secret Phrase:</strong>{" "}
						{users.find((u) => u.id === user?.id)?.secret_phrase}
					</p>

					<div className="mt-4">
						<input
							type="text"
							value={newAdminSecret}
							onChange={(e) => setNewAdminSecret(e.target.value)}
							placeholder="New Secret Phrase"
							className="px-2 border rounded bg-white text-sm py-1"
						/>
						<Button
							onClick={() => handleUpdateAdminSecret(user?.id)}
							className="ml-2 bg-blue-500 text-white px-2 rounded text-sm py-1">
							Update
						</Button>
					</div>
					<Button
						onClick={() => logout()}
						className="mt-4">
						Logout
					</Button>
				</div>
			</div>

			{/* Display All Users' Information */}
			<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
				<h3 className="text-xl mb-4">All Users</h3>
				{/* Search and Sort Controls */}
				<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 pb-4">
					<input
						type="text"
						placeholder="Search by username"
						value={searchTerm}
						onChange={handleSearchChange}
						className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
					/>
					<select
						value={sortKey}
						onChange={handleSortKeyChange}
						className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800">
						<option value="username">Sort by Username</option>
						<option value="id">Sort by ID</option>
					</select>
					<select
						value={sortOrder}
						onChange={handleSortOrderChange}
						className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800">
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</select>
				</div>
				{loading ? (
					<p>Loading users...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<>
						<table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200">
							<thead className="bg-gray-200 dark:bg-gray-700">
								<tr>
									<th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										ID
									</th>
									<th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Username
									</th>
									<th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Roles
									</th>
									<th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Secret Phrase
									</th>
									<th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
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
										<td className="py-2 px-4 border-b text-sm text-gray-800 dark:text-gray-200">
											{u.roles}
										</td>
										<td className="py-2 px-4 border-b text-sm text-gray-800 dark:text-gray-200">
											{u.secret_phrase}
										</td>
										<td className="py-2 px-4 border-b text-sm text-gray-800 dark:text-gray-200">
											{editingSecretId === u.id ? (
												<div className="flex items-center px-2 py-1 justify-center">
													<input
														type="text"
														value={newSecret}
														onChange={(e) => setNewSecret(e.target.value)}
														placeholder="New Secret Phrase"
														className="px-2 py-1 border rounded mr-2 bg-white"
													/>
													<Button
														onClick={() => handleUpdateSecret(u.id)}
														className="bg-green-500 text-white px-2 py-1 rounded mr-2">
														Save
													</Button>
													<Button
														onClick={() => {
															setEditingSecretId(null);
															setNewSecret("");
														}}
														className="bg-gray-500 text-white px-2 py-1 rounded">
														Cancel
													</Button>
												</div>
											) : (
												<Button
													onClick={() => setEditingSecretId(u.id)}
													className="bg-blue-500 text-white px-2 py-1 rounded">
													Update Secret
												</Button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>

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
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
