import React from 'react'
import { RightOutlined } from '@ant-design/icons'

import styles from './style.module.less'

interface IProps {
  title: string
  total: string
}

const SingerDetailLayout: React.FC<IProps> = ({ title, total, children }) => {
  return (
    <div className={styles.songLayoutWrapper}>
      <div className={styles.titleHeader}>
        <h2 className={styles.songTitleText}>{title}</h2>
        <p>
          {total}
          <RightOutlined />
        </p>
      </div>
      <div className={styles.titleChildren}>{children}</div>
    </div>
  )
}

export default SingerDetailLayout
