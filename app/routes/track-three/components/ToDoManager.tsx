import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useLocalDbContext } from "../utils/context/localDbContext";
import { Cols } from "./Cols";


export const ToDoManager = ()=>{
    const [newTodoTitle,setNewTodoTitle] = useState("")
    const {todos,backendConnection,syncWithBackend,addTodo} = useLocalDbContext()
  
    return (
      <div className="flex flex-col p-8 gap-4 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <p className={backendConnection?"text-green-500":"text-red-500"}>{backendConnection?"Online":"Offline"}</p>
          <Button onClick={syncWithBackend}>Sync Now</Button>
        </div>
  
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Add new todo..."
          />
          <Button onClick={()=>{
            addTodo(newTodoTitle)
            setNewTodoTitle("")
          }}>Add Todo</Button>
        </div>
  
        <div className="grid grid-cols-3 gap-4">
          <Cols
            todos={todos.filter(t=>!t.isDeleted&&t.status==="backlog")}
            colStatus="backlog"
            colTitle="Backlog"/>
  
          <Cols
            todos={todos.filter(t=>!t.isDeleted&&t.status==="in_progress")}
            colStatus="in_progress"
            colTitle="In Progress"/>
  
          <Cols
            todos={todos.filter(t=>!t.isDeleted&&t.status==="done")}
            colStatus="done"
            colTitle="Done"/>
        </div>
      </div>
    );
}