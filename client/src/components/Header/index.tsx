import { useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import useAuthStore from '../../stores/useAuthStore.ts'
import styles from './Header.module.css'
import UserProgress from './components/UserProgress/index.tsx'
import useTasksService from '../../pages/Tasks/Tasks.service.ts'
import Modal from '../Modal/Modal.tsx'

function Header() {
    const { user, levelUps, dismissLevelUp } = useAuthStore((state) => state)
    const screenWidth = window.innerWidth
    const { fetchTodos } = useTasksService()

    function expandAbbreviation(abbreviation: string) {
        let expandedWord = ''
        switch (abbreviation) {
            case 'dty':
                expandedWord = 'Duty'
                break
            case 'exr':
                expandedWord = 'Exercise'
                break
            case 'hlt':
                expandedWord = 'Health'
                break
            case 'mnd':
                expandedWord = 'Mind'
                break
            default:
                expandedWord = ''
                break
        }
        return expandedWord
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    if (screenWidth < 768) {
        return (
            <header className={styles.header_mobile}>
                <h1>
                    <Link to="/">LevelUp Irl</Link>
                </h1>
                <ul className={styles.nav_mobile}>
                    <li>
                        <NavLink to="/store">
                            <i className="fa-solid fa-store" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks">
                            <i className="fa-solid fa-list-check" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/">
                            <i className="fa-solid fa-house" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile">
                            <i className="fa-solid fa-user" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">
                            <i className="fa-solid fa-info" />
                        </NavLink>
                    </li>
                </ul>
                {user ? (
                    <>
                        <article className={styles.userInfo_mobile}>
                            <section className={styles.profile_mobile}>
                                <img
                                    className={styles.profilePicture_mobile}
                                    src={user.profile.imageUrl}
                                    alt="Profile"
                                />
                                <p>{user.profile.displayName}</p>
                                <p>
                                    <i className="fa-solid fa-coins" />
                                    {user.inventory.coins}
                                </p>
                            </section>
                            <section style={{ display: 'flex', gap: '5px' }}>
                                <div className={styles.labels_mobile}>
                                    <ul>
                                        <li>Duty lvl {user.levels.dty.levelNumber}:</li>
                                        <li>Exercise lvl {user.levels.exr.levelNumber}:</li>
                                        <li>Health lvl {user.levels.hlt.levelNumber}:</li>
                                        <li>Mind lvl {user.levels.mnd.levelNumber}:</li>
                                    </ul>
                                </div>
                                <UserProgress user={user} />
                            </section>
                        </article>
                        {levelUps.length > 0 && (
                            <Modal
                                isOpen
                                title={`${expandAbbreviation(levelUps[0])} level ${
                                    user.levels[levelUps[0]].levelNumber
                                }: ${user.levels[levelUps[0]].title}`.toUpperCase()}
                                message={`${user.levels[levelUps[0]].message}`}
                                onConfirm={dismissLevelUp}
                            />
                        )}
                    </>
                ) : (
                    ''
                )}
            </header>
        )
    }
    return (
        <header className={styles.header_desktop}>
            <h1>
                <Link to="/">LevelUp Irl</Link>
            </h1>
            {user ? (
                <>
                    <article className={styles.userInfo_desktop}>
                        <section className={styles.profile_desktop}>
                            <img
                                className={styles.profilePicture_desktop}
                                src={user.profile.imageUrl}
                                alt="Profile"
                            />
                            <p>{user.profile.displayName}</p>
                            <p>
                                <i className="fa-solid fa-coins" />
                                {user.inventory.coins}
                            </p>
                        </section>
                        <section style={{ display: 'flex', gap: '5px' }}>
                            <div className={styles.labels_desktop}>
                                <ul>
                                    <li>Duty lvl {user.levels.dty.levelNumber}:</li>
                                    <li>Exercise lvl {user.levels.exr.levelNumber}:</li>
                                    <li>Health lvl {user.levels.hlt.levelNumber}:</li>
                                    <li>Mind lvl {user.levels.mnd.levelNumber}:</li>
                                </ul>
                            </div>
                            <UserProgress user={user} />
                        </section>
                    </article>
                    {levelUps.length > 0 && (
                        <Modal
                            isOpen
                            title={`${expandAbbreviation(levelUps[0])} level ${
                                user.levels[levelUps[0]].levelNumber
                            }: ${user.levels[levelUps[0]].title}`.toUpperCase()}
                            message={`${user.levels[levelUps[0]].message}`}
                            onConfirm={dismissLevelUp}
                        />
                    )}
                </>
            ) : (
                ''
            )}
            <ul className={styles.nav_desktop}>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/store">Store</NavLink>
                </li>
                <li>
                    <NavLink to="/profile">Profile</NavLink>
                </li>
                <li>
                    <NavLink to="/about">About</NavLink>
                </li>
            </ul>
        </header>
    )
}

export default Header
