import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import useAuthStore from '../../stores/useAuthStore.ts'

function useLoginService() {
    const login = useAuthStore((state) => state.login)

    const googleLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            try {
                const user = await axios.post(
                    'https://levelupirl.up.railway.app/api/v1/internal/users/google/auth',
                    { code },
                    {
                        withCredentials: true,
                    }
                )
                login(user.data)
                return 'success'
            } catch (error) {
                console.error(error)
                return 'error'
            }
        },
        flow: 'auth-code',
    })

    return { googleLogin }
}

export default useLoginService
