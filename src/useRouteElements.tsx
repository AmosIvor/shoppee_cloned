import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import PATH from './constant/path'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: PATH.home,
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: PATH.home,
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: PATH.home,
      element: <RejectedRoute />,
      children: [
        {
          path: PATH.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: PATH.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ])
  return routeElements
}
