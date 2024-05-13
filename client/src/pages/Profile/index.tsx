import Logout from '../../components/Logout/index.tsx'
import styles from './Profile.module.css'

function Profile() {
    return (
        <div className={styles.login}>
            <h2>Profile</h2>
            <Logout />
        </div>
    )
}

export default Profile
