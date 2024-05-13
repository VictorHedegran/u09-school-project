import useLogoutService from './Logout.service.ts'

function Logout() {
    const { googleLogout } = useLogoutService()

    return (
        <button type="button" onClick={googleLogout}>
            Logout
        </button>
    )
}

export default Logout
