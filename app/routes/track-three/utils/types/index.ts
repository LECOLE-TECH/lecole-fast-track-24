export interface Todo {
    id: number;
    title: string;
    status: "backlog" | "in_progress" | "done";
    synced: boolean;
    created_at: string;
    isDeleted:boolean,
    isAdded:boolean
}

export interface BackendTodo{
    id: number;
    title: string;
    status: "backlog" | "in_progress" | "done";
    created_at: string;
}
  
  
export interface Column {
    id: 'backlog' | 'in_progress' | 'done';
    title: string;
}

export interface SyncStatus {
    status: 'synced' | 'syncing' | 'error';
    lastSynced: number | null;
}
  
  