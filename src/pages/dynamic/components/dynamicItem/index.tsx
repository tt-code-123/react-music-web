import React, { useRef } from 'react'
import { Avatar, Button, Tooltip } from 'antd'
import { MessageOutlined, UserOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'

import { BASE_URL } from '@/config'
import styles from './style.module.less'

interface IProps {
  iten: any
  ids: number
  idx: number
  clickIcon: (idx: number, ids?: number) => void
  areaChange: (e: any, idx: number, ids?: number) => void
}

const DynamicItem: React.FC<IProps> = ({ iten, ids, idx, clickIcon, areaChange }) => {
  const inputRef = useRef(null)
  return (
    <div>
      <div className={styles.replyBox}>
        <Avatar
          className={styles.avatar}
          size={40}
          src={iten.from_user.avatar_url && `${BASE_URL}/${iten.from_user.avatar_url}`}
          icon={iten.from_user.avatar_url ? '' : <UserOutlined />}
        />
        <div className={styles.userInfo}>
          <p>
            <span className={styles.nameStyle}>{iten.from_user.username}</span>回复
            <span className={styles.nameStyle}>{iten.to_user.username}</span>：{iten.content}
          </p>
          <p>
            <span className={styles.timeStyle}>{iten.create_time}</span>
            <Tooltip placement="top" title={'回复'}>
              <MessageOutlined
                className={styles.iconMessage}
                onClick={() => {
                  clickIcon(idx, ids)
                  setTimeout(() => {
                    inputRef.current.focus()
                  }, 100)
                }}
              />
            </Tooltip>
          </p>
        </div>
      </div>
      <div className={styles.replyInput} style={{ display: iten.isShowArea ? 'block' : 'none' }}>
        <TextArea ref={inputRef} allowClear autoSize value={iten.value} onChange={(e) => areaChange(e, idx, ids)} />
        <Button className={styles.published} type="primary">
          发表
        </Button>
      </div>
    </div>
  )
}

export default DynamicItem
