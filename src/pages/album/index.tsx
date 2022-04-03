import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'

import { getAlbumBannerUrl, getRecommendAlbum } from '@/api'
import { BASE_URL } from '@/config'
import styles from './style.module.less'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import AlbumItem from '@/components/albumItem'
import { RecommendAlbum } from '@/api/type'
import { Pagination } from 'antd'

const Album: React.FC = () => {
  const [banner, setBanner] = useState<string[]>([])
  const [isShowArrow, setIsShowArrow] = useState<boolean>(false)
  const [albumInfoArr, setAlbumInfoArr] = useState<RecommendAlbum['data']['albumArr']>([])
  const [current, setCurrent] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>()
  const sliderRef = useRef(null)
  useEffect(() => {
    getAlbumBannerUrl().then((data) => {
      setBanner(data.data)
    })
  }, [])
  useEffect(() => {
    getRecommendAlbum(current, 15).then((data) => {
      setAlbumInfoArr(data.data.albumArr)
      setTotalCount(data.data.totalCount)
    })
  }, [current])
  /** 处理鼠标移入的回调 */
  const handleMouseEnter = () => {
    setIsShowArrow(true)
  }
  /** 处理鼠标移出的回调 */
  const handleMouseLeave = () => {
    setIsShowArrow(false)
  }
  /** 处理点击箭头的回调 */
  const handleArrowClick = (tag: 'prev' | 'next') => {
    if (tag === 'prev') {
      sliderRef.current.slickPrev()
    } else {
      sliderRef.current.slickNext()
    }
  }
  /** 处理点击分页的回调 */
  const handlePageClick = (page: number, pageSize: number) => {
    setCurrent(page)
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.bannerBox} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Slider autoplay dots infinite slidesToShow={2.3} speed={500} ref={sliderRef}>
          {banner.map((item) => (
            <div key={item} className={styles.bannerImgBox}>
              <img src={`${BASE_URL}/${item}`} alt="" className={styles.bannerImg} />
            </div>
          ))}
        </Slider>
        <LeftOutlined className={styles.homeLeftArrow} style={{ opacity: isShowArrow ? 1 : 0 }} onClick={() => handleArrowClick('prev')} />
        <RightOutlined
          className={styles.homeRightArrow}
          style={{ opacity: isShowArrow ? 1 : 0 }}
          onClick={() => handleArrowClick('next')}
        />
      </div>
      <div className={styles.bannerContent}>
        <AlbumItem albumArr={albumInfoArr} />
        <Pagination className={styles.pagination} current={current} total={totalCount} onChange={handlePageClick} />
      </div>
    </div>
  )
}

export default Album
