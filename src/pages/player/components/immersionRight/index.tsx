import React, { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { saveCurrentMusicIndex, saveIsPlayingStatus, savePlayCurrentMusicInfo } from '@/redux/action-creaters/play-action'
import { ReducerStates } from '@/redux/reducers'
import { MusicArrInfo } from '@/api/type'
import styles from './style.module.less'

interface IProps {
  defPlaylist: MusicArrInfo[]
  isLight: boolean
  isDefault: boolean
}
const ImmersionRight: React.FC<IProps> = ({ defPlaylist, isLight, isDefault }) => {
  const dispatch = useDispatch()
  const { currentMusicInfo, isPlaying, defaultPlaylist, likePlaylist } = useSelector(
    (state: ReducerStates) => ({
      currentMusicInfo: state.currentPlayingInfo.currentMusicInfo,
      isPlaying: state.currentPlayingInfo.isPlaying,
      defaultPlaylist: state.defaultPlaylist,
      likePlaylist: state.likePlaylist,
    }),
    shallowEqual,
  )
  useEffect(() => {
    if (isDefault) {
      if (currentMusicInfo && defaultPlaylist) {
        const index = defaultPlaylist.findIndex((item) => item === currentMusicInfo._id)
        index >= 0 && dispatch(saveCurrentMusicIndex(index))
      }
    } else {
      if (currentMusicInfo && likePlaylist) {
        const index = likePlaylist.findIndex((item) => item === currentMusicInfo._id)
        index >= 0 && dispatch(saveCurrentMusicIndex(index))
      }
    }
  }, [JSON.stringify(defaultPlaylist), JSON.stringify(likePlaylist), JSON.stringify(currentMusicInfo)])
  /** 处理点击歌手名字的回调 */
  const handleClickName = (index: number) => {
    dispatch(savePlayCurrentMusicInfo(defPlaylist[index]))
    dispatch(saveIsPlayingStatus(true))
  }
  return (
    <div className={styles.musicListWrapper}>
      <ul>
        {defPlaylist.length
          ? defPlaylist.map((item, index) => {
              return (
                <li
                  key={item._id}
                  style={{ color: isLight ? 'rgba(51,51,51,.7)' : '' }}
                  className={isPlaying && currentMusicInfo._id === item._id ? styles.playlistLi : ''}>
                  <div>{index + 1 < 10 ? '0' + (index + 1) : index + 1}</div>
                  <div
                    onClick={() => {
                      handleClickName(index)
                    }}>
                    {item.music_name}
                  </div>
                </li>
              )
            })
          : null}
      </ul>
    </div>
  )
}

export default ImmersionRight
