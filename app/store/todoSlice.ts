import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { localDbService } from '~/services/localDb';
import type { Todo } from '~/types/todo';

interface TodoState {
  todos: Todo[];
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  error: null,
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    updateTodoStatus: (state, action: PayloadAction<{ todoId: number; status: Todo['status'] }>) => {
      const todo = state.todos.find(t => t.id === action.payload.todoId);
      if (todo) {
        todo.status = action.payload.status;
        todo.synced = false;
      }
      localDbService.updateTodoStatus(action.payload.todoId, action.payload.status);
    }
  }
});

export const { setTodos, setError, updateTodoStatus } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
