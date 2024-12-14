import { useDroppable } from '@dnd-kit/core';
import type { Todo } from "~/types/todo";
import { TodoItem } from "./TodoItem";
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useMemo } from 'react';

interface TodoColumnProps {
  id: string;
  title: string;
  todos: Todo[];
}

export function TodoColumn({ id, title, todos }: TodoColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });
  const todoIds = useMemo(() => todos.map((todo) => todo.id), [todos]);
  return (
    <div ref={setNodeRef} className="border rounded-lg p-4">
      <h2 className="font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        <SortableContext items={todoIds}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
