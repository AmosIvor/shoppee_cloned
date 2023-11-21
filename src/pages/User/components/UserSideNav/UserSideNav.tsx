import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PATH from 'src/constant/path'
import { AppContext } from 'src/contexts/app.context'
import userDefaultImage from 'src/assets/images/user-default.svg'
import classNames from 'classnames'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  return (
    <div>
      {/* header */}
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        {/* image avatar */}
        <Link to={PATH.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'>
          <img src={profile?.avatar || userDefaultImage} alt='' className='h-full w-full object-cover' />
        </Link>

        {/* name user */}
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>{profile?.email}</div>
          <Link to={PATH.profile} className='flex items-center capitalize text-gray-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
              />
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>

      <div className='mt-7'>
        {/* Profile */}
        <NavLink
          to={PATH.profile}
          className={({ isActive }) =>
            classNames('flex items-center capitalize text-gray-600 transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              alt=''
              className='h-full w-full object-cover'
            />
          </div>
          Tài khoản của tôi
        </NavLink>

        {/* Change password */}
        <NavLink
          to={PATH.changePassword}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-gray-600 transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              alt=''
              className='h-full w-full object-cover'
            />
          </div>
          Đổi mật khẩu
        </NavLink>

        {/* History purchase */}
        <NavLink
          to={PATH.historyPurchase}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize text-gray-600 transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              alt=''
              className='h-full w-full object-cover'
            />
          </div>
          Đơn mua
        </NavLink>
      </div>
    </div>
  )
}
