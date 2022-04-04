import { RightCircleOutlined } from '@ant-design/icons'
import React from 'react'

import styles from './style.module.less'

interface IProps {
  title: string
  toMore?: () => void
}

const LayoutTitle: React.FC<IProps> = ({ title, children, toMore }) => {
  return (
    <div className={styles.titleWrapper}>
      <div className={styles.titleHeader}>
        <h2 className={styles.titleText}>{title}</h2>
        <span className={styles.titleMore} onClick={() => toMore()}>
          更多&nbsp;
          <RightCircleOutlined />
        </span>
      </div>
      <div className={styles.titleChildren}>{children}</div>
    </div>
  )
}

export default LayoutTitle
