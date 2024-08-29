import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { ITaskResponse } from '@/types/task.types'

import { taskService } from '@/services/task-service'

export function useTasks() {
	const { data } = useQuery({
		queryKey: ['tasks'],
		queryFn: () => taskService.getTasks(),
		select: data => data.data
	})

	const [items, setItems] = useState<ITaskResponse[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])

	return { items, setItems }
}
