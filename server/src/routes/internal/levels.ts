import { Router, Request, Response } from 'express'
import * as CRUD from '../../controllers/levelController.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const { id, stat } = req.query

        if (typeof id === 'string') {
            const levels = await CRUD.findLevelsById(id)
            return res.send(levels)
        }

        if (typeof stat === 'string') {
            const levels = await CRUD.findLevelsByStat(stat)
            if (levels.length === 0) {
                return res.status(404).send('No levels found with the specified stat')
            }
            return res.send(levels)
        }

        const levels = await CRUD.findAllLevels()
        return res.send(levels)
    } catch (error) {
        return res.status(500).send('Server Error')
    }
})

export default router
