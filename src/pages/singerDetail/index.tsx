import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getAlbumBySingerId, getMusicBySingerId, getSingerById } from '@/api'
import { AlbumInfo, MusicInfo, SingerType } from '@/api/type'
import { BASE_URL } from '@/config'
import SingerIntroModal, { IPref } from './components/singerIntroModal'
import SingerDetailLayout from './components/singerDetailLayout'
import SingerMusicTable from './components/singerMusicTable/intdex'
import AlbumItem from '@/components/albumItem'
import styles from './style.module.less'
import { Pagination } from 'antd'

const SingerDetail: React.FC = () => {
  const [singerInfo, setSingerInfo] = useState<SingerType>()
  const [musicInfo, setMusicInfo] = useState<MusicInfo[]>()
  const [musicCount, setMusicCount] = useState<number>()
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo[]>([])
  const [albumCount, setAlbumCount] = useState<number>()
  const [current, setCurrent] = useState<number>(1)
  const singerIntroRef = useRef<IPref>(null)
  const params = useParams()
  useEffect(() => {
    /** 根据歌手id获取歌手信息 */
    getSingerById(params._id).then((singer) => {
      setSingerInfo(singer.data)
    })
    getMusicInfoBySingerId(params._id)
    getAlbumInfoBySingerId(params._id)
  }, [params._id])

  /** 根据歌手id获取歌曲信息 */
  const getMusicInfoBySingerId = (_id: string, pageNum: number = 1, pageSize: number = 10) => {
    getMusicBySingerId(_id, pageNum, pageSize).then((music) => {
      setMusicCount(music.data.musicCount)
      setMusicInfo(music.data.musicInfo)
    })
  }

  /** 根据歌手id获取专辑信息 */
  const getAlbumInfoBySingerId = (_id: string, pageNum: number = 1, pageSize: number = 5) => {
    getAlbumBySingerId(_id, pageNum, pageSize).then((album) => {
      setAlbumInfo(album.data.albumInfo)
      setAlbumCount(album.data.albumCount)
    })
  }
  const handlePageClick = (page: number, pageSize: number) => {
    setCurrent(page)
    getAlbumInfoBySingerId(params._id, page, pageSize)
  }

  return (
    <div className={styles.singerDetailWrapper}>
      <div className={styles.singerDetailHeader}>
        <div className={styles.singerDetailBg} style={{ backgroundImage: singerInfo && `url(${BASE_URL}/${singerInfo.singer_img})` }}></div>
        <div style={{ height: '50px' }}></div>
        <div className={styles.singerInfo}>
          <div className={styles.singerAvatart}>
            <img src={singerInfo && `${BASE_URL}/${singerInfo.singer_img}`} alt="" />
          </div>
          <div className={styles.singerName}>
            <h2>{singerInfo && singerInfo.singer_name}</h2>
          </div>
          <div className={styles.singerIntro}>
            <p>{singerInfo && singerInfo.singer_introduction}</p>
            <p onClick={() => singerIntroRef.current.open()}>查看更多</p>
          </div>
        </div>
      </div>
      <div className={styles.hotSong}>
        <SingerDetailLayout title="热门单曲" total={`全部${musicCount}首`}>
          <SingerMusicTable musicInfo={musicInfo && musicInfo} getMusicInfoBySingerId={getMusicInfoBySingerId} musicCount={musicCount} />
        </SingerDetailLayout>
      </div>
      <div className={styles.hotAlbum}>
        <SingerDetailLayout title="热门专辑" total={`全部${albumCount}张`}>
          <AlbumItem albumArr={albumInfo && albumInfo} />
          <Pagination className={styles.pagination} current={current} total={albumCount} defaultPageSize={5} onChange={handlePageClick} />
        </SingerDetailLayout>
      </div>
      <SingerIntroModal
        ref={singerIntroRef}
        introduction={singerInfo && singerInfo.singer_introduction}
        name={singerInfo && singerInfo.singer_name}
      />
    </div>
  )
}

export default SingerDetail
