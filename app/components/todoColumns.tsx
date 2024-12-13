import React from "react";

import type { Todo, TodoLocal } from "~/types/todos";
import { TodoItem } from "./todoItem";

interface TodoColumnProps {
  id: Todo["status"];
  title: string;
  todos: TodoLocal[];
  onDragStop: (id: number, x: number, y: number) => void;
}

const TodoColumn: React.FC<TodoColumnProps> = React.memo(
  ({ id, title, todos, onDragStop }) => {
    return (
      <div
        className='border rounded-lg p-4 relative'
        style={{ height: "600px" }}
      >
        <h2 className='font-bold mb-4'>{title}</h2>
        <div className='space-y-2 relative h-full'>
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              index={index}
              todo={todo}
              onDragStop={onDragStop}
            />
          ))}
        </div>
      </div>
    );
  }
);

TodoColumn.displayName = "TodoColumn";

export default TodoColumn;
