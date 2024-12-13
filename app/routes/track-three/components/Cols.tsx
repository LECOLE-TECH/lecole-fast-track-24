import { useDrop } from "react-dnd";
import { useLocalDbContext } from "../utils/context/localDbContext";
import type { Todo } from "../utils/types";
import { ToDoCard } from "./TodoCard";
import React, { useEffect, useState } from "react";


export const Cols = ({todos,colStatus,colTitle}:{todos:Todo[],colStatus:"backlog" | "in_progress" | "done",colTitle:string})=>{
    const {updateTodoStatus} = useLocalDbContext()
    const [currentTodos,setCurrentTodos] = useState(todos)

    
    const [,drop] = useDrop({
        accept:"TODO",
        drop:(item:Todo)=>{
            if(item.status!==colStatus){
                updateTodoStatus(item.id,colStatus)
            }
        },
    })

    useEffect(()=>{setCurrentTodos(todos)},[todos])

    return <div className="border rounded-lg p-4" ref={drop}>
        <h2 className="font-bold mb-4">{colTitle}</h2>
        <div className="space-y-2" >
            {todos.map((todo) => (
                <React.Fragment key={todo.id}>
                    <ToDoCard todo={todo}/>
                </React.Fragment>
            ))}
        </div>
  </div>
}