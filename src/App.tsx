import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { MainLayout } from './layouts/MainLayout'
import { ProjectsList } from './pages/ProjectsList'
import { TimersList } from './pages/TimersList'
import { Statistics } from './pages/Statistics'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/projects" />,
      },
      {
        path: '/projects',
        element: <ProjectsList />,
      },
      {
        path: '/projects/:id',
        element: <TimersList />,
      },
      {
        path: '/statistics',
        element: <Statistics />,
      },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
