/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { produce } from 'immer'

interface Todo {
    _id: string
    userId: string
    title: string
    type: string
    name: string
    description: string
    stats: {
        dty: number
        exr: number
        hlt: number
        mnd: number
    }
    coins: number
    category: string
    status: string
    schedule: {
        dueDate: Date
        repeatable: boolean
        repeatInterval: string
    }
}

interface TodoStore {
    todos: Todo[]
    setTodos: (todos: any[]) => void
    updateTodo: (todo: Todo) => void
    addTodo: (todo: Todo) => void
    removeTodo: (todo: Todo) => void
}

const useTodoStore = create<TodoStore>((set) => ({
    todos: [],
    setTodos: (todos) => set({ todos }),
    updateTodo: (updatedTodo: Todo) =>
        set(
            produce((draft) => {
                draft.todos = draft.todos.map((todo: Todo) =>
                    todo._id === updatedTodo._id ? updatedTodo : todo
                )
            })
        ),
    addTodo: (todo: Todo) =>
        set(
            produce((draft) => {
                draft.todos.push(todo)
            })
        ),
    removeTodo: (todoToDelete: Todo) =>
        set(
            produce((draft) => {
                draft.todos = draft.todos.filter((todo: Todo) => todo._id !== todoToDelete._id)
            })
        ),
}))

export default useTodoStore
