import React, { useRef } from 'react'
import { Avatar, Button, Tooltip } from 'antd'
import { MessageOutlined, UserOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'

import { BASE_URL } from '@/config'
import { shallowEqual, useSelector } from 'react-redux'
import { ReducerStates } from '@/redux/reducers'
import styles from './style.module.less'

interface IProps {
  iten: any
  ids: number
  idx: number
  dynamic_id: string
  clickIcon: (idx: number, ids?: number) => void
  handlePubsub: (dynamic_id: string, from_id: string, p_id?: string, to_id?: string, idx?: number, ids?: number) => void
  areaChange: (e: any, idx: number, ids?: number) => void
}

const DynamicItem: React.FC<IProps> = ({ dynamic_id, iten, ids, idx, clickIcon, handlePubsub, areaChange }) => {
  const inputRef = useRef(null)
  const { user } = useSelector(
    (state: ReducerStates) => ({
      user: state.userInfo.user,
    }),
    shallowEqual,
  )
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
        <Button
          className={styles.published}
          type="primary"
          onClick={() => handlePubsub(dynamic_id, user && user._id, iten.p_id, iten.from_id, idx, ids)}>
          发表
        </Button>
      </div>
    </div>
  )
}

export default DynamicItem
