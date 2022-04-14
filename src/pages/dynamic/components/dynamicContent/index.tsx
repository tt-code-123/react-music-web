import React, { useMemo } from 'react'
import { Avatar, Tooltip, Input, Button, Space } from 'antd'
import { shallowEqual, useSelector } from 'react-redux'
import { LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'

import { DynamicDataType } from '@/api/type'
import { BASE_URL } from '@/config'
import DynamicItem from '../dynamicItem'
import { addReply, UpdateLikeDynamic } from '@/api'
import { ReducerStates } from '@/redux/reducers'
import dayjs from 'dayjs'
import styles from './style.module.less'

interface IProps {
  data: DynamicDataType
  setDynamicItem: (dynamic: DynamicDataType) => void
}
const { TextArea } = Input
function formateData(v: DynamicDataType) {
  const { commentInfo } = v
  if (commentInfo?.length > 0) {
    return {
      ...v,
      commentInfo: commentInfo
        .filter((ele) => !ele.to_id)
        .map((comment) => {
          return {
            ...comment,
            children: commentInfo.filter((ele) => ele.p_id === comment.p_id && ele.to_id),
          }
        }),
    }
  } else {
    return v
  }
}
const DynamicContent: React.FC<IProps> = ({ data, setDynamicItem }) => {
  const commentData = useMemo(() => {
    return formateData(data)
  }, [data])
  const { user } = useSelector(
    (state: ReducerStates) => ({
      user: state.userInfo.user,
    }),
    shallowEqual,
  )

  /**textarea改变的回调 */
  const handleAreaChange = (e, idx?: number, ids?: number) => {
    const newData = { ...data }
    if (ids != undefined) {
      newData.commentInfo.map((item) => {
        if (item._id === commentData.commentInfo[idx].children[ids]._id) {
          item.value = e.target.value
        }
      })
    } else if (idx != undefined) {
      newData.commentInfo.map((item) => {
        if (item._id === commentData.commentInfo[idx]._id) {
          item.value = e.target.value
        }
        return item
      })
    } else {
      newData.value = e.target.value
    }
    setDynamicItem(newData)
  }
  /**textarea失去焦点的回调 */
  const handleAreaBlur = () => {
    const newData = { ...data }
    newData.isShowArea = false
    newData.commentInfo.map((item) => {
      item.isShowArea = false
      return item
    })
  }
  /**点击回复icon的回调 */
  const handleClickIcon = (idx?: number, ids?: number) => {
    handleAreaBlur()
    const newData = { ...data }
    if (ids != undefined) {
      newData.commentInfo.map((item) => {
        if (item._id === commentData.commentInfo[idx].children[ids]._id) {
          item.isShowArea = !item.isShowArea
        }
        return item
      })
    } else if (idx !== undefined) {
      newData.commentInfo.map((item) => {
        if (item._id === commentData.commentInfo[idx]._id) {
          item.isShowArea = !item.isShowArea
        }
        return item
      })
    } else {
      newData.isShowArea = !newData.isShowArea
    }
    setDynamicItem(newData)
  }
  /**点击喜欢按钮的回调 */
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
  /**
   * 处理发表按钮的回调
   */
  const handlePub = (dynamic_id: string, from_id: string, p_id?: string, to_id?: string, idx?: number, ids?: number) => {
    const create_time = dayjs().format('YYYY-MM-DD hh:mm')
    const newData = { ...data }
    let content = ''
    if (ids != undefined) {
      newData.commentInfo.forEach((item) => {
        if (item._id === commentData.commentInfo[idx].children[ids]._id) {
          content = item.value
        }
      })
    } else if (idx !== undefined) {
      newData.commentInfo.forEach((item) => {
        if (item._id === commentData.commentInfo[idx]._id) {
          content = item.value
        }
        return item
      })
    } else {
      content = newData.value
    }
    if (content) {
      addReply(dynamic_id, content, create_time, from_id, p_id, to_id).then((data) => {
        console.log(data, '132')
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
                  <div className={styles.pub} style={{ display: commentData.commentInfo[idx].isShowArea ? 'block' : 'none' }}>
                    <TextArea allowClear autoSize value={commentData.commentInfo[idx].value} onChange={(e) => handleAreaChange(e, idx)} />
                    <Button
                      className={styles.published}
                      type="primary"
                      onClick={() =>
                        handlePub(data._id, user && user._id, commentData.commentInfo[idx].p_id, commentData.commentInfo[idx].from_id, idx)
                      }>
                      发表
                    </Button>
                  </div>
                  {item.children?.map((iten, ids) => (
                    <DynamicItem
                      dynamic_id={data._id}
                      handlePubsub={handlePub}
                      iten={iten}
                      ids={ids}
                      idx={idx}
                      key={iten._id}
                      clickIcon={handleClickIcon}
                      areaChange={handleAreaChange}
                    />
                  ))}
                </div>
              )
            })
          : null}
      </div>
      <div className={styles.pub} style={{ display: data.isShowArea ? 'block' : 'none' }}>
        <TextArea allowClear autoSize value={data.value} onChange={(e) => handleAreaChange(e)} />
        <Button className={styles.published} type="primary" onClick={() => handlePub(data._id, user && user._id)}>
          发表
        </Button>
      </div>
    </div>
  )
}

export default DynamicContent
