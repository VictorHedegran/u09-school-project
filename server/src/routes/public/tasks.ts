import { Router, Request, Response } from 'express'
import * as CRUD from '../../controllers/taskController.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const { id, category, stat } = req.query

        if (typeof id === 'string') {
            const tasks = await CRUD.findTasksById(id)
            return res.send(tasks)
        }

        if (typeof category === 'string') {
            const tasks = await CRUD.findTasksByCategory(category)
            if (tasks.length === 0) {
                return res.status(404).send('No tasks found within the specified category')
            }
            return res.send(tasks)
        }

        if (typeof stat === 'string') {
            const tasks = await CRUD.findTasksByStat(stat)
            if (tasks.length === 0) {
                return res.status(404).send('No tasks found with the specified stat')
            }
            return res.send(tasks)
        }

        const tasks = await CRUD.findAllTasks()
        return res.send(tasks)
    } catch (error) {
        return res.status(500).send('Server Error')
    }
})

export default router
