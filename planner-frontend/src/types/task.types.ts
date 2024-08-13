export enum EnumTaskPriority {
    Low = 'low',
    medium = 'medium',
    high = 'high'
}

export interface ITaskResponse {
    id: string,
    createdAt?: string,
    updatedAt?: string,
    name: string,
    priority?: EnumTaskPriority,
    isCompleted: boolean
}

export type TypeTaskFormState = Partial<Omit<ITaskResponse, 'id'| 'updatedAt'>>