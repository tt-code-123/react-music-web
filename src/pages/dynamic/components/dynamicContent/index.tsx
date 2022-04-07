import React, { useMemo, useRef } from 'react'
import { Avatar, Tooltip, Input, Button, Space } from 'antd'
import { LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'

import { DynamicDataType } from '@/api/type'
import { BASE_URL } from '@/config'
import styles from './style.module.less'
import DynamicItem from '../dynamicItem'
import { UpdateLikeDynamic } from '@/api'
import { shallowEqual, useSelector } from 'react-redux'
import { ReducerStates } from '@/redux/reducers'

interface IProps {
  data: DynamicDataType
  setDynamicItem: (dynamic: DynamicDataType) => void
}
const { TextArea } = Input
function formateData(v: DynamicDataType) {
  const value = { ...v }
  if (value.commentInfo.length) {
    for (var i = 0; i < value.commentInfo.length; i++) {
      if (!value.commentInfo[i].to_id) {
        const arr = []
        value.commentInfo[i].children = []
        for (var j = 0; j < value.commentInfo.length; j++) {
          if (value.commentInfo[i]._id !== value.commentInfo[j]._id && value.commentInfo[j].p_id === value.commentInfo[i].p_id) {
            value.commentInfo[i].children.push(value.commentInfo[j])
          }
        }
        arr.push(value.commentInfo[i])
        value.commentInfo = arr
      }
    }
  }
  return value
}
const DynamicContent: React.FC<IProps> = ({ data, setDynamicItem }) => {
  const commentData = useMemo(() => {
    return formateData(data)
  }, [data])
  const areRef = useRef(null)
  const { user } = useSelector(
    (state: ReducerStates) => ({
      user: state.userInfo.user,
    }),
    shallowEqual,
  )
  const handleAreaChange = (e, idx?: number, ids?: number) => {
    const newData = { ...data }
    if (ids != undefined) {
      newData.commentInfo[idx].children[ids].value = e.target.value
    } else if (idx != undefined) {
      newData.commentInfo[idx].value = e.target.value
    } else {
      newData.value = e.target.value
    }
    setDynamicItem(newData)
  }
  const handleClickIcon = (idx?: number, ids?: number) => {
    const newData = { ...data }
    if (ids != undefined) {
      newData.commentInfo[idx].children[ids].isShowArea = !newData.commentInfo[idx].children[ids].isShowArea
    } else if (idx !== undefined) {
      newData.commentInfo[idx].isShowArea = !newData.commentInfo[idx].isShowArea
    } else {
      newData.isShowArea = !newData.isShowArea
    }
    // areRef.current.focus()

    setDynamicItem(newData)
  }
  const handleClickLikeIcon = () => {
    if (data.like) {
      UpdateLikeDynamic(user && user._id, 'dislike', data._id).then(() => {
        const newData = { ...data }
        newData.like = false
        setDynamicItem(newData)
      })
    } else {
      UpdateLikeDynamic(user && user._id, 'like', data._id).then(() => {
        const newData = { ...data }
        newData.like = true
        setDynamicItem(newData)
      })
    }
  }
  const avatarProps = {
    src: commentData.userInfo.avatar_url && `${BASE_URL}/${commentData.userInfo.avatar_url}`,
    icon: commentData.userInfo.avatar_url ? '' : <UserOutlined />,
    size: 50,
  }
  return (
    <div className={styles.contentBox}>
      <div className={styles.header}>
        <Avatar {...avatarProps} />
        <div className={styles.userInfo}>
          <p>{data?.userInfo?.username}</p>
          <p>{data?.release_time}</p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentText}>{data?.dynamic_content}</div>
        <div className={styles.contentImage}>{data?.image_file.length > 0 ? '' : null}</div>
      </div>
      <div className={styles.actionBox}>
        <Space size={50}>
          <LikeOutlined onClick={handleClickLikeIcon} style={{ color: data.like ? '#e91e63' : '' }} />
          <MessageOutlined onClick={() => handleClickIcon()} />
        </Space>
      </div>
      <div className={styles.commentWrapper}>
        {commentData.commentInfo.length > 0
          ? commentData.commentInfo.map((item, idx) => {
              return (
                <div key={item._id}>
                  <div className={styles.commentBox}>
                    <Avatar
                      size={40}
                      src={item.from_user.avatar_url && `${BASE_URL}/${item.from_user.avatar_url}`}
                      icon={item.from_user.avatar_url ? '' : <UserOutlined />}
                    />
                    <div className={styles.userInfo}>
                      <p>
                        <span className={styles.nameStyle}>{item.from_user.username}</span>：{item.content}
                      </p>
                      <p>
                        <span className={styles.timeStyle}>{item.create_time}</span>
                        <Tooltip placement="top" title={'回复'}>
                          <MessageOutlined className={styles.iconMessage} onClick={() => handleClickIcon(idx)} />
                        </Tooltip>
                      </p>
                    </div>
                  </div>
                  {item.children?.map((iten, ids) => (
                    <DynamicItem
                      ref={areRef}
                      iten={iten}
                      ids={ids}
                      idx={idx}
                      key={iten._id}
                      clickIcon={handleClickIcon}
                      areaChange={handleAreaChange}
                    />
                  ))}
                  <div className={styles.replyInputHeader} style={{ display: item.isShowArea ? 'block' : 'none' }}>
                    <TextArea allowClear autoSize value={item.value} onChange={(e) => handleAreaChange(e, idx)} />
                    <Button className={styles.published} type="primary">
                      发表
                    </Button>
                  </div>
                </div>
              )
            })
          : null}
      </div>
      <div className={styles.pub} style={{ display: data.isShowArea ? 'block' : 'none' }}>
        <TextArea allowClear autoSize value={data.value} onChange={(e) => handleAreaChange(e)} />
        <Button className={styles.published} type="primary">
          发表
        </Button>
      </div>
    </div>
  )
}

export default DynamicContent
