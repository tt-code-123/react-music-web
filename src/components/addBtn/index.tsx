import React from 'react'
import { Dropdown, Menu, message } from 'antd'
import { useDispatch } from 'react-redux'

import { saveDefaultPlaylistAction, saveLikePlaylistAction } from '@/redux/action-creaters'
import { setLikeMusic } from '@/api'
import styles from './style.module.less'

interface IProps {
  musicIdArr: string[]
}
const AddBtn: React.FC<IProps> = ({ children, musicIdArr }) => {
  const dispatch = useDispatch()
  /** 处理点击添加到的回调 */
  const handleMenuClick = async ({ key }) => {
    if (key === 'default') {
      dispatch(saveDefaultPlaylistAction(musicIdArr))
    } else {
      const userString = localStorage.getItem('user')
      if (userString) {
        const user = JSON.parse(userString)
        await setLikeMusic(musicIdArr, user._id)
        dispatch(saveLikePlaylistAction(user._id))
        message.success('添加歌曲成功')
      }
    }
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="default">默认播放列表</Menu.Item>
      <Menu.Item key="like">我喜欢</Menu.Item>
    </Menu>
  )
  return (
    <Dropdown trigger={['click']} arrow overlayClassName={styles.addDropdown} placement="bottomCenter" overlay={menu}>
      {children}
    </Dropdown>
  )
}

export default AddBtn
