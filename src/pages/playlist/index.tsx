import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { CustomerServiceFilled } from '@ant-design/icons'
import { Pagination } from 'antd'

import { BASE_URL, playlistBox } from '@/config'
import { formateNum } from '@/utils'
import { getRecommendPlaylist } from '@/api'
import { RecommendPlaylist } from '@/api/type'
import styles from './style.module.less'

const PlayList: React.FC = () => {
  const [current, setCurrent] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>()
  const [recommendPlaylist, setRecommendPlaylist] = useState<RecommendPlaylist[]>([])
  useEffect(() => {
    getRecommendPlaylist(current, 15).then((res) => {
      if (res.status) {
        setRecommendPlaylist(res.data.playlist)
        setTotalCount(res.data.todoCount)
      }
    })
  }, [current])
  const handlePageClick = (page: number, pageSize: number) => {
    setCurrent(page)
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.bannerWrapper}>
        <div className={styles.bannerBox}>
          <Slider speed={500} slidesToShow={6} slidesToScroll={1} infinite={false}>
            {playlistBox.map((item) => (
              <div key={item.title} className={styles.item}>
                <div>
                  <img src={item.img} alt="" />
                  <p>{item.title}</p>
                  <span>{formateNum(item.playCount)}</span>
                  <div className={styles.overLay}></div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.contentHeader}>推荐</div>
        <div>
          <div className={styles.contentBox}>
            {recommendPlaylist.map((item) => {
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
            })}
          </div>

          <Pagination
            className={styles.pagination}
            current={current}
            showSizeChanger={false}
            pageSize={15}
            total={totalCount}
            onChange={handlePageClick}
          />
        </div>
      </div>
    </div>
  )
}

export default PlayList
