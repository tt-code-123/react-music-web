import React, { useCallback, useEffect, useRef, useState } from 'react'
import { message, Switch } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import LayoutHeader from '@/components/layoutHeader'
import MusicList from './components/musicList'
import Lyrics from './components/lyrics'
import ImmersionCenter from './components/immersionCenter'
import MusicPlayerControl from './components/musicPlayerControl'
import { ReducerStates } from '@/redux/reducers'
import { getMusicByIdArr } from '@/api'
import { MusicArrInfo } from '@/api/type'
import { BASE_URL } from '@/config'
import { deletePlayCurrentMusicInfo, saveIsPlayingStatus, saveLikePlaylistAction } from '@/redux/action-creaters'
import styles from './style.module.less'
import ImmersionRight from './components/immersionRight'
import { saveCurrentMusicIndex, saveCurrentMusicLyricsIndex } from '@/redux/action-creaters/play-action'
import { useNavigate } from 'react-router-dom'

const Player: React.FC = () => {
  /** 默认播放列表 */
  const [defPlaylist, setDefPlaylist] = useState<MusicArrInfo[]>([])
  const inputSearchRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { likePlayList, defaultPlaylist, isPlaying, currentMusicInfo } = useSelector(
    (state: ReducerStates) => ({
      defaultPlaylist: state.defaultPlaylist,
      isPlaying: state.currentPlayingInfo.isPlaying,
      currentMusicInfo: state.currentPlayingInfo.currentMusicInfo,
      likePlayList: state.likePlaylist,
    }),
    shallowEqual,
  )
  /** 是否沉浸 */
  const [isImmersion, setIsImmersion] = useState<boolean>(false)
  /** 是否亮 */
  const [isLight, setIsLight] = useState<boolean>(false)
  /** 是否是默认播放列表 */
  const [isDefault, setIsDefault] = useState<boolean>(true)
  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      const user = JSON.parse(userString)
      if (!isDefault) {
        dispatch(saveLikePlaylistAction(user._id))
      }
    }
  }, [isDefault])
  useEffect(() => {
    if (isDefault) {
      getMusicByIdArr(defaultPlaylist).then((item) => {
        const data = []
        for (let i = 0; i < defaultPlaylist.length; i++) {
          for (let j = 0; j < item.data.length; j++) {
            if (defaultPlaylist[i] === item.data[j]._id) {
              data.push(item.data[j])
            }
          }
        }
        setDefPlaylist(data)
      })
    } else {
      getMusicByIdArr(likePlayList).then((item) => {
        const data = []
        for (let i = 0; i < likePlayList.length; i++) {
          for (let j = 0; j < item.data.length; j++) {
            if (likePlayList[i] === item.data[j]._id) {
              data.push(item.data[j])
            }
          }
        }
        setDefPlaylist(item.data)
      })
    }
  }, [JSON.stringify(defaultPlaylist), isDefault, JSON.stringify(likePlayList)])
  useEffect(() => {
    return () => {
      message.destroy()
      dispatch(saveIsPlayingStatus(false))
      dispatch(deletePlayCurrentMusicInfo())
    }
  }, [])
  /** 处理沉浸式开关按钮的回调 */
  const handleSwitchChange = useCallback((checked: boolean) => {
    setIsImmersion(checked)
    setIsLight(false)
  }, [])
  /** 切换播放列表的回调 */
  const handleChangeDefault = (tag: boolean) => {
    setIsDefault(tag)
    dispatch(saveCurrentMusicIndex(0))
    dispatch(saveCurrentMusicLyricsIndex(0))
    dispatch(deletePlayCurrentMusicInfo())
    dispatch(saveIsPlayingStatus(false))
    message.destroy()
  }
  /** 搜索的回调 */
  const handleSearch = () => {
    const { value } = inputSearchRef.current
    if (value) {
      navigate(`/search?keywords=${value}`)
    }
  }
  return (
    <div className={styles.playerWrapper}>
      <LayoutHeader>
        {isImmersion ? (
          <div
            onClick={() => setIsLight(!isLight)}
            style={{ backgroundImage: isLight ? `url(${require('@/assets/img/moon.png')})` : `url(${require('@/assets/img/sun.png')})` }}
            className={styles.playerIcon}></div>
        ) : null}
        <div className={styles.switchBtn}>
          <Switch onChange={handleSwitchChange} checkedChildren="沉浸" unCheckedChildren="沉浸" />
        </div>
        <div className={styles.headerSearchInput}>
          <input placeholder="搜索歌曲、歌手" ref={inputSearchRef} />
          <span className={styles.headerIcon} onClick={handleSearch}>
            <SearchOutlined />
          </span>
        </div>
      </LayoutHeader>

      <div className={styles.playerContent}>
        {!isImmersion ? (
          <ul className={styles.playerLeft}>
            <li
              style={{ color: isDefault ? '#e91e63' : '' }}
              onClick={() => handleChangeDefault(true)}
              className={isDefault && isPlaying ? styles.isPlaying : ''}>
              默认播放列表
            </li>
            <li
              style={{ color: !isDefault ? '#e91e63' : '' }}
              onClick={() => handleChangeDefault(false)}
              className={!isDefault && isPlaying ? styles.isPlaying : ''}>
              我喜欢
            </li>
          </ul>
        ) : (
          <div className={styles.immersionLeft}>
            <div className={styles.immersionBox}>
              <img src={currentMusicInfo && `${BASE_URL}/${currentMusicInfo.music_img}`} alt="" />
              <p style={{ color: isLight ? '#666666' : '#fff' }}>{currentMusicInfo && currentMusicInfo.music_name}</p>
              <p style={{ color: isLight ? 'rgba(51,51,51,.8)' : 'hsla(0,0%,100%,.3)' }}>
                {currentMusicInfo && currentMusicInfo.singer_name}
              </p>
            </div>
          </div>
        )}
        {!isImmersion ? (
          <div className={styles.playerCenter}>
            <MusicList isDefault={isDefault} setDefPlaylist={(list) => setDefPlaylist(list)} defPlaylist={defPlaylist} />
          </div>
        ) : (
          <div className={styles.immersionCenter}>
            <ImmersionCenter isLight={isLight} />
          </div>
        )}
        {!isImmersion ? (
          <div className={styles.playerRight}>
            <Lyrics />
          </div>
        ) : (
          <div className={styles.immersionRight}>
            <ImmersionRight isDefault={isDefault} isLight={isLight} defPlaylist={defPlaylist} />
          </div>
        )}
      </div>

      <div className={styles.playerFooter}>
        <MusicPlayerControl isDefault={isDefault} defPlaylist={defPlaylist} isLight={isLight} />
      </div>
      <div className={styles.bgMask} style={{ backgroundColor: isLight ? 'hsla(0,0%,100%,.7)' : 'rgba(0,0,0,.8)' }}></div>
      <div
        className={styles.bgPlayer}
        style={{ backgroundImage: defaultPlaylist.length && currentMusicInfo && `url(${BASE_URL}/${currentMusicInfo.music_img})` }}></div>
    </div>
  )
}

export default Player
