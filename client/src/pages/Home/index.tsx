/* eslint-disable no-underscore-dangle */
import { useState } from 'react'
import useTodoStore from '../../stores/useTodoStore.ts'
import styles from './Home.module.css'
import useHomeService from './Home.service.ts'
import Modal from '../../components/Modal/Modal.tsx'

function Home() {
    const todos = useTodoStore((state) => state.todos)
    const { setStatus, deleteTodo } = useHomeService()
    const [expandedTodo, setExpandedTodo] = useState('')
    const [deleteId, setDeleteId] = useState('')

    return (
        <div>
            <h2>Tasks</h2>
            {todos ? (
                <ul className={styles.todoList}>
                    {todos.map((todo) => (
                        <li className={styles.todoCard} key={todo._id}>
                            <button
                                aria-label="Expand todo"
                                type="button"
                                className={styles.todoInfo}
                                onClick={() => {
                                    if (expandedTodo === todo._id) {
                                        setExpandedTodo('')
                                    } else {
                                        setExpandedTodo(todo._id)
                                    }
                                }}
                            >
                                <div>
                                    <h3>{todo.title}</h3>
                                    <h4>{todo.category}</h4>
                                    <p>{todo.description}</p>
                                </div>
                                <p style={{ textAlign: 'right' }}>Today</p>
                            </button>
                            <div
                                className={styles.todoHandling}
                                style={{
                                    height: expandedTodo === todo._id ? `40px` : 0,
                                }}
                            >
                                <ul className={styles.todoStats}>
                                    <li>Dty: {todo.stats.dty}</li>
                                    <li>Hlt: {todo.stats.hlt}</li>
                                    <li>Mnd: {todo.stats.mnd}</li>
                                    <li>Exr: {todo.stats.exr}</li>
                                </ul>
                                <div className={styles.todoButtons}>
                                    {todo.status === 'unfinished' ? (
                                        <button
                                            type="button"
                                            aria-label="Toggle todo status"
                                            onClick={() =>
                                                setStatus(todo._id, 'finished', todo.stats, 'add')
                                            }
                                        >
                                            <i className="fa-regular fa-square" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStatus(
                                                    todo._id,
                                                    'unfinished',
                                                    todo.stats,
                                                    'subtract'
                                                )
                                            }
                                        >
                                            <i className="fa-solid fa-check" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        aria-label="Delete todo"
                                        onClick={() => setDeleteId(todo._id)}
                                    >
                                        <i className="fa-solid fa-x" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Please log in to access the app</p>
            )}
            {deleteId && (
                <Modal
                    isOpen
                    title="Are you sure you want to delete this task?"
                    message=""
                    onConfirm={() => {
                        deleteTodo(deleteId)
                        setDeleteId('')
                    }}
                    onCancel={() => {
                        setDeleteId('')
                    }}
                />
            )}
        </div>
    )
}

export default Home
