import { useEffect, useState } from "react";
import { create } from "zustand";

interface SyncStore {
	isSyncing: boolean;
	lastSyncTime: number | null;
	setIsSyncing: (status: boolean) => void;
	setLastSyncTime: (time: number | null) => void;
}

const useSyncStore = create<SyncStore>((set) => ({
	isSyncing: false,
	lastSyncTime: null,
	setIsSyncing: (status) => set({ isSyncing: status }),
	setLastSyncTime: (time) => set({ lastSyncTime: time }),
}));

interface SyncLogEntry {
	action: string;
	data: any;
	timestamp: string;
}

// Update the Record type in syncWithBackend:
const syncLogs: Record<number, SyncLogEntry[]> = {};

export function useOfflineSync(
	localDb: any,
	syncCallback: () => Promise<void>,
) {
	const { isSyncing, lastSyncTime, setIsSyncing, setLastSyncTime } =
		useSyncStore();
	const [syncStatus, setSyncStatus] = useState<
		"online" | "offline" | "syncing"
	>("online");

	useEffect(() => {
		if (!localDb) return;

		// Set up persistence
		localDb.exec(`
      PRAGMA journal_mode = PERSIST;
      PRAGMA synchronous = NORMAL;
    `);

		// Create sync_log table for conflict resolution
		localDb.exec(`
      CREATE TABLE IF NOT EXISTS sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo_id INTEGER,
        action TEXT,
        data TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
	}, [localDb]);

	const attemptSync = async () => {
		if (!localDb || isSyncing) return;

		try {
			setIsSyncing(true);
			setSyncStatus("syncing");
			await syncCallback();
			setLastSyncTime(Date.now());
			setSyncStatus("online");
		} catch (error) {
			setSyncStatus("offline");
			console.error("Sync failed:", error);
		} finally {
			setIsSyncing(false);
		}
	};

	return {
		syncStatus,
		lastSyncTime,
		attemptSync,
		isSyncing,
	};
}
