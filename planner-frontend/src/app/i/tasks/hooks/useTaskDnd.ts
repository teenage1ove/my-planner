import { DropResult } from '@hello-pangea/dnd'

import { FILTERS } from '../columns.data'

import { useUpdateTask } from './useUpdateTask'

export function useTaskDnd() {
	const { updateTask } = useUpdateTask()

	const onDragEnd = (result: DropResult) => {
		// draggable - элемент которы перетаксиквакм, droppable - место куда скидываем
		if (!result.destination) return

		const destinationColId = result.destination.droppableId

		if (destinationColId === result.source.droppableId) return

		if (destinationColId === 'completed') {
			updateTask({
				id: result.draggableId,
				data: {
					isCompleted: true
				}
			})
			return
		}

		//FILTERS
		const newCreatedAt = FILTERS[destinationColId].format()
		updateTask({
			id: result.draggableId,
			data: {
				createdAt: newCreatedAt,
				isCompleted: false
			}
		})
	}

	return { onDragEnd }
}
