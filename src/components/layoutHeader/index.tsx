import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import styles from './style.module.less'

const LayoutHeader: React.FC = ({ children }) => {
  const navigate = useNavigate()
  return (
    <div className={styles.headerOuter}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerLeft} onClick={() => navigate('/t/home')}>
          <img src={require('@/assets/img/music.jfif')} alt="" />
        </div>
        <div className={styles.headerCenter}>{children}</div>
        <div className={styles.headerRight}>
          <Avatar style={{ background: '#e91e63' }} size={42} icon={<UserOutlined />} />
        </div>
      </div>
    </div>
  )
}

export default LayoutHeader
