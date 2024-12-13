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
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: "TODO",
      drop: (item: { id: number; status: Todo["status"] }) => {
        if (item.status !== id) {
          updateTodoStatus(item.id, id);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    console.log(`isOver: ${isOver}`);
    console.log(`canDrop: ${canDrop}`);

    return (
      <motion.div
        ref={drop}
        layout
        className={`border rounded-lg p-4 relative bg-gray-50 ${
          isOver ? "bg-blue-100" : ""
        }`}
        style={{ height: "600px", overflowY: "auto" }}
      >
        <h2 className='font-bold mb-4'>{title}</h2>
        <motion.div ref={drop} layout className='space-y-2'>
          {todos.map((todo, index) => (
            <TodoItem key={todo.id} todo={todo} index={index} />
          ))}
        </motion.div>
      </motion.div>
    );
  }
);

TodoColumn.displayName = "TodoColumn";

export default TodoColumn;
