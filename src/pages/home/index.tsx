import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Carousel } from 'antd'

import { getBannerUrl, getRecommendAlbum, getRecommendPlaylist, getTageUrl, getRecommendSinger } from '@/api'
import { BASE_URL } from '@/config'
import LayoutTitle from '@/components/layoutTitle'
import PlaylistItem from '@/components/playlistItem'
import { AlbumInfo, RecommendPlaylist, SingerType } from '@/api/type'
import SingerItem from '@/components/singerItem'
import AlbumItem from '@/components/albumItem'
import styles from './style.module.less'

const Home: React.FC = () => {
  /** 轮播图图片url */
  const [bannerArray, setBannerArray] = useState<string[]>([])
  /** tage图片url */
  const [tageArray, setTageArray] = useState<string[]>([])
  /** 是否显示轮播图按钮 */
  const [isShowArrow, setIsShowArrow] = useState<boolean>(false)
  /** 轮播图当前图片索引 */
  const [currentIndex, setCurrentIndex] = useState(0)
  /** 推荐歌单 */
  const [recommendPlaylist, setRecommendPlaylist] = useState<RecommendPlaylist[]>([])
  /** 推荐专辑 */
  const [recommednAlbum, setRecommendAlbum] = useState<AlbumInfo[]>([])
  /** 推荐歌手*/
  const [recommendSinger, setRecommendSinger] = useState<SingerType[]>([])
  const carouselRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    /** 获取轮播图图片url */
    getBannerUrl().then((res) => {
      if (res.status) {
        setBannerArray(res.data)
      }
    })
    /** 获取tages图片url */
    getTageUrl().then((res) => {
      if (res.status) {
        setTageArray(res.data)
      }
    })
    /** 获取推荐歌单 */
    getRecommendPlaylist().then((res) => {
      if (res.status) {
        setRecommendPlaylist(res.data.playlist)
      }
    })
    /** 获取推荐专辑 */
    getRecommendAlbum().then((res) => {
      if (res.status) {
        setRecommendAlbum(res.data.albumArr)
      }
    })
    /** 获取推荐歌手*/
    getRecommendSinger().then((res) => {
      if (res.status) {
        setRecommendSinger(res.data)
      }
    })
  }, [])

  const musicPeopl = useMemo(() => {
    return (
      <LayoutTitle
        title="音乐人"
        toMore={() => {
          navigate('/t/singer')
        }}>
        <SingerItem singerArr={recommendSinger} />
      </LayoutTitle>
    )
  }, [recommendSinger])

  const albumRecommend = useMemo(() => {
    return (
      <LayoutTitle
        title="专辑推荐"
        toMore={() => {
          navigate('/t/album')
        }}>
        <AlbumItem albumArr={recommednAlbum} />
      </LayoutTitle>
    )
  }, [recommednAlbum])

  const albumList = useMemo(() => {
    return (
      <LayoutTitle
        title="歌单推荐"
        toMore={() => {
          navigate('/t/playlist')
        }}>
        <PlaylistItem playlistArr={recommendPlaylist} />
      </LayoutTitle>
    )
  }, [recommendPlaylist])
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
      carouselRef.current.prev()
    } else {
      carouselRef.current.next()
    }
  }
  const handleBannerChange = useCallback((from, to) => {
    setCurrentIndex(to)
  }, [])
  const bgImage = bannerArray[currentIndex]
  return (
    <div className={styles.homeWrapper}>
      {/* 轮播图 */}
      <div
        style={{ backgroundImage: bgImage ? `url(${BASE_URL}/${bgImage})` : '' }}
        className={styles.homeBannerWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <Carousel
          className={styles.homeBanner}
          ref={carouselRef}
          effect="fade"
          beforeChange={handleBannerChange}
          autoplay
          dots={{ className: styles.homeDot }}>
          {bannerArray.map((item) => (
            <img key={item} src={`${BASE_URL}/${item}`} alt="图片不存在" />
          ))}
        </Carousel>
        <LeftOutlined className={styles.homeLeftArrow} style={{ opacity: isShowArrow ? 1 : 0 }} onClick={() => handleArrowClick('prev')} />
        <RightOutlined
          className={styles.homeRightArrow}
          style={{ opacity: isShowArrow ? 1 : 0 }}
          onClick={() => handleArrowClick('next')}
        />
      </div>
      {/* tag */}
      <div className={styles.homeTages}>
        {tageArray.map((item, index) => {
          return (
            <div key={index}>
              <img src={`${BASE_URL}/${item}`} alt="图片不存在" />
            </div>
          )
        })}
      </div>

      {/* 歌单推荐 */}
      {albumList}

      {/* 专辑推荐 */}
      {albumRecommend}

      {/* 音乐人 */}
      {musicPeopl}
    </div>
  )
}

export default Home
