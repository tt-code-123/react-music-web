import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Popover, Space } from 'antd'
import { ImportOutlined, UserOutlined } from '@ant-design/icons'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { UploadFile } from 'antd/lib/upload/interface'

import { ReducerStates } from '@/redux/reducers'
import { deleteUserInfoAction, updateUserInfoAction } from '@/redux/action-creaters'
import AvatarUpload from '../avatarUpload'
import { BASE_URL } from '@/config'
import { getUserInfoByUserId } from '@/api'
import styles from './style.module.less'

const LayoutHeader: React.FC = ({ children }) => {
  const [file, setFile] = useState<UploadFile[]>([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLogin, token, user } = useSelector(
    (state: ReducerStates) => ({
      isLogin: state.userInfo.isLogin,
      token: state.userInfo.token,
      user: state.userInfo.user,
    }),
    shallowEqual,
  )
  const avatarProps = {
    src: user && user.avatar_url && `${BASE_URL}/${user.avatar_url}`,
    icon: user && user.avatar_url ? '' : <UserOutlined />,
    size: 42,
  }
  /** 退出登录的回调 */
  const logOut = () => {
    dispatch(deleteUserInfoAction())
  }
  /** 上传头像的onChange */
  const handleUploadChange = (e) => {
    if (e.file.status === 'done') {
      getUserInfoByUserId(user && user._id).then((data) => {
        dispatch(updateUserInfoAction(data.data))
      })
    }
    setFile(e.fileList)
  }
  const content = useMemo(() => {
    if (user && token && isLogin) {
      return (
        <div className={styles.userInfoWrapper}>
          <div className={styles.userInfo}>
            <Avatar className={styles.userAvatar} {...avatarProps} />
            <div>{user?.username}</div>
            <AvatarUpload
              _id={(user as any)._id}
              onChange={(e) => {
                handleUploadChange(e)
              }}
              showUploadList={false}
              value={file}
            />
          </div>
          <p>
            <ImportOutlined />
            <span onClick={logOut}>退出登录</span>
          </p>
        </div>
      )
    } else {
      return (
        <div className={styles.userInfoWrapper}>
          <Space size={70}>
            <Button onClick={() => navigate('/login')} size="large" type="primary" style={{ borderRadius: '40px' }}>
              登录
            </Button>
            <Button onClick={() => navigate('/registered')} size="large" style={{ borderRadius: '40px' }}>
              注册
            </Button>
          </Space>
        </div>
      )
    }
  }, [user, token, isLogin, JSON.stringify(file)])
  return (
    <div className={styles.headerOuter}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerLeft} onClick={() => navigate('/t/home')}>
          <img src={require('@/assets/img/music.jfif')} alt="" />
        </div>
        <div className={styles.headerCenter}>{children}</div>
        <div className={styles.headerRight}>
          <Popover placement="bottomRight" content={content}>
            <Avatar {...avatarProps} icon={<UserOutlined />} />
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default LayoutHeader
