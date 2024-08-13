import { ITaskResponse, TypeTaskFormState } from '@/types/task.types'

import { axiosWithAuth } from '@/api/interceptors'

class TaskService {
	private BASE_URl = '/user/tasks'

	async getTasks() {
		const response = await axiosWithAuth.get<ITaskResponse[]>(this.BASE_URl)
		return response
	}

	async createTasks(data: TypeTaskFormState) {
		const response = await axiosWithAuth.post(this.BASE_URl, data)
		return response
	}

	async updateTasks(id: string, data: TypeTaskFormState) {
		const response = await axiosWithAuth.put(`${this.BASE_URl}/${id}`, data)
		return response
	}

	async deleteTask(id: string) {
		const response = await axiosWithAuth.delete(`${this.BASE_URl}/${id}`)
		return response
	}
}

export const taskService = new TaskService()
