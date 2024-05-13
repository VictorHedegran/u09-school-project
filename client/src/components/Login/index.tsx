import { useEffect } from 'react'
import useAuthStore from '../../stores/useAuthStore.ts'
import useLoginService from './Login.service.ts'
import styles from './Login.module.css'

function Login() {
    const { googleLogin } = useLoginService()
    const { trySession } = useAuthStore()

    useEffect(() => {
        trySession()
    }, [])

    return (
        <>
            <div className={styles.login}>
                <h2>Login</h2>
                <button type="button" className={styles.button} onClick={googleLogin}>
                    Sign in with Google
                </button>
            </div>
        </> 
    )
}

export default Login
