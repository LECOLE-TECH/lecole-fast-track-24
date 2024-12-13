import { Button } from "~/components/ui/button";
import type { Todo } from "../utils/types";
import { useDrag } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import { useLocalDbContext } from "../utils/context/localDbContext";

export const ToDoCard=({todo}:{todo:Todo})=>{
    const {deleteTodo} = useLocalDbContext()
    const [{isDragging},drag] = useDrag({
        type:'TODO',
        item:todo,
        collect: (monitor)=>({
            isDragging:monitor.isDragging()
        })
    })

    return <div ref={drag} key={todo.id} className={`p-3 cursor-pointer relative rounded-lg border ${todo.synced ? "bg-green-100" : "bg-yellow-100"} ${isDragging?"opacity-50":""}`}>
    <p>{todo.title}</p>
        <Button
          className="absolute right-3 top-3"
          variant="ghost"
          size="icon"
          onClick={() => deleteTodo(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
  </div>
}