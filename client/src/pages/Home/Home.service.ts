import axios from 'axios'
import useAuthStore from '../../stores/useAuthStore.ts'
import useTodoStore from '../../stores/useTodoStore.ts'

function useHomeService() {
    const { user, setExp } = useAuthStore((state) => state)
    const { updateTodo, removeTodo } = useTodoStore((state) => state)

    async function addExperience(stats: { dty: number; exr: number; hlt: number; mnd: number }) {
        if (!user) return

        const { dty, exr, hlt, mnd } = stats
        const { levels } = user

        const newExp = {
            dty: levels.dty.exp + dty,
            exr: levels.exr.exp + exr,
            hlt: levels.hlt.exp + hlt,
            mnd: levels.mnd.exp + mnd,
        }

        try {
            const expUpdates = await axios.put(
                `https://levelupirl.up.railway.app/api/v1/internal/users/update/exp`,
                { newExp },
                { withCredentials: true }
            )
            setExp(expUpdates.data)
        } catch (error) {
            console.error('error')
        }
    }

    async function removeExperience(stats: { dty: number; exr: number; hlt: number; mnd: number }) {
        if (!user) return

        const { dty, exr, hlt, mnd } = stats
        const { levels } = user

        const newExp = {
            dty: levels.dty.exp - dty,
            exr: levels.exr.exp - exr,
            hlt: levels.hlt.exp - hlt,
            mnd: levels.mnd.exp - mnd,
        }

        try {
            const expUpdates = await axios.put(
                `https://levelupirl.up.railway.app/api/v1/internal/users/update/exp`,
                { newExp },
                { withCredentials: true }
            )
            setExp(expUpdates.data)
        } catch (error) {
            console.error('error')
        }
    }

    async function resetExperience() {
        if (!user) return

        const newExp = {
            dty: 0,
            exr: 0,
            hlt: 0,
            mnd: 0,
        }

        try {
            const expUpdates = await axios.put(
                `https://levelupirl.up.railway.app/api/v1/internal/users/update/exp`,
                { newExp },
                { withCredentials: true }
            )
            setExp(expUpdates.data)
        } catch (error) {
            console.error('error')
        }
    }

    async function setStatus(
        todoId: string,
        status: string,
        stats: { dty: number; exr: number; hlt: number; mnd: number },
        mode: 'add' | 'subtract'
    ) {
        try {
            const updatedTodo = await axios.put(
                'https://levelupirl.up.railway.app/api/v1/internal/todos',
                {
                    todoId,
                    status,
                },
                {
                    withCredentials: true,
                }
            )
            updateTodo(updatedTodo.data)
            if (mode === 'add') {
                addExperience(stats)
            }
            if (mode === 'subtract') {
                removeExperience(stats)
            }
        } catch (error) {
            console.error('error')
        }
    }

    async function deleteTodo(todoId: string) {
        try {
            const deletedTodo = await axios.delete(
                `https://levelupirl.up.railway.app/api/v1/internal/todos/${todoId}`,
                {
                    withCredentials: true,
                }
            )
            removeTodo(deletedTodo.data)
        } catch (error) {
            console.error('error')
        }
    }

    return { setStatus, deleteTodo, resetExperience }
}

export default useHomeService
