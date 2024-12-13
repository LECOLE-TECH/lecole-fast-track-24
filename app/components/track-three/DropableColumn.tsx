import React from "react";
import { useDroppable } from "@dnd-kit/core";


function DroppableColumn({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: React.ReactNode;
}) {
	const { setNodeRef } = useDroppable({
		id,
	});

	return (
		<div
			ref={setNodeRef}
			className="border rounded-lg p-4">
			<h2 className="font-bold mb-4">{title}</h2>
			<div className="space-y-2">{children}</div>
		</div>
	);
}

export default DroppableColumn;
