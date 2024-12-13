import React, { useRef } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useTodoStoreLocal } from "~/hooks/useTodoStoreLocal";
import type { Todo, TodoLocal } from "~/types/todos";

interface TodoItemProps {
  todo: TodoLocal;
  index: number;
  onDragStop: (id: number, x: number, y: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({ todo, index, onDragStop }) => {
    const deleteTodo = useTodoStoreLocal((state) => state.deleteTodo);
    const nodeRef = useRef(null);

    const handleDragStop = (e: any, data: { x: number; y: number }) => {
      onDragStop(todo.id, data.x, data.y);
    };

    return (
      <Draggable
        nodeRef={nodeRef}
        bounds='parent'
        defaultPosition={{ x: 0, y: 0 }}
        onStop={handleDragStop}
      >
        <motion.div
          ref={nodeRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
          bg-white rounded-lg border p-4 shadow-sm
          hover:shadow-md transition-shadow duration-200
          cursor-move absolute
        `}
          style={{
            width: "250px", // Adjust as needed
            zIndex: 1000 + index, // Ensures items being dragged appear above others
          }}
        >
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='font-medium'>{todo.title}</h3>
              <p className='text-sm text-gray-500'>
                {new Date(todo.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className='text-red-500 hover:text-red-700 transition-colors'
            >
              <Trash size={16} />
            </button>
          </div>
        </motion.div>
      </Draggable>
    );
  }
);

TodoItem.displayName = "TodoItem";
