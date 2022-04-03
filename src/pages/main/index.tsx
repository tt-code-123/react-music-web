import React, { useRef } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'

import LayoutFooter from '@/components/layoutFooter'
import LayoutHeader from '@/components/layoutHeader'
import { headerData } from '@/config'
import styles from './style.module.less'

const Main: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const inputSearchRef = useRef(null)

  const handleSearch = () => {
    const { value } = inputSearchRef.current
    if (value) {
      navigate(`/search?keywords=${value}`)
    }
  }
  return (
    <>
      <LayoutHeader>
        {headerData.map((item) => (
          <NavLink
            className={styles.headerLink}
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({ color: isActive ? '#fff' : 'black', background: isActive ? '#e91e63' : '' })}>
            {item.label}
          </NavLink>
        ))}
        <div className={styles.headerSearchInput}>
          <input placeholder="搜索歌曲、歌手" ref={inputSearchRef} />
          <span className={styles.headerIcon} onClick={handleSearch}>
            <SearchOutlined />
          </span>
        </div>
      </LayoutHeader>
      {location.pathname === '/t' ? <Navigate to="/t/home" /> : <Outlet />}
      <LayoutFooter />
    </>
  )
}

export default Main
