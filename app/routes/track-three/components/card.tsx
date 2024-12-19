import { useSortable } from "@dnd-kit/sortable"
import { Todo } from "~/types/interface"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 } from "lucide-react"
import { useLocalDatabase } from "~/hooks/useLocalDatabase"
import { useId, useMemo } from "react"

interface CardProps {
  card: Todo
  title: string
}

const Card = ({ card, title }: CardProps) => {
  const { deleteTodo } = useLocalDatabase()
  const id = useId()
  const { synced, title: cardTitle } = card

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, data: { ...card, column: title } })

  const dndkitCardStyle = useMemo(
    () => ({
      touchAction: "none",
      transform: CSS.Translate.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1
    }),
    [transform, transition, isDragging]
  )

  const cardClassName = useMemo(
    () =>
      `p-3 rounded-lg ${
        synced
          ? "bg-green-100 border"
          : cardTitle
          ? "bg-yellow-100 border"
          : "bg-transparent"
      }`,
    [synced, cardTitle]
  )

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={dndkitCardStyle}
      className={cardClassName}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm">{cardTitle}</p>
        {cardTitle && (
          <div className="flex gap-2">
            <Trash2
              className="w-4 h-4 text-red-500 cursor-pointer"
              onClick={() => deleteTodo(card.id, card.synced)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
