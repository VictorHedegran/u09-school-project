import { Router, Request, Response } from 'express'
import * as CRUD from '../../controllers/todoController.js'
import validateSession from '../../middleware/validateSession.js'

const router = Router()

router.get('/', validateSession, async (req: Request, res: Response) => {
    try {
        const { userId } = req.session

        if (typeof userId !== 'string') {
            return res.status(401).send('Invalid user id')
        }

        const todos = await CRUD.findTodosByUserId(userId)

        return res.send(todos)
    } catch (error) {
        return res.status(500).send('Server Error')
    }
})

router.post('/', validateSession, async (req: Request, res: Response) => {
    try {
        const { userId } = req.session
        const todoData = req.body

        if (typeof userId !== 'string') {
            return res.status(401).send('Invalid user id')
        }

        const todo = await CRUD.createTodo(userId, todoData)

        return res.send(todo)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Server Error')
    }
})

router.put('/', validateSession, async (req: Request, res: Response) => {
    try {
        const { todoId, status } = req.body

        if (typeof todoId !== 'string') {
            return res.status(401).send('Invalid todo id')
        }

        if (!['finished', 'unfinished', 'overdue'].includes(status)) {
            return res.status(401).send('Invalid status')
        }

        const todo = await CRUD.updateTodoStatus(todoId, status)

        return res.send(todo)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Server Error')
    }
})

router.delete('/:todoId', validateSession, async (req: Request, res: Response) => {
    try {
        const { todoId } = req.params

        if (typeof todoId !== 'string') {
            return res.status(401).send('Invalid todo id')
        }

        const deletedTodo = await CRUD.deleteTodo(todoId)

        return res.send(deletedTodo)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Server Error')
    }
})

export default router
