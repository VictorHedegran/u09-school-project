import Item from '../models/itemModel.js'

export async function findAllItems() {
    const items = await Item.find()
    return items
}

export async function findItemsById(idQuery: string) {
    const items = await Item.findById(idQuery)
    return items
}

export async function findItemsByType(typeQuery: string) {
    const items = await Item.find({ type: typeQuery })
    return items
}
