/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { produce } from 'immer'
import axios from 'axios'

type StatKey = 'dty' | 'exr' | 'hlt' | 'mnd'

interface User {
    profile: {
        displayName: string
        imageUrl: string
        email: string
    }
    levels: {
        dty: {
            title: string
            levelNumber: number
            expRequired: number
            exp: number
            message: string
        }
        exr: {
            title: string
            levelNumber: number
            expRequired: number
            exp: number
            message: string
        }
        hlt: {
            title: string
            levelNumber: number
            expRequired: number
            exp: number
            message: string
        }
        mnd: {
            title: string
            levelNumber: number
            expRequired: number
            exp: number
            message: string
        }
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

interface Stat {
    title: string
    levelNumber: number
    expRequired: number
    exp: number
    message: string
}

interface Updates {
    dty: Stat
    exr: Stat
    hlt: Stat
    mnd: Stat
}

interface AuthStore {
    isLoggedIn: boolean
    user: User | null
    levelUps: StatKey[]
    login: (user: any) => void
    logout: () => void
    dismissLevelUp: () => void
    setExp: (updates: Updates) => void
    trySession: () => void
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    user: null,
    levelUps: [],
    login: (user: User) => set({ isLoggedIn: true, user }),
    logout: () => set({ isLoggedIn: false, user: null }),
    dismissLevelUp: () =>
        set(
            produce((draft) => {
                draft.levelUps = draft.levelUps.slice(1)
            })
        ),
    setExp: (updates: Updates) =>
        set(
            produce((draft) => {
                const stats: StatKey[] = ['dty', 'exr', 'hlt', 'mnd']
                stats.forEach((stat) => {
                    if (updates[stat].levelNumber > draft.user.levels[stat].levelNumber) {
                        draft.levelUps.push(stat)
                    }
                })
                draft.user.levels = updates
            })
        ),
    trySession: async () => {
        const response = await axios.get(
            'https://levelupirl.up.railway.app/api/v1/internal/users/userdata',
            {
                withCredentials: true,
            }
        )
        if (response) {
            set({ user: response.data, isLoggedIn: true })
        }
    },
}))

export default useAuthStore
