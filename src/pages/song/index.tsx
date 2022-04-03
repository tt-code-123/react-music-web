import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Space } from 'antd'
import { PlayCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'

import { getMusicById } from '@/api'
import { parseLyrics } from '@/utils'
import { BASE_URL } from '@/config'
import { MusicByIdType } from '@/api/type'
import { LyricsType } from '@/utils/parseLyrics'
import styles from './style.module.less'
import AddBtn from '@/components/addBtn'

const Song: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const songLyricsRef = useRef(null)
  const [songInfo, setSongInfo] = useState<MusicByIdType['data']>()
  const [lyrics, setLyrics] = useState<LyricsType[]>()
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    getMusicById(params._id).then((res) => {
      if (res.status) {
        setSongInfo(res.data)
        setLyrics(parseLyrics(res.data.music_lyrics))
      }
    })
  }, [])
  /** 播放歌曲的回调 */
  const handlePlayClick = (musicIdArr: string[]) => {
    console.log(musicIdArr)
  }
  /**处理改变isOpen */
  const handleChangeIsOpen = () => {
    if (isOpen) {
      songLyricsRef.current.style.overflow = 'hidden'
      songLyricsRef.current.style.height = '545px'
    } else {
      songLyricsRef.current.style.overflow = 'none'
      songLyricsRef.current.style.height = '100%'
    }
    setIsOpen(!isOpen)
  }
  /** 处理点击歌手名字的回调 */
  const handleClickSinger = (singerId: string) => {
    navigate(`/t/singer/${singerId}`)
  }
  return (
    <div className={styles.songWrapper}>
      <div className={styles.songHeader}>
        <div className={styles.songBgBlur}>
          <img src={songInfo && `${BASE_URL}/${songInfo.music_img}`} alt="" />
        </div>
        <div style={{ height: '50px' }}></div>
        <div className={styles.songInfoBox}>
          <img src={songInfo && `${BASE_URL}/${songInfo.music_img}`} alt="" />
          <div className={styles.songInfo}>
            <h2 className={styles.songName}>{songInfo && songInfo.music_name}</h2>
            <div className={styles.songSinger}>
              <Avatar size={20} icon={<UserOutlined />} />
              <span onClick={() => handleClickSinger(songInfo.singer_id)}>{songInfo && songInfo.singer_name}</span>
            </div>
            <div className={styles.songAbout}>
              <p>作词：{songInfo && songInfo.singer_name}</p>
              <p>作曲：{songInfo && songInfo.singer_name}</p>
              <p>
                所属专辑：<span>{songInfo && songInfo.album_name}</span>
              </p>
              <p>标签：{songInfo && songInfo.music_tag}</p>
            </div>
            <Space size={20} className={styles.songSpace}>
              <Button onClick={() => handlePlayClick([songInfo._id])} size="large" icon={<PlayCircleOutlined />} type="primary">
                播放歌曲
              </Button>
              <AddBtn musicIdArr={[params._id]}>
                <Button size="large" icon={<PlusOutlined />}>
                  添加到
                </Button>
              </AddBtn>
            </Space>
          </div>
        </div>
      </div>
      <div className={styles.songLyricsBox}>
        <h2>歌词</h2>
        <div ref={songLyricsRef} className={styles.songLyrics}>
          {lyrics && lyrics.map((item, index) => <p key={index}>{item.content}</p>)}
        </div>
        <span onClick={handleChangeIsOpen} className={styles.isOpenSpan}>
          {isOpen ? '收起' : '展开'}
        </span>
      </div>
    </div>
  )
}

export default Song
