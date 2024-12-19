import { useLocalDatabase } from "~/hooks/useLocalDatabase"
import { Todo } from "~/types/interface"
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors
} from "@dnd-kit/core"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

import Card from "./card"
import { MouseSensor, TouchSensor } from "../dnd-kit"
import { useEffect, useId, useState } from "react"
import { generatePlaceHolderCard } from "~/utils/formatter"
import Loading from "~/components/loading"
import { useNetworkStatus } from "~/hooks/useNetworkStatus"

const TITLE_COLUMNS = ["Backlog", "In Progress", "Done"]

const Columns = () => {
  const { todos, updateTodo, syncWithBackend } = useLocalDatabase()
  const isOnline = useNetworkStatus()
  const id = useId()
  const [activeData, setActiveData] = useState<Todo | null>(null)
  const [currentColumn, setCurrentColumn] = useState<Todo["status"] | null>(
    null
  )

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10 // mouse move 10px
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // touch move 250ms
      tolerance: 500
    }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const filterTodosByStatus = (status: Todo["status"]) => {
    return todos?.filter((todo) => todo.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const todo = {
      ...event.active.data.current!
    }
    delete todo.column
    setActiveData(todo as Todo)
    setCurrentColumn(event.active.data.current!.column)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    const newColumn = over?.data.current!.column

    if (!newColumn || !over) return

    updateTodo(active?.data.current!.id, newColumn)
    const activeIndex = todos.findIndex(
      (todo) => todo.id === active?.data.current!.id
    )

    todos[activeIndex].status = newColumn as Todo["status"]

    setActiveData(null)
    setCurrentColumn(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5"
        }
      }
    })
  }

  // sync with backend every 15 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOnline) {
      interval = setInterval(() => {
        syncWithBackend()
      }, 15000)
    }
    return () => clearInterval(interval)
  }, [todos, isOnline])

  if (!todos) {
    return <Loading />
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      id={id}
    >
      <DragOverlay dropAnimation={dropAnimation}>
        {activeData && currentColumn && (
          <Card card={activeData} title={currentColumn} />
        )}
      </DragOverlay>
      <div className="grid grid-cols-3 gap-4">
        {TITLE_COLUMNS.map((title, index) => {
          const t = title.toLowerCase().replace(" ", "_") as Todo["status"]
          const todos = filterTodosByStatus(t).filter((todo) => todo.title)
          todos.push(generatePlaceHolderCard())
          return (
            <SortableContext
              id={id}
              items={todos}
              key={index}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 border rounded-lg p-4 h-fit">
                <h2 className="font-bold mb-4">{title}</h2>
                {todos.map((todo) => (
                  <Card key={todo.id} card={todo} title={t} />
                ))}
              </div>
            </SortableContext>
          )
        })}
      </div>
    </DndContext>
  )
}

export default Columns
