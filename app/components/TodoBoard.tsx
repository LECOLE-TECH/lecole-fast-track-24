import { DndContext, type DragEndEvent, DragOverlay, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { TodoColumn } from "~/components/TodoColumn";
import { TodoItem } from "~/components/TodoItem";
import type { Todo } from "~/types/todo";
import { useState } from 'react';

interface TodoBoardProps {
  todos: Todo[];
  onStatusChange: (todoId: number, status: Todo["status"]) => void;
}

export function TodoBoard({ todos, onStatusChange }: TodoBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const filterTodosByStatus = (status: Todo["status"]) => {
    return todos.filter((todo) => todo.status === status);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const todoId = Number(active.id);
    const newStatus = over.id as Todo["status"];
    
    if (newStatus !== active.data.current?.status) {
      onStatusChange(todoId, newStatus);
    }
    setActiveId(null);
  };

  const activeTodo = activeId ? todos.find(todo => todo.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(event) => setActiveId(Number(event.active.id))}>
      <div className="grid grid-cols-3 gap-4">
        <TodoColumn
          id="backlog"
          title="Backlog"
          todos={filterTodosByStatus("backlog")}
        />
        <TodoColumn
          id="in_progress"
          title="In Progress"
          todos={filterTodosByStatus("in_progress")}
        />
        <TodoColumn
          id="done"
          title="Done"
          todos={filterTodosByStatus("done")}
        />
      </div>
      <DragOverlay>
        {activeTodo ? <TodoItem todo={activeTodo} /> : null}
      </DragOverlay>
    </DndContext>
  );
}