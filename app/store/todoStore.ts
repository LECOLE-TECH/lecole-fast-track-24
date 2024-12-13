import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Todo {
	id: number;
	title: string;
	status: "backlog" | "in_progress" | "done";
	synced: boolean;
	created_at: string;
}

interface TodoState {
	todos: Todo[];
	addTodo: (todo: Todo) => void;
	updateTodo: (todo: Todo) => void;
	setTodos: (todos: Todo[]) => void;
	removeTodo: (id: number) => void;
}

export const useTodoStore = create<TodoState>()(
	persist(
		(set) => ({
			todos: [],
			addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
			updateTodo: (updatedTodo) =>
				set((state) => ({
					todos: state.todos.map((todo) =>
						todo.id === updatedTodo.id ? updatedTodo : todo,
					),
				})),
			setTodos: (todos) => set({ todos }),
			removeTodo: (id) =>
				set((state) => ({
					todos: state.todos.filter((todo) => todo.id !== id),
				})),
		}),
		{
			name: "todo-storage", 
			storage: createJSONStorage(() => localStorage),
		},
	),
);
