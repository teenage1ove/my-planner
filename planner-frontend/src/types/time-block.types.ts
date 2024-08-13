import { IBase } from './root.types'

export interface ITimeBlockFormState extends IBase{
    name: string
    color?: string
    duration: number
    order: number
}

export type TypeTimeBlockFormState = Partial<Omit<ITimeBlockFormState, 'createdAt' | 'updatedAt'>>