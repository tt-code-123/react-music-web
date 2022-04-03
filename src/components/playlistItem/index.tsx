import React from 'react'

import { BASE_URL } from '@/config'
import { formateNum } from '@/utils'
import { CustomerServiceFilled } from '@ant-design/icons'
import { RecommendPlaylist } from '@/api/type'
import styles from './style.module.less'

interface IProps {
  playlistArr: RecommendPlaylist[]
}

const PlaylistItem: React.FC<IProps> = ({ playlistArr }) => {
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
                    <img className={styles.coverPlay} src={require('@/assets/img/cover_play_w.png')} alt="cover" />
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
