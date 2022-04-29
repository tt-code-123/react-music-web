import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { BASE_URL } from '@/config'
import { AlbumInfo } from '@/api/type'
import { getMusicById, getMusicIdByAlbumId } from '@/api'
import styles from './style.module.less'
import { useDispatch } from 'react-redux'
import { saveDefaultPlaylistAction, savePlayCurrentMusicInfo } from '@/redux/action-creaters'

interface IProps {
  albumArr: AlbumInfo[]
}
const AlbumItem: React.FC<IProps> = ({ albumArr }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handlePlayAlbum = (albumId: string) => {
    getMusicIdByAlbumId(albumId).then((data) => {
      getMusicById(data.data[0]).then((item) => {
        dispatch(saveDefaultPlaylistAction(data.data))
        dispatch(savePlayCurrentMusicInfo(item.data as any))
        navigate('/player')
      })
    })
  }
  return (
    <div className={styles.homeAlbum}>
      {albumArr && albumArr.length > 0
        ? albumArr.map((item) => {
            return (
              <div className={styles.albumItemWrapper} key={item._id}>
                <div
                  className={styles.albumItemBox}
                  onClick={() => {
                    handlePlayAlbum(item._id)
                  }}>
                  <img className={styles.albumItemImg} src={`${BASE_URL}/${item.album_img}`} alt={item.album_name} />
                  <span>{item.release_time}</span>
                  <img className={styles.albumItemPlayCover} src={require('@/assets/img/cover_play_b.png')} alt="播放" />
                </div>
                <i className={styles.albumItemCover}></i>
                <p className={styles.album}>
                  <span onClick={() => navigate(`/t/album/${item._id}`)}>{item.album_name}</span>
                </p>
                <p className={styles.singer}>
                  <span onClick={() => navigate(`/t/singer/${item.singer_id}`)}>{item.singer_name}</span>
                </p>
              </div>
            )
          })
        : null}
    </div>
  )
}

export default AlbumItem
