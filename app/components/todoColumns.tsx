import React from "react";
import { useDrop } from "react-dnd";
import { motion } from "framer-motion";
import type { Todo, TodoLocal } from "~/types/todos";
import { TodoItem } from "./todoItem";

interface TodoColumnProps {
  id: Todo["status"];
  title: string;
  todos: TodoLocal[];
  updateTodoStatus: (todoId: number, newStatus: Todo["status"]) => void;
}

const TodoColumn: React.FC<TodoColumnProps> = React.memo(
  ({ id, title, todos, updateTodoStatus }) => {
    const [{ canDrop, isOver }, drop] = useDrop(
      () => ({
        accept: "TODO",
        drop: (item: { id: number; status: Todo["status"] }, monitor) => {
          if (!monitor.didDrop()) {
            if (item.status !== id) {
              updateTodoStatus(item.id, id);
            }
          }
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [id, updateTodoStatus]
    );

    const isActive = canDrop && isOver;

    return (
      <div
        ref={drop}
        className={`border rounded-lg p-4 relative bg-gray-50 ${
          isActive ? "bg-blue-100" : canDrop ? "bg-blue-50" : ""
        }`}
        style={{ height: "600px", overflowY: "auto" }}
      >
        <h2 className='font-bold mb-4'>{title}</h2>
        <div className='space-y-2'>
          {todos.map((todo, index) => (
            <TodoItem key={todo.id} todo={todo} index={index} />
          ))}
        </div>
      </div>
    );
  }
);

TodoColumn.displayName = "TodoColumn";

export default TodoColumn;
