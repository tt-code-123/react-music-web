import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AlbumDetailHeader from './components/albumDetailHeader'
import AlbumMusic from './components/albumMusic'
import { AlbumInfo, MusicAlbumInfo } from '@/api/type'
import { getMusicByAlbumId, getOtherAlbum } from '@/api'
import AlbumItem from '@/components/albumItem'
import styles from './style.module.less'

const AlbumDetail: React.FC = () => {
  const params = useParams()
  const [albumMusicInfo, setAlbumMusicInfo] = useState<MusicAlbumInfo[]>([])
  const [albumInfo, setAlbuInfo] = useState<AlbumInfo[]>([])
  useEffect(() => {
    getMusicByAlbumId(params._id).then((music) => {
      getOtherAlbum(music.data[0].singer_id, params._id).then((album) => {
        setAlbuInfo(album.data)
      })
      setAlbumMusicInfo(music.data)
    })
  }, [])
  const albumMusicIdArr = []
  albumMusicInfo.length &&
    albumMusicInfo.forEach((item) => {
      albumMusicIdArr.push(item._id)
    })
  return (
    <div className={styles.albumDetaiWrapper}>
      <AlbumDetailHeader albumMusicIdArr={albumMusicIdArr} />
      <div className={styles.albumMusicTable}>
        <AlbumMusic albumMusicInfo={albumMusicInfo} />
      </div>
      <div className={styles.otherAlbum}>
        <h2>歌手其他专辑</h2>
        <AlbumItem albumArr={albumInfo} />
      </div>
    </div>
  )
}

export default AlbumDetail
