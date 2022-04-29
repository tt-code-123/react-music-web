import React, { useEffect, useState } from 'react'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal, Space } from 'antd'
import { ReactSortable } from 'react-sortablejs'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { MusicArrInfo } from '@/api/type'
import {
  deleteDefaultPlaylistAction,
  deletePlayCurrentMusicInfo,
  saveIsPlayingStatus,
  saveLikePlaylistAction,
  savePlayCurrentMusicInfo,
} from '@/redux/action-creaters'
import { ReducerStates } from '@/redux/reducers'
import { saveCurrentMusicIndex } from '@/redux/action-creaters/play-action'
import styles from './style.module.less'
import { delLikeMusic } from '@/api'
import { saveSortDefaultPlaylistAction } from '@/redux/action-creaters/playlist-action'

interface IProps {
  defPlaylist: MusicArrInfo[]
  setDefPlaylist: (list: MusicArrInfo[]) => void
  isDefault: boolean
}
const { confirm } = Modal

const MusicList: React.FC<IProps> = ({ defPlaylist, setDefPlaylist, isDefault }) => {
  const dispatch = useDispatch()
  /** 表格头部checkbox状态 */
  const [totalChecked, setTotalChecked] = useState(false)
  const { user, currentMusicInfo, isPlaying, defaultPlaylist, currentMusicIndex } = useSelector(
    (state: ReducerStates) => ({
      currentMusicInfo: state.currentPlayingInfo.currentMusicInfo,
      isPlaying: state.currentPlayingInfo.isPlaying,
      defaultPlaylist: state.defaultPlaylist,
      user: state.userInfo.user,
      likePlaylist: state.likePlaylist,
      currentMusicIndex: state.currentPlayingInfo.currentMusicIndex,
    }),
    shallowEqual,
  )
  useEffect(() => {
    if (isDefault) {
      if (currentMusicInfo && defaultPlaylist) {
        const index = defaultPlaylist.findIndex((item) => item === currentMusicInfo._id)
        index >= 0 && dispatch(saveCurrentMusicIndex(index))
      }
    }
  }, [JSON.stringify(defaultPlaylist), JSON.stringify(currentMusicInfo)])
  /** 处理表格头部checkbox改变的回调 */
  const handleHeaderCheckboxChange = (e) => {
    const list = [...defPlaylist]
    const playlist = list.map((item) => {
      item.isChecked = e.target.checked
      return item
    })
    setTotalChecked(e.target.checked)
    setDefPlaylist(playlist)
  }
  /** 处理歌曲列表checkbox改变的回调 */
  const handleListCheckboxChange = (index: number) => {
    const list = [...defPlaylist]
    list[index].isChecked = !list[index].isChecked
    const playlist = list.filter((item) => {
      return item.isChecked
    })
    if (playlist.length != list.length) {
      setTotalChecked(false)
    } else {
      setTotalChecked(true)
    }
    setDefPlaylist(list)
  }
  /** 处理批量删除的回调 */
  const handleDelClick = () => {
    const checkedList = defPlaylist.filter((item) => {
      return item.isChecked
    })

    if (!checkedList.length) {
      message.warning('请选择删除的歌曲')
      return
    }
    confirm({
      title: '确认删除选中歌曲？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const list = defPlaylist.filter((item) => {
          return item.isChecked
        })
        if (list.length === defPlaylist.length && defPlaylist.length != 0) {
          setTotalChecked(false)
          dispatch(deletePlayCurrentMusicInfo())
          dispatch(saveIsPlayingStatus(false))
          dispatch(saveCurrentMusicIndex(0))
          if (isDefault) {
            dispatch(deleteDefaultPlaylistAction([]))
          } else {
          }
        } else if (list.length > 0) {
          const value = []
          list.forEach((item) => {
            value.push(item._id)
          })
          const currentSongId = value.find((item) => item === currentMusicInfo?._id)
          if (currentSongId) {
            const listIndex = []
            for (let i = 0; i < defPlaylist.length; i++) {
              for (let j = 0; j < value.length; j++) {
                if (defPlaylist[i]._id === value[j]) {
                  listIndex.push(i)
                }
              }
            }
            let t = 0
            let tIndex = 1
            while (tIndex >= 0) {
              t = Math.floor(Math.random() * (defPlaylist.length - 1))
              tIndex = listIndex.find((item) => item === t)
              if (defPlaylist.length === 2 && tIndex === 0) {
                tIndex = -1
                t = 1
              }
            }
            dispatch(savePlayCurrentMusicInfo(defPlaylist[t]))
          }
          if (isDefault) {
            dispatch(deleteDefaultPlaylistAction(value))
          } else {
            delLikeMusic(value, (user as any)._id).then(() => {
              dispatch(saveLikePlaylistAction((user as any)._id))
            })
          }
        }
      },
      onCancel() {},
    })
  }
  /** 处理单个删除按钮图标的回调 */
  const handleIconDel = (_id: string, index: number) => {
    confirm({
      title: '确认删除选中歌曲？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if (currentMusicInfo && currentMusicInfo._id === _id) {
          if (defPlaylist.length === 1) {
            dispatch(deletePlayCurrentMusicInfo())
            dispatch(saveIsPlayingStatus(false))
          } else if (index + 1 === defPlaylist.length) {
            dispatch(savePlayCurrentMusicInfo(defPlaylist[0]))
          } else {
            dispatch(savePlayCurrentMusicInfo(defPlaylist[index + 1]))
          }
        }
        if (isDefault) {
          dispatch(deleteDefaultPlaylistAction([_id]))
        } else {
          delLikeMusic([_id], (user as any)._id).then(() => {
            dispatch(saveLikePlaylistAction((user as any)._id))
          })
        }
      },
    })
  }

  /** 处理点击歌手名字的回调 */
  const handleClickSingerName = (index: number) => {
    dispatch(savePlayCurrentMusicInfo(defPlaylist[index]))
    dispatch(saveIsPlayingStatus(true))
  }

  const handleSortAble = () => {
    if (isDefault) {
      dispatch(saveSortDefaultPlaylistAction(defPlaylist.map((item) => item._id)))
    }
    if (currentMusicInfo) {
      const index = defPlaylist.findIndex((item) => item._id === currentMusicInfo._id)
      dispatch(saveCurrentMusicIndex(index))
    }
  }
  return (
    <>
      <Button
        className={styles.delAllBtn}
        style={{ borderRadius: '40px', color: '#fff', backgroundColor: 'transparent' }}
        size="large"
        onClick={handleDelClick}
        icon={<DeleteOutlined />}>
        批量删除
      </Button>
      <div className={styles.musicList}>
        <ul className={styles.ulTitle}>
          <li>
            <input type="checkbox" checked={totalChecked} onChange={handleHeaderCheckboxChange} />
          </li>
          <li>全选</li>
          <li>歌曲</li>
          <li>歌手</li>
          <li>时长</li>
          <li>操作</li>
        </ul>
        <ReactSortable list={defPlaylist as any} setList={setDefPlaylist as any} animation={150} onEnd={handleSortAble}>
          {defPlaylist.length ? (
            defPlaylist.map((item, index) => {
              return (
                <ul
                  key={item._id}
                  className={(isPlaying && currentMusicInfo._id === item._id ? styles.playlistTr : '') + ' ' + styles.musicTr}>
                  <li>
                    <input type="checkbox" checked={item.isChecked} onChange={() => handleListCheckboxChange(index)} />
                  </li>
                  <li>{index + 1}</li>
                  <li onClick={() => handleClickSingerName(index)}>{item.music_name}</li>
                  <li>{item.singer_name}</li>
                  <li>{item.music_time}</li>
                  <li>
                    <Space size={20}>
                      <DeleteOutlined onClick={() => handleIconDel(item._id, index)} className={styles.delIcon} />
                    </Space>
                  </li>
                </ul>
              )
            })
          ) : (
            <ul>
              <li></li>
            </ul>
          )}
        </ReactSortable>
      </div>
    </>
  )
}

export default MusicList
