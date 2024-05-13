import { Outlet, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home/index.tsx'
import Profile from './pages/Profile/index.tsx'
import Store from './pages/Store/index.tsx'
import Tasks from './pages/Tasks/index.tsx'
import Header from './components/Header/index.tsx'
import About from './pages/About/index.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <Header />
                <Outlet />
                <Tasks />
            </>
        ),
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'store',
                element: <Store />,
            },
            {
                path: 'about',
                element: <About />,
            },
        ],
    },
])

export default router
