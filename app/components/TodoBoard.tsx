import { DndContext, type DragEndEvent, DragOverlay, useSensors, useSensor, PointerSensor, type DragStartEvent, MouseSensor, TouchSensor, type DragOverEvent } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { TodoColumn } from "~/components/TodoColumn";
import { TodoItem } from "~/components/TodoItem";
import type { Todo } from "~/types/todo";
import { useState } from 'react';
import { setTodos, updateTodoStatus } from '~/store/todoSlice';
import { localDbService } from '~/services/localDb';
import { arrayMove } from '@dnd-kit/sortable';

interface TodoBoardProps {
  todos: Todo[];
}

export function TodoBoard({ todos }: TodoBoardProps) {
  const dispatch = useDispatch();
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const filterTodosByStatus = (status: Todo["status"]) => {
    return todos.filter((todo) => todo.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTodo(event.active.data.current?.todo)
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTodoId = Number(active.id);
    const overTodoId = Number(over.id);

    if (activeTodoId === overTodoId) return;

    const updatedTodos = todos.slice();
    const activeTodoIndex = updatedTodos.findIndex((todo: Todo) => todo.id === activeTodoId);
    const overTodoIndex = updatedTodos.findIndex((todo: Todo) => todo.id === overTodoId);
    const newTodos = arrayMove(updatedTodos, activeTodoIndex, overTodoIndex);

    dispatch(setTodos(newTodos));
    setActiveTodo(null);
  };


  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeTodoId = Number(active.id);
    
    // Determine the new status based on whether we're over a column or another todo
    const newStatus = over.data.current?.todo?.status || over.id as Todo["status"];
    
    // Validate that newStatus is one of the allowed values
    if (!['backlog', 'in_progress', 'done'].includes(newStatus)) return;
  
    const updatedTodos = todos.slice();
    const activeTodoIndex = updatedTodos.findIndex((todo: Todo) => todo.id === activeTodoId);
    
    if (over.data.current?.todo) {
      const overTodoId = Number(over.id);
      if (activeTodoId === overTodoId) return;
      const overTodoIndex = updatedTodos.findIndex((todo: Todo) => todo.id === overTodoId);
      const newTodos = arrayMove(updatedTodos, activeTodoIndex, overTodoIndex);
      dispatch(setTodos(newTodos));
    }
  
    dispatch(updateTodoStatus({ todoId: activeTodoId, status: newStatus }));
    localDbService.updateTodoStatus(activeTodoId, newStatus);
  };
  

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}>
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