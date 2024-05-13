import React, { useState } from 'react'
import axios from 'axios'
import useTemplateStore from '../../stores/useTemplateStore.ts'
import styles from './CreateTodo.module.css'
import useTodoStore from '../../stores/useTodoStore.ts'

// eslint-disable-next-line no-unused-vars
function CreateTodo({ setModalOpen }: { setModalOpen: (arg0: boolean) => void }) {
    const template = useTemplateStore((state) => state.template)
    const setTemplate = useTemplateStore((state) => state.setTemplate)
    const { addTodo } = useTodoStore((state) => state)
    const [todoTitle, setTodoTitle] = useState(template.name)
    const [todoDescription, setTodoDescription] = useState(template.description)

    const handleTodoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const todoData = {
            title: todoTitle,
            type: 'task',
            name: template.name,
            description: todoDescription,
            dty: template.stats.dty,
            exr: template.stats.exr,
            hlt: template.stats.hlt,
            mnd: template.stats.mnd,
            category: template.category,
            status: 'unfinished',
            dueDate: new Date(),
            repeatable: false,
            repeatInterval: '',
        }

        try {
            const newTodo = await axios.post(
                'https://levelupirl.up.railway.app/api/v1/internal/todos',
                todoData,
                {
                    withCredentials: true,
                }
            )
            addTodo(newTodo.data)
            setTemplate(null)
            setModalOpen(true)
        } catch (error) {
            console.error('Error:', error)
        }
    }
    const handleCancel = () => {
        setTemplate(null)
    }
    return (
        <form onSubmit={handleTodoSubmit} className={styles.form}>
            <label htmlFor="title">
                Title:
                <br />
                <input
                    id="title"
                    type="text"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                />
            </label>
            <br />
            <label htmlFor="description">
                Description:
                <br />
                <input
                    id="description"
                    type="text"
                    value={todoDescription}
                    onChange={(e) => setTodoDescription(e.target.value)}
                />
            </label>
            <br />
            <button type="button" aria-label="Cancel" onClick={() => handleCancel()}>
                Cancel
            </button>
            <button type="submit">Create Todo</button>
        </form>
    )
}

export default CreateTodo
