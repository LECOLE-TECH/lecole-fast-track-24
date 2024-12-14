import { useSortable } from "@dnd-kit/sortable";
import type { Todo } from "~/types/todo";
import { CSS } from "@dnd-kit/utilities";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    data: {todo}
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="p-3 rounded-lg border cursor-move bg-gray-200 flex justify-between items-center"
      >
        <p>{todo.title}</p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg border cursor-move ${todo.synced ? "bg-green-100" : "bg-yellow-100"} flex justify-between items-center`}
    >
      <p>{todo.title}</p>
      {!todo.synced && (
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
      )}
    </div>
  );
}
