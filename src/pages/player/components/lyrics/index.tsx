import React, { useEffect, useRef } from 'react'
import { shallowEqual, useSelector } from 'react-redux'

import { ReducerStates } from '@/redux/reducers'
import { BASE_URL } from '@/config'
import { parseLyrics, scrollTo } from '@/utils'
import styles from './style.module.less'

const Lyrics: React.FC = () => {
  const { currentMusicInfo, currentMusicLyricsIndex } = useSelector(
    (state: ReducerStates) => ({
      currentMusicInfo: state.currentPlayingInfo.currentMusicInfo,
      currentMusicLyricsIndex: state.currentPlayingInfo.currentMusicLyricsIndex,
    }),
    shallowEqual,
  )
  const lyricsRef = useRef(null)
  useEffect(() => {
    if (currentMusicInfo) {
      if (currentMusicLyricsIndex >= 0 && currentMusicLyricsIndex < 3) return
      scrollTo(lyricsRef.current, (currentMusicLyricsIndex - 3) * 30, 300)
    }
  }, [currentMusicLyricsIndex])

  const lyrics = currentMusicInfo && parseLyrics(currentMusicInfo.music_lyrics)
  return currentMusicInfo ? (
    <div className={styles.musicWrapper}>
      <div className={styles.musicImg}>
        <img src={`${BASE_URL}/${currentMusicInfo.music_img}`} alt="" />
      </div>
      <div className={styles.musicInfo}>
        <p>歌曲名：{currentMusicInfo.music_name}</p>
        <p>歌手名：{currentMusicInfo.singer_name}</p>
      </div>
      <div className={styles.musiclyrics} ref={lyricsRef}>
        <ul>
          {lyrics.map((item, index) => {
            return (
              <li className={currentMusicLyricsIndex === index ? styles.musicLyricsLight : ''} key={index}>
                {item.content}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  ) : null
}

export default Lyrics
