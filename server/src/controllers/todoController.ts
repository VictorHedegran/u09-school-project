import Todo from '../models/todoModel.js'

interface TodoData {
    title: String
    type: String
    name: String
    description: String
    dty: Number
    exr: Number
    hlt: Number
    mnd: Number
    category: String
    status: String
    dueDate: Date
    repeatable: Boolean
    repeatInterval: String
}

export async function findTodoById(idQuery: string) {
    const task = await Todo.findById(idQuery)
    return task
}

export async function findTodosByUserId(userIdQuery: string) {
    const tasks = await Todo.find({ userId: userIdQuery })
    return tasks
}

export async function createTodo(userId: string, todoData: TodoData) {
    const todo = await Todo.create({
        userId,
        title: todoData.title,
        type: todoData.type,
        name: todoData.name,
        description: todoData.description,
        stats: {
            dty: todoData.dty,
            exr: todoData.exr,
            hlt: todoData.hlt,
            mnd: todoData.mnd,
        },
        category: todoData.category,
        status: todoData.status,
        schedule: {
            dueDate: todoData.dueDate,
            repeatable: todoData.repeatable,
            repeatInterval: todoData.repeatInterval ? todoData.repeatInterval : '',
        },
    })

    return todo
}

export async function updateTodoStatus(id: string, status: string) {
    const todo = await Todo.findByIdAndUpdate(id, { status }, { new: true })
    return todo
}

export async function deleteTodo(id: string) {
    const todo = await Todo.findByIdAndDelete(id)
    return todo
}
