import React, { useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { message, Slider } from 'antd'
import {
  CaretRightOutlined,
  DownloadOutlined,
  HeartOutlined,
  PauseOutlined,
  RetweetOutlined,
  SoundOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SwapOutlined,
  SwapRightOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

import { BASE_URL } from '@/config'
import { saveIsPlayingStatus, saveLikePlaylistAction } from '@/redux/action-creaters'
import { ReducerStates } from '@/redux/reducers'
import { getRandom, parseLyrics } from '@/utils'
import { saveCurrentMusicIndex, saveCurrentMusicLyricsIndex, savePlayCurrentMusicInfo } from '@/redux/action-creaters/play-action'
import { MusicArrInfo } from '@/api/type'
import download from '@/utils/download'
import styles from './style.module.less'
import { delLikeMusic, setLikeMusic } from '@/api'

interface IProps {
  defPlaylist: MusicArrInfo[]
  isLight: boolean
  isDefault: boolean
}
function findLike(likePlaylist: string[], _id: string) {
  return likePlaylist.find((item) => item === _id)
}
const MusicPlayerControl: React.FC<IProps> = ({ defPlaylist, isLight, isDefault }) => {
  const audioRef = useRef(null)
  /** 播放模式*/
  const [sequence, setSequence] = useState<number>(0) // 0顺序 1循环 2随机
  /** 喜欢的歌*/
  const [likeSong, setLikeSong] = useState<string[]>([])
  /** 当前播放时间*/
  const [currentTime, setCurrentTime] = useState<number>(0)
  /** slider条是否正在被拖动改变*/
  const [isChanging, setIsChanging] = useState(false)
  /** 歌曲slider条的进度*/
  const [progress, setProgress] = useState<number>(0)
  /** 音量slider条的进度*/
  const [volumeProgress, setVolumeProgress] = useState<number>(50)
  const dispatch = useDispatch()
  const { user, likePlaylist, currentMusicInfo, isPlaying, defaultPlaylist, currentMusicIndex, currentMusicLyricsIndex } = useSelector(
    (state: ReducerStates) => ({
      currentMusicInfo: state.currentPlayingInfo.currentMusicInfo,
      defaultPlaylist: state.defaultPlaylist,
      isPlaying: state.currentPlayingInfo.isPlaying,
      currentMusicIndex: state.currentPlayingInfo.currentMusicIndex,
      currentMusicLyricsIndex: state.currentPlayingInfo.currentMusicLyricsIndex,
      likePlaylist: state.likePlaylist,
      user: state.userInfo.user,
    }),
    shallowEqual,
  )
  const duration = currentMusicInfo && Number(currentMusicInfo.music_second) * 1000
  useEffect(() => {
    setLikeSong(likePlaylist)
  }, [likePlaylist])
  useEffect(() => {
    setCurrentTime(0)
    setProgress(0)
  }, [currentMusicInfo])
  useEffect(() => {
    if (currentMusicInfo) {
      audioRef.current.src = `${BASE_URL}/${currentMusicInfo.music_url}`
      audioRef.current
        .play()
        .then(() => {
          dispatch(saveIsPlayingStatus(true))
        })
        .catch(() => {
          dispatch(saveIsPlayingStatus(false))
        })
    } else {
      audioRef.current.pause()
      audioRef.current.src = ``
    }
  }, [currentMusicInfo])
  /** 播放音乐的回调*/
  const handleChangePlay = () => {
    if (currentMusicInfo) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play()
      dispatch(saveIsPlayingStatus(!isPlaying))
    }
  }
  /** 改变播放模式的回调*/
  const handleChangeSequence = () => {
    let currentSequence = sequence + 1
    if (currentSequence > 2) {
      currentSequence = 0
    }
    setSequence(currentSequence)
  }
  /** 歌曲结束的回调 */
  const handleMusicEnded = () => {
    if (sequence === 1) {
      // 循环播放
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else if (sequence === 2) {
      // 随机播放
      changeMusic(2)
    } else {
      // 顺序播放
      changeMusic(1)
    }
    message.destroy()
  }
  /** 歌曲时间变化的回调 */
  const handleTimeUpdate = (e) => {
    if (currentMusicInfo) {
      const currentTime = e.target.currentTime
      if (!isChanging) {
        setCurrentTime(currentTime * 1000)
        setProgress(((currentTime * 1000) / duration) * 100)
      }
      // 获取当前歌词
      let i = 0
      const music_lyrics = parseLyrics(currentMusicInfo.music_lyrics)
      for (; i < music_lyrics.length; i++) {
        let lyricItem = music_lyrics[i]
        if (currentTime * 1000 < lyricItem.time) {
          break
        }
      }

      if (currentMusicLyricsIndex !== i - 1 && isPlaying) {
        dispatch(saveCurrentMusicLyricsIndex(i - 1))
        const content = music_lyrics[i - 1] && music_lyrics[i - 1].content
        message.open({
          content: content,
          type: 'success',
          key: 'lyric',
          duration: 0,
          className: styles.lyricsMessage,
          icon: <div></div>,
        })
      }
    }
  }
  /** slider滑动条改变的回调 */
  const sliderChange = (value) => {
    setIsChanging(true)
    const currentTime = (value / 100) * duration
    setCurrentTime(currentTime)
    setProgress(value)
  }
  /** 点击滑动条手放之前的回调 */
  const sliderAfterChange = (value) => {
    const currentTime = ((value / 100) * duration) / 1000
    audioRef.current.currentTime = currentTime
    setCurrentTime((value / 100) * duration)
    setIsChanging(false)
    if (!isPlaying) {
      handleChangePlay()
    }
  }
  const volumnChange = (value) => {
    audioRef.current.volume = value / 100
    setVolumeProgress(value)
  }

  /** 切歌的回调 */
  const changeMusic = (tag) => {
    if (currentMusicInfo) {
      if (isDefault) {
        if (defaultPlaylist && defPlaylist.length > 0) {
          if (defaultPlaylist.length == 1) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
          } else {
            let index = 0
            switch (sequence) {
              case 2: // 随机播放
                let randomIndex = getRandom(defaultPlaylist.length)
                while (randomIndex === currentMusicIndex) {
                  randomIndex = getRandom(defaultPlaylist.length)
                }
                index = randomIndex
                break
              default:
                index = currentMusicIndex
                index += tag
                if (index >= defaultPlaylist.length) index = 0
                if (index < 0) index = defaultPlaylist.length - 1
                break
            }

            const currentMusic = defPlaylist[index]
            dispatch(savePlayCurrentMusicInfo(currentMusic))
          }
          dispatch(saveIsPlayingStatus(true))
        }
      } else {
        if (likePlaylist && defPlaylist.length > 0) {
          if (likePlaylist.length == 1) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
          } else {
            let index = 0
            switch (sequence) {
              case 2: // 随机播放
                let randomIndex = getRandom(likePlaylist.length)
                while (randomIndex === currentMusicIndex) {
                  randomIndex = getRandom(likePlaylist.length)
                }
                index = randomIndex
                break
              default:
                index = currentMusicIndex
                index += tag
                if (index >= likePlaylist.length) index = 0
                if (index < 0) index = likePlaylist.length - 1
                break
            }
            const currentMusic = defPlaylist[index]
            dispatch(savePlayCurrentMusicInfo(currentMusic))
            dispatch(saveCurrentMusicIndex(index))
          }
          dispatch(saveIsPlayingStatus(true))
        }
      }
    }
  }
  /** 下载歌曲*/
  const handleDownload = () => {
    // const blob = new Blob([data], { type: "image/jpeg" });
    currentMusicInfo && download(`${BASE_URL}/image/download/?audioUrl=${currentMusicInfo.music_url}`)
  }
  /** 喜欢歌曲*/
  const handleLike = (music_id: string) => {
    if (likeSong.find((item) => item === music_id)) {
      delLikeMusic([music_id], (user as any)._id).then(() => {
        const arr = likePlaylist.filter((item) => item != music_id)
        setLikeSong(arr)
      })
    } else {
      setLikeMusic([music_id], (user as any)._id).then(() => {
        dispatch(saveLikePlaylistAction((user as any)._id))
      })
    }
  }
  /** 播放模式按钮*/
  const SequenceIcon = useMemo(() => {
    switch (sequence) {
      case 0:
        return <SwapRightOutlined title="顺序播放" style={{ color: isLight ? '#3a3a3e' : '' }} />
      case 1:
        return <RetweetOutlined title="循环播放" style={{ color: isLight ? '#3a3a3e' : '' }} />
      case 2:
        return <SwapOutlined title="随机播放" style={{ color: isLight ? '#3a3a3e' : '' }} />
      default:
        return <SwapRightOutlined title="顺序播放" style={{ color: isLight ? '#3a3a3e' : '' }} />
    }
  }, [sequence, isLight])
  return (
    <div className={styles.playerControlWrapper}>
      <div className={styles.playerControlLeft}>
        <span onClick={handleChangeSequence}>{SequenceIcon}</span>
        <span>
          <StepBackwardOutlined style={{ color: isLight ? '#3a3a3e' : '' }} onClick={() => changeMusic(-1)} />
        </span>
        <span onClick={handleChangePlay}>
          {isPlaying ? (
            <PauseOutlined style={{ color: isLight ? '#3a3a3e' : '' }} />
          ) : (
            <CaretRightOutlined style={{ color: isLight ? '#3a3a3e' : '' }} />
          )}
        </span>
        <span>
          <StepForwardOutlined style={{ color: isLight ? '#3a3a3e' : '' }} onClick={() => changeMusic(1)} />
        </span>
      </div>
      <div className={styles.playerControlCenter}>
        <div className={styles.playerInfoBox}>
          <p>
            <span style={{ color: isLight ? '#525252' : '' }}>{currentMusicInfo && currentMusicInfo.music_name}</span>{' '}
            <span style={{ color: isLight ? '#525252' : '' }}>-</span>{' '}
            <span style={{ color: isLight ? '#525252' : '' }}>{currentMusicInfo && currentMusicInfo.singer_name}</span>
          </p>
          <h2>
            <span style={{ color: isLight ? '#525252' : '' }}>{dayjs(currentTime).format('mm:ss')}</span>{' '}
            <span style={{ color: isLight ? '#525252' : '' }}>/</span>{' '}
            <span style={{ color: isLight ? '#525252' : '' }}>{(currentMusicInfo && currentMusicInfo.music_time) || '00:00'}</span>
          </h2>
        </div>
        <Slider
          tipFormatter={() => dayjs(currentTime).format('mm:ss')}
          defaultValue={0}
          value={progress}
          onChange={sliderChange}
          onAfterChange={sliderAfterChange}
        />
      </div>
      <div className={styles.playerControlRight}>
        <div>
          <DownloadOutlined style={{ color: isLight ? '#3a3a3e' : '' }} onClick={handleDownload} title="下载" />
        </div>
        <div>
          <HeartOutlined
            onClick={() => {
              if (currentMusicInfo) {
                handleLike(currentMusicInfo._id)
              }
            }}
            style={{ color: currentMusicInfo && findLike(likeSong, currentMusicInfo._id) ? '#e91e63' : '' }}
          />
        </div>
        <div>
          <SoundOutlined style={{ color: isLight ? '#3a3a3e' : '' }} />
        </div>
        <Slider onChange={volumnChange} defaultValue={volumeProgress} />
      </div>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleMusicEnded} />
    </div>
  )
}
export default MusicPlayerControl
