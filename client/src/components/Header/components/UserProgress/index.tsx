import styles from '../../Header.module.css'

type LevelKeys = 'dty' | 'exr' | 'hlt' | 'mnd'

interface LevelData {
    title: string
    levelNumber: number
    expRequired: number
    exp: number
    message: string
}

interface User {
    profile: {
        displayName: string
        imageUrl: string
        email: string
    }
    levels: {
        // eslint-disable-next-line no-unused-vars
        [key in LevelKeys]: LevelData
    }
    customization: {
        theme: string
        border: string
    }
    inventory: {
        coins: number
        items: string[]
    }
}

const screenWidth = window.innerWidth

function ProgressBar({ exp, expRequired }: { exp: number; expRequired: number }) {
    if (screenWidth < 768) {
        return (
            <li className={styles.progressbar_mobile}>
                <div
                    className={styles.progress_mobile}
                    style={{
                        width: `${(exp / expRequired) * 100}%`,
                    }}
                >
                    <span>
                        {exp}/{expRequired}
                    </span>
                </div>
            </li>
        )
    }
    return (
        <li className={styles.progressbar_desktop}>
            <div
                className={styles.progress_desktop}
                style={{
                    width: `${(exp / expRequired) * 100}%`,
                }}
            >
                <span>
                    {exp}/{expRequired}
                </span>
            </div>
        </li>
    )
}

function UserProgress({ user }: { user: User }) {
    if (screenWidth < 768) {
        return (
            <ul className={styles.statsList_mobile}>
                {(['dty', 'exr', 'hlt', 'mnd'] as LevelKeys[]).map((levelType) => (
                    <ProgressBar
                        key={levelType}
                        exp={user.levels[levelType].exp}
                        expRequired={user.levels[levelType].expRequired}
                    />
                ))}
            </ul>
        )
    }
    return (
        <ul className={styles.statsList_desktop}>
            {(['dty', 'exr', 'hlt', 'mnd'] as LevelKeys[]).map((levelType) => (
                <ProgressBar
                    key={levelType}
                    exp={user.levels[levelType].exp}
                    expRequired={user.levels[levelType].expRequired}
                />
            ))}
        </ul>
    )
}

export default UserProgress
