import Task from '../models/taskModel.js'

export async function findAllTasks() {
    const tasks = await Task.find()
    return tasks
}

export async function findTasksById(idQuery: string) {
    const tasks = await Task.findById(idQuery)
    return tasks
}

export async function findTasksByCategory(categoryQuery: string) {
    const tasks = await Task.find({ category: categoryQuery })
    return tasks
}

export async function findTasksByStat(statQuery: string) {
    const query = { [`stats.${statQuery}`]: { $exists: true } }
    const tasks = await Task.find(query)
    return tasks
}
