import axios from 'axios'
import useTodoStore from '../../stores/useTodoStore.ts'

function useTasksService() {
    const setTodos = useTodoStore((state) => state.setTodos)

    async function fetchTodos() {
        try {
            const todos = await axios.get(
                'https://levelupirl.up.railway.app/api/v1/internal/todos',
                {
                    withCredentials: true,
                }
            )
            setTodos(todos.data)
        } catch (error) {
            console.error(error)
        }
    }

    async function fetchTasks() {
        try {
            const tasks = await axios.get('https://levelupirl.up.railway.app/api/v1/public/tasks', {
                withCredentials: true,
            })
            return tasks.data
        } catch (error) {
            return null
        }
    }

    return { fetchTasks, fetchTodos }
}

export default useTasksService
