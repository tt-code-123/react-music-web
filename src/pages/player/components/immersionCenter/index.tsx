import React, { useEffect, useRef } from 'react'
import { shallowEqual, useSelector } from 'react-redux'

import { ReducerStates } from '@/redux/reducers'
import { parseLyrics, scrollTo } from '@/utils'
import styles from './style.module.less'

interface IProps {
  isLight: boolean
}

const ImmersionCenter: React.FC<IProps> = ({ isLight }) => {
  const lyricsRef = useRef(null)
  const { currentMusicInfo, currentMusicLyricsIndex } = useSelector(
    (state: ReducerStates) => ({
      currentMusicInfo: state.currentPlayingInfo.currentMusicInfo,
      currentMusicLyricsIndex: state.currentPlayingInfo.currentMusicLyricsIndex,
    }),
    shallowEqual,
  )
  useEffect(() => {
    if (currentMusicInfo) {
      if (currentMusicLyricsIndex >= 0 && currentMusicLyricsIndex < 3) return
      scrollTo(lyricsRef.current, (currentMusicLyricsIndex - 3) * 50, 500)
    }
  }, [currentMusicLyricsIndex])
  const lyrics = currentMusicInfo && parseLyrics(currentMusicInfo.music_lyrics)
  return (
    <div className={styles.musiclyrics} ref={lyricsRef}>
      <ul>
        {lyrics &&
          lyrics.map((item, index) => {
            return (
              <li
                style={{ color: isLight ? '#3a3a3e' : '#fff' }}
                className={currentMusicLyricsIndex === index ? styles.musicLyricsLight : ''}
                key={index}>
                {item.content}
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default ImmersionCenter
