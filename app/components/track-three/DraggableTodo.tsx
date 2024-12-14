import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
interface Todo {
	id: bigint;
	title: string;
	status: "backlog" | "in_progress" | "done";
	synced: boolean;
	created_at: string;
}

function DraggableTodo({
	todo,
	updateStatus,
}: {
	todo: Todo;
	updateStatus: (id: bigint, status: Todo["status"]) => void;
}) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: todo.id.toString(),
		data: todo,
	});

	const style = transform
		? {
				transform: CSS.Translate.toString(transform),
		  }
		: undefined;

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className={`p-3 rounded-lg border ${
				todo.synced ? "bg-green-100" : "bg-yellow-100"
			}`}
			style={style}>
			<p>{todo.title}</p>
			{/* <div className="flex gap-2 mt-2">
				{todo.status === "backlog" && (
					<Button
						size="sm"
						onClick={() => updateStatus(todo.id, "in_progress")}>
						Move to Progress
					</Button>
				)}
				{todo.status === "in_progress" && (
					<>
						<Button
							size="sm"
							onClick={() => updateStatus(todo.id, "backlog")}>
							Move to Backlog
						</Button>
						<Button
							size="sm"
							onClick={() => updateStatus(todo.id, "done")}>
							Move to Done
						</Button>
					</>
				)}
				{todo.status === "done" && (
					<Button
						size="sm"
						onClick={() => updateStatus(todo.id, "in_progress")}>
						Move to Progress
					</Button>
				)}
			</div> */}
		</div>
	);
}

export default DraggableTodo;
