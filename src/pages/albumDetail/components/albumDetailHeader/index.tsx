import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Space } from 'antd'
import { PlayCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { BASE_URL } from '@/config'
import { AlbumByAlbumId } from '@/api/type'
import { getAlbumByAlbumId, getMusicById } from '@/api'
import AlbumIntroModal, { IRef } from '../albumIntroModal'
import AddBtn from '@/components/addBtn'
import styles from './style.module.less'

import { saveDefaultPlaylistAction, savePlayCurrentMusicInfo } from '@/redux/action-creaters'

interface IProps {
  albumMusicIdArr: string[]
}
const AlbumDetailHeader: React.FC<IProps> = ({ albumMusicIdArr }) => {
  const params = useParams()
  const navigate = useNavigate()
  const albumIntroRef = useRef<IRef>()
  const dispatch = useDispatch()
  const [albumInfo, setAlbumInfo] = useState<AlbumByAlbumId['data']>()
  useEffect(() => {
    getAlbumByAlbumId(params._id).then((album) => {
      setAlbumInfo(album.data)
    })
  }, [])
  /** 处理点击歌手名字的回调 */
  const handleClickSinger = (singerId: string) => {
    navigate(`/t/singer/${singerId}`)
  }
  /** 处理全部播放的回调 */
  const handlePlay = () => {
    getMusicById(albumMusicIdArr[0]).then((item) => {
      dispatch(savePlayCurrentMusicInfo(item.data as any))
      dispatch(saveDefaultPlaylistAction(albumMusicIdArr))
      navigate('/player')
    })
  }
  const albumIntro = albumInfo && albumInfo.album_introduction.replace(/\\n/g, '')
  return (
    <div className={styles.albumDetailHeader}>
      <div className={styles.albumDetailBg}>
        <img src={albumInfo && `${BASE_URL}/${albumInfo.album_img}`} alt="" />
      </div>
      <div style={{ height: '50px' }}></div>
      <div className={styles.albumDetailnfoBox}>
        <div className={styles.albumImgBox}>
          <img src={albumInfo && `${BASE_URL}/${albumInfo.album_img}`} alt="" />
        </div>
        <div className={styles.albumDetailnfo}>
          <h2>{albumInfo && albumInfo.album_name}</h2>
          <div className={styles.songSinger}>
            <Avatar size={20} icon={<UserOutlined />} />
            <span onClick={() => handleClickSinger(albumInfo.singer_id)}>{albumInfo && albumInfo.singer_name}</span>
          </div>
          <div className={styles.releaseInfo}>
            <span>发行时间：{albumInfo && albumInfo.release_time}</span>
            <span>发行公司：{albumInfo && albumInfo.release_company}</span>
          </div>
          <div className={styles.albumIntroduction}>
            <p>简介：{albumIntro}</p>
            <span onClick={() => albumIntroRef.current.open()}>查看更多</span>
          </div>
          <Space size={20}>
            <Button onClick={handlePlay} icon={<PlayCircleOutlined />} size="large" type="primary" style={{ borderRadius: '40px' }}>
              全部播放
            </Button>
            <AddBtn musicIdArr={albumMusicIdArr}>
              <Button size="large" style={{ borderRadius: '40px' }} icon={<PlusOutlined />}>
                全部添加到
              </Button>
            </AddBtn>
          </Space>
        </div>
      </div>
      <AlbumIntroModal ref={albumIntroRef} name={albumInfo && albumInfo.album_name} intro={albumInfo && albumInfo.album_introduction} />
    </div>
  )
}

export default AlbumDetailHeader
