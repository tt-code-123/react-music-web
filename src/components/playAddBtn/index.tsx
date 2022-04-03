import React from 'react'
import { PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button, message, Space } from 'antd'

import AddBtn from '../addBtn'
import { getMusicById } from '@/api'
import { saveDefaultPlaylistAction, savePlayCurrentMusicInfo } from '@/redux/action-creaters'

interface IProps {
  selectRowKeys: string[]
}
const PlayAddBtn: React.FC<IProps> = ({ selectRowKeys }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  /** 处理多选播放 */
  const handlePlayAll = () => {
    if (selectRowKeys.length) {
      getMusicById(selectRowKeys[0]).then((item) => {
        dispatch(saveDefaultPlaylistAction(selectRowKeys))
        dispatch(savePlayCurrentMusicInfo(item.data as any))
        navigate('/player')
      })
    } else {
      message.error('您还没有选择任何歌曲')
    }
  }
  /** 处理多选添加 */
  const handleAddAll = () => {
    if (!selectRowKeys.length) {
      message.error('您还没有选择任何歌曲')
    }
  }
  return (
    <Space size={20}>
      <Button
        style={{ borderRadius: '40px' }}
        size="large"
        icon={<PlayCircleOutlined />}
        type={selectRowKeys.length ? 'primary' : 'default'}
        onClick={handlePlayAll}>
        播放选中的歌曲
      </Button>
      {selectRowKeys.length ? (
        <AddBtn musicIdArr={selectRowKeys}>
          <Button style={{ borderRadius: '40px' }} size="large" icon={<PlusOutlined />}>
            添加到
          </Button>
        </AddBtn>
      ) : (
        <Button style={{ borderRadius: '40px' }} size="large" icon={<PlusOutlined />} onClick={handleAddAll}>
          添加到
        </Button>
      )}
    </Space>
  )
}

export default PlayAddBtn
