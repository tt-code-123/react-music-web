import { Spin } from 'antd'
import React from 'react'

import styles from './style.module.less'

const Loading: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Spin size="large" />
    </div>
  )
}

export default Loading
