import React from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import type { TodoLocal } from "~/types/todos";

interface TodoItemProps {
  todo: TodoLocal;
  index: number;
  deleteTodo: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({ todo, index, deleteTodo }) => {
    console.log(`todo dang muon xoa la: ${JSON.stringify(todo)}`);

    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: "TODO",
        item: { id: todo.id, status: todo.status },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [todo.id, todo.status]
    );

    return (
      <motion.div
        ref={drag}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className={`
        bg-white rounded-lg border p-4 shadow-sm
        hover:shadow-md transition-all duration-200
        cursor-move
        ${isDragging ? "opacity-50" : "opacity-100"}
      `}
        style={{
          width: "250px",
          zIndex: 1000 + index,
        }}
      >
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-medium'>{todo.title}</h3>
            <p className='text-sm text-gray-500'>
              {new Date(todo.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className='flex items-center'>
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                todo.synced ? "bg-green-500" : "bg-yellow-500"
              }`}
              title={todo.synced ? "Synced" : "Pending sync"}
            />
            <button
              onClick={() => deleteTodo(todo.id)}
              className='text-red-500 hover:text-red-700 transition-colors'
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

TodoItem.displayName = "TodoItem";
