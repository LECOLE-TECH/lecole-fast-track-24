import type { Route } from "../track-three/+types";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { DndContext, type DragEndEvent, DragOverlay } from "@dnd-kit/core";
import DroppableColumn from "~/components/track-three/DropableColumn";
import DraggableTodo from "~/components/track-three/DraggableTodo";
import { SyncIndicator } from "~/components/track-three/SyncIndicator";
import { useOfflineSync } from "~/hooks/useOfflineSync";
import { snowflakeIdGenerator } from "~/lib/snowflake";

interface Todo {
	id: bigint;
	title: string;
	status: "backlog" | "in_progress" | "done";
	synced: boolean;
	created_at: string;
	updated_at: string;
}

// Droppable Column Component

export function meta({}: Route.MetaArgs) {
	return [{ title: "Track Three" }];
}

export default function TrackThree() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [error, setError] = useState<string>("");
	const [localDb, setLocalDb] = useState<any>(null);
	const [newTodoTitle, setNewTodoTitle] = useState("");

	const syncWithBackend = async () => {
		try {
			// Get all unsynced todos and their sync logs
			const unsyncedTodos: Partial<Todo>[] = [];
			const syncLogs: Record<number, { action: string; data: any }[]> = {};

			localDb.exec({
				sql: `
					SELECT t.id, t.title, t.status, t.created_at,
						   sl.action, sl.data, sl.timestamp
					FROM todos t
					LEFT JOIN sync_log sl ON t.id = sl.todo_id
					WHERE t.synced = 0
					ORDER BY sl.timestamp ASC
				`,
				callback: (row: any) => {
					const todoId = row[0];
					if (!syncLogs[todoId]) {
						syncLogs[todoId] = [];
						unsyncedTodos.push({
							id: todoId,
							title: row[1],
							status: row[2],
							created_at: row[3],
						});
					}
					if (row[4]) {
						// if there's a sync log entry
						syncLogs[todoId].push({
							action: row[4],
							data: JSON.parse(row[5]),
						});
					}
				},
			});

			const response = await fetch("http://localhost:3000/api/todos/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					todos: unsyncedTodos,
					syncLogs, // Send sync logs for conflict resolution
				}),
			});

			if (!response.ok) throw new Error("Sync failed");

			const serverTodos = await response.json();

			// Update local database with server data
			localDb.exec("BEGIN TRANSACTION");

			// Clear sync logs for successfully synced todos
			localDb.exec("DELETE FROM sync_log");

			// Mark all existing todos as synced
			localDb.exec("UPDATE todos SET synced = 1");

			// Update or insert server todos
			serverTodos.forEach((todo: Todo) => {
				let exists = false;
				localDb.exec({
					sql: "SELECT COUNT(*) as count FROM todos WHERE id = ?",
					bind: [todo.id],
					callback: (row: any) => {
						exists = row[0] > 0;
					},
				});

				if (exists) {
					localDb.exec({
						sql: "UPDATE todos SET title = ?, status = ?, synced = 1 WHERE id = ?",
						bind: [todo.title, todo.status, todo.id],
					});
				} else {
					localDb.exec({
						sql: "INSERT INTO todos (id, title, status, synced) VALUES (?, ?, ?, 1)",
						bind: [todo.id, todo.title, todo.status],
					});
				}
			});

			localDb.exec("COMMIT");
			loadLocalData(localDb);
		} catch (err: any) {
			localDb.exec("ROLLBACK");
			setError("Failed to sync with backend: " + err.message);
			console.error(err);
			throw err;
		}
	};

	const { syncStatus, lastSyncTime, attemptSync, isSyncing } = useOfflineSync(
		localDb,
		syncWithBackend,
	);

	useEffect(() => {
		const initLocalDb = async () => {
			try {
				const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm"))
					.default;
				const sqlite3 = await sqlite3InitModule();
				const db = new sqlite3.oo1.DB("/local-todos.sqlite3", "ct");

				// Create local todos table
				db.exec(`
          CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
            synced INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

				db.exec(`
          CREATE TRIGGER IF NOT EXISTS update_todos_timestamp 
          AFTER UPDATE ON todos
          BEGIN
            UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END;
        `);

				setLocalDb(db);
				loadLocalData(db);
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Failed to initialize local database");
			}
		};

		if (typeof window !== "undefined") {
			initLocalDb();
		}

		return () => {
			if (localDb) {
				localDb.close();
			}
		};
	}, []);

	const loadLocalData = (db: any) => {
		const results: Todo[] = [];
		db.exec({
			sql: "SELECT id, title, status, synced, created_at, updated_at FROM todos",
			callback: (row: any) => {
				results.push({
					id: BigInt(row[0]),
					title: row[1],
					status: row[2],
					synced: Boolean(row[3]),
					created_at: row[4],
					updated_at: row[5],
				});
			},
		});
		setTodos(results);
	};

	const addTodo = () => {
		if (!newTodoTitle.trim()) return;

		try {
			// Generate Snowflake ID
			const todoId = snowflakeIdGenerator.generate();

			localDb.exec("BEGIN TRANSACTION");

			// Insert the todo with Snowflake ID
			localDb.exec({
				sql: "INSERT INTO todos (id, title, synced) VALUES (?, ?, 0)",
				bind: [todoId.toString(), newTodoTitle],
			});

			// Log the change
			localDb.exec({
				sql: "INSERT INTO sync_log (todo_id, action, data) VALUES (?, 'create', ?)",
				bind: [todoId.toString(), JSON.stringify({ title: newTodoTitle })],
			});

			localDb.exec("COMMIT");
			setNewTodoTitle("");
			loadLocalData(localDb);
		} catch (err: any) {
			localDb.exec("ROLLBACK");
			setError("Failed to add todo");
		}
	};

	const updateTodoStatus = (todoId: bigint, newStatus: Todo["status"]) => {
		try {
			localDb.exec("BEGIN TRANSACTION");

			localDb.exec({
				sql: "UPDATE todos SET status = ?, synced = 0 WHERE id = ?",
				bind: [newStatus, todoId.toString()],
			});

			localDb.exec({
				sql: "INSERT INTO sync_log (todo_id, action, data) VALUES (?, 'update', ?)",
				bind: [todoId.toString(), JSON.stringify({ status: newStatus })],
			});

			localDb.exec("COMMIT");
			loadLocalData(localDb);
		} catch (err: any) {
			localDb.exec("ROLLBACK");
			setError("Failed to update todo status");
		}
	};

	// Auto-sync every 15 seconds
	useEffect(() => {
		if (!localDb) return;
		const interval = setInterval(attemptSync, 15000);
		return () => clearInterval(interval);
	}, [localDb]);

	const filterTodosByStatus = (status: Todo["status"]) => {
		return todos.filter((todo) => todo.status === status);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const todoId = BigInt(active.id as string);
			const newStatus = over.id as Todo["status"];
			updateTodoStatus(todoId, newStatus);
		}
	};

	return (
		<div className="flex flex-col p-8 gap-4 min-h-screen">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Todo App</h1>
				<SyncIndicator
					status={syncStatus}
					lastSyncTime={lastSyncTime}
					onSyncClick={attemptSync}
					isSyncing={isSyncing}
				/>
			</div>

			{error && <div className="text-red-500 mb-4">Error: {error}</div>}

			<div className="flex gap-2 mb-4">
				<input
					type="text"
					value={newTodoTitle}
					onChange={(e) => setNewTodoTitle(e.target.value)}
					className="flex-1 px-3 py-2 border rounded"
					placeholder="Add new todo..."
				/>
				<Button onClick={addTodo}>Add Todo</Button>
			</div>

			<DndContext onDragEnd={handleDragEnd}>
				<div className="grid grid-cols-3 gap-4">
					<DroppableColumn
						id="backlog"
						title="Backlog">
						{filterTodosByStatus("backlog").map((todo) => (
							<DraggableTodo
								key={todo.id}
								todo={todo}
								updateStatus={updateTodoStatus}
							/>
						))}
					</DroppableColumn>

					<DroppableColumn
						id="in_progress"
						title="In Progress">
						{filterTodosByStatus("in_progress").map((todo) => (
							<DraggableTodo
								key={todo.id}
								todo={todo}
								updateStatus={updateTodoStatus}
							/>
						))}
					</DroppableColumn>

					<DroppableColumn
						id="done"
						title="Done">
						{filterTodosByStatus("done").map((todo) => (
							<DraggableTodo
								key={todo.id}
								todo={todo}
								updateStatus={updateTodoStatus}
							/>
						))}
					</DroppableColumn>
				</div>
			</DndContext>
		</div>
	);
}
