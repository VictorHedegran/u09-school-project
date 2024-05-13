import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import routerMobile from './routerMobile.tsx'
import routerDesktop from './routerDesktop.tsx'
import './index.css'
import useAuthStore from './stores/useAuthStore.ts'
import Login from './components/Login/index.tsx'
import InstallBanner from './components/InstallBanner/index.tsx'

function App() {
    const { user } = useAuthStore()
    const screenWidth = window.innerWidth

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope)
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error)
                })
        })
    }

    if (screenWidth < 768) {
        return (
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                {user ? <RouterProvider router={routerMobile} /> : <Login />}
                <InstallBanner />
            </GoogleOAuthProvider>
        )
    }
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            {user ? <RouterProvider router={routerDesktop} /> : <Login />}
            <InstallBanner />
        </GoogleOAuthProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
