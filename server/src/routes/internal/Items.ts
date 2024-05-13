import { Router, Request, Response } from 'express'
import * as CRUD from '../../controllers/itemController.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const { id, type } = req.query

        if (typeof id === 'string') {
            const items = await CRUD.findItemsById(id)
            return res.send(items)
        }

        if (typeof type === 'string') {
            const items = await CRUD.findItemsByType(type)
            if (items.length === 0) {
                return res.status(404).send('No items found of the specified type')
            }
            return res.send(items)
        }

        const items = await CRUD.findAllItems()
        return res.send(items)
    } catch (error) {
        return res.status(500).send('Server Error')
    }
})

export default router
