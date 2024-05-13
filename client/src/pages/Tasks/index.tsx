import { useEffect, useState } from 'react'
import CreateTodo from '../../components/CreateTodo/index.tsx'
import useTemplateStore from '../../stores/useTemplateStore.ts'
import styles from './Tasks.module.css'
import useTasksService from './Tasks.service.ts'
import Modal from '../../components/Modal/Modal.tsx'

interface Task {
    _id: String
    type: String
    name: String
    description: String
    stats: {
        dty: Number
        exr: Number
        hlt: Number
        mnd: Number
    }
    coins: Number
    category: String
}

/* eslint-disable no-underscore-dangle */
function Tasks() {
    const template = useTemplateStore((state) => state.template)
    const setTemplate = useTemplateStore((state) => state.setTemplate)
    const { fetchTasks } = useTasksService()
    const [tasks, setTasks] = useState<Task[]>()
    const [isModalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetchTasks()
                if (response) {
                    setTasks(response)
                }
            } catch (error) {
                console.error(`error: ${error}`)
            }
        }

        fetch()
    }, [])
    return (
        <div>
            <h2>Create new task</h2>
            {template ? (
                <CreateTodo setModalOpen={setModalOpen} />
            ) : (
                <div className={styles.taskList}>
                    {tasks
                        ? tasks.map((task) => (
                              // eslint-disable-next-line react/jsx-indent
                              <div className={styles.template} key={task._id.toString()}>
                                  <h3>{task.name}</h3>
                                  <ul className={styles.templateStats}>
                                      <li>Dty +{task.stats.dty.toString()}</li>
                                      <li>Hlt +{task.stats.hlt.toString()}</li>
                                      <li>Mnd +{task.stats.mnd.toString()}</li>
                                      <li>Exr +{task.stats.exr.toString()}</li>
                                  </ul>
                                  <h4>{task.category}</h4>
                                  <button
                                      type="button"
                                      aria-label="Choose template"
                                      onClick={() => setTemplate(task)}
                                  >
                                      Use template
                                  </button>
                              </div>
                          ))
                        : ''}
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                title="Task created!"
                message="Go back to home to view it."
                onConfirm={() => {
                    setModalOpen(false)
                }}
            />
        </div>
    )
}

export default Tasks
