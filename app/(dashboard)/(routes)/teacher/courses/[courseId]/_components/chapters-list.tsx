'use client';

import { useCallback, useEffect, useState } from 'react';

import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult
} from '@hello-pangea/dnd';
import { Chapter } from '@prisma/client';
import debounce from 'lodash/debounce';
import { Grip, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { UpdateData } from '@/lib/validations/chapters-list';

type ChaptersListProps = {
	items: Chapter[];
	onEdit: (id: string) => void;
	onReorder: (updateData: UpdateData[]) => void;
};

function ChaptersList({ items, onEdit, onReorder }: ChaptersListProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [chapters, setChapters] = useState(items);

	const debouncedOnReorder = useCallback(debounce(onReorder, 1000), []);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setChapters(items);
	}, [items]);

	function onDragEnd(result: DropResult) {
		if (!result.destination) return;

		const items = Array.from(chapters);
		const [reorderItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderItem);

		setChapters(items);

		const bulkUpdateData = items.map((chapter) => ({
			id: chapter.id,
			position: items.findIndex((item) => item.id === chapter.id)
		}));

		debouncedOnReorder(bulkUpdateData);
	}

	if (!isMounted) return null;

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="chapters">
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{chapters.map((chapter, index) => (
							<Draggable
								key={chapter.id}
								draggableId={chapter.id}
								index={index}
							>
								{(provided) => (
									<div
										className={cn(
											'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
											chapter.isPublished &&
												'bg-sky-100 border border-sky-200 text-sky-700'
										)}
										ref={provided.innerRef}
										{...provided.draggableProps}
									>
										<div
											className={cn(
												'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
												chapter.isPublished && 'border-sky-200 hover:bg-sky-200'
											)}
											{...provided.dragHandleProps}
										>
											<Grip className="h-5 w-5" />
										</div>
										{chapter.title}
										<div className="ml-auto pr-2 flex items-center gap-x-2">
											{chapter.isFree && <Badge>Free</Badge>}
											<Badge
												className={cn(
													'bg-slate-500',
													chapter.isPublished && 'bg-sky-700'
												)}
											>
												{chapter.isPublished ? 'Published' : 'Draft'}
											</Badge>
											<button
												onClick={() => onEdit(chapter.id)}
												className="h-4 w-4 cursor-pointer hover:opacity-75 transition"
											>
												<Pencil />
											</button>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

export default ChaptersList;
