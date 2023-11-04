import { Outlet } from 'react-router'
import UserSideNav from '../../components/UserSideNav'

export default function UserLayout() {
  return (
    <div>
      <UserSideNav />
      <Outlet />
    </div>
  )
}
