import axios from 'axios'
import useAuthStore from '../../stores/useAuthStore.ts'

function useLogoutService() {
    const logout = useAuthStore((state) => state.logout)

    function googleLogout() {
        try {
            axios.post(
                'https://levelupirl.up.railway.app/api/v1/internal/users/google/logout',
                {},
                {
                    withCredentials: true,
                }
            )
            logout()
        } catch (error) {
            console.error(error)
        }
    }

    return { googleLogout }
}

export default useLogoutService
