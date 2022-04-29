import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CustomerServiceFilled } from '@ant-design/icons'

import { BASE_URL } from '@/config'
import { formateNum } from '@/utils'
import { RecommendPlaylist } from '@/api/type'
import { getMusicById } from '@/api'
import { saveDefaultPlaylistAction, savePlayCurrentMusicInfo } from '@/redux/action-creaters'
import styles from './style.module.less'

interface IProps {
  playlistArr: RecommendPlaylist[]
}

const PlaylistItem: React.FC<IProps> = ({ playlistArr }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  /** 点击歌单播放按钮的回调 */
  const handleClickPlayCover = (sid: string, url: string[]) => {
    getMusicById(sid).then((data) => {
      dispatch(savePlayCurrentMusicInfo(data.data as any))
      dispatch(saveDefaultPlaylistAction(url))
      navigate('/player')
    })
  }
  return (
    <div className={styles.homeRecommend}>
      <div className={styles.homeJay}></div>
      <div className={styles.homeRecommednPlaylist}>
        {playlistArr.length > 0
          ? playlistArr.map((item) => {
              return (
                <div className={styles.box} key={item._id}>
                  <div className={styles.bgBox}>
                    <img className={styles.bgPlay} src={`${BASE_URL}/${item.playlist_img}`} alt={item.playlist_name} />
                    <span>
                      <CustomerServiceFilled />
                      {formateNum(Number(item.playlist_amount))}
                    </span>
                    <img
                      onClick={() => handleClickPlayCover(item.playlist_url[0], item.playlist_url)}
                      className={styles.coverPlay}
                      src={require('@/assets/img/cover_play_w.png')}
                      alt="cover"
                    />
                    <div className={styles.damaskeen}></div>
                  </div>
                  <p>{item.playlist_name}</p>
                </div>
              )
            })
          : null}
      </div>
    </div>
  )
}

export default PlaylistItem
