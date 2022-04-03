import React from 'react'
import { SingerInfo } from '@/api/type'

import { BASE_URL } from '@/config'
import styles from './style.module.less'

interface IProps {
  singerList: SingerInfo[]
  musicCount: number
  albumCount: number
}

const InterestedSinger: React.FC<IProps> = ({ singerList, musicCount, albumCount }) => {
  return (
    <>
      <p>你可能感兴趣</p>
      <div className={styles.searchContentBox}>
        <div className={styles.searchAvatarBox}>
          <img src={singerList && singerList.length ? `${BASE_URL}/${singerList[0].singer_img}` : ''} alt="" />
        </div>
        <div className={styles.searchInfoBox}>
          <h2>{singerList && singerList.length ? singerList[0].singer_name : ''}</h2>
          歌曲：<span>{musicCount}</span>
          专辑：<span>{albumCount}</span>
        </div>
      </div>
    </>
  )
}

export default InterestedSinger
