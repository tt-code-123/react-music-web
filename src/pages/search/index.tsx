import React, { ChangeEventHandler, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, message, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import LayoutHeader from '@/components/layoutHeader'
import LayoutFooter from '@/components/layoutFooter'
import { hotSearch } from '@/config'
import { getSearchAll } from '@/api'
import { AlbumInfo, MusicInfo, SingerInfo } from '@/api/type'
import SingerItem from '@/components/singerItem'
import AlbumItem from '@/components/albumItem'
import MusicTable from './components/musicTable'
import InterestedSinger from './components/interestedSinger'
import styles from './style.module.less'

const { TabPane } = Tabs
const Search: React.FC = () => {
  /** 获取路由search参数*/
  const [searchParams, setSearchParams] = useSearchParams()
  /** 维护input的状态*/
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  /** 存储search获得的数据*/
  const [singerList, setSingerList] = useState<SingerInfo[]>([])
  const [albumList, setAlbumList] = useState<AlbumInfo[]>([])
  const [musicList, setMusicList] = useState<MusicInfo[]>([])
  const [albumCount, setAlbumCount] = useState<number>(0)
  const [musicCount, setMusicCount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const navigate = useNavigate()
  useEffect(() => {
    setSearchInputValue(searchParams.get('keywords'))
  }, [searchParams])
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchInputValue(e.target.value)
  }
  useEffect(() => {
    search(searchParams.get('keywords'))
  }, [])

  /** 搜索方法*/
  const search = (inputValue: string, pageNum?: number, pageSize?: number) => {
    /** 搜索接口*/
    getSearchAll(inputValue, pageNum, pageSize).then((res) => {
      if (res.msg) {
        message.error(res.msg)
        navigate('/')
      } else {
        const { albumCount, albumList, singerList, musicCount, musicList, total } = res.data
        setSingerList(singerList)
        setMusicList(musicList)
        setAlbumList(albumList)
        setAlbumCount(albumCount)
        setMusicCount(musicCount)
        setTotal(total)
      }
    })
  }
  /** 处理搜索按钮事件 */
  const handleBtnSearch = (inputValue: string) => {
    setSearchParams({ keywords: inputValue })
  }
  /** 处理热门搜索 */
  const handleHotSearch = (inputValue: string) => {
    setSearchParams({ keywords: inputValue })
    setSearchInputValue(inputValue)
  }

  return (
    <>
      <LayoutHeader />
      <div className={styles.searchHeaderWrapper}>
        <div className={styles.searchInputBox}>
          <input type="text" value={searchInputValue || ''} onChange={handleInputChange} />
          <Button
            size="middle"
            className={styles.searchInputBtn}
            icon={<SearchOutlined />}
            type="primary"
            onClick={() => {
              handleBtnSearch(searchInputValue)
            }}>
            搜索
          </Button>
          <div className={styles.searchHot}>
            热门搜索：
            {hotSearch.map((item) => (
              <span
                onClick={() => {
                  handleHotSearch(item)
                }}
                key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.searchContentWrapper}>
        <div className={styles.searchContentTop}>
          <InterestedSinger singerList={singerList} musicCount={musicCount} albumCount={albumCount} />
        </div>
        <div className={styles.searchContentBottom}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="歌曲" key="1">
              <MusicTable
                total={total}
                musicCount={musicCount}
                musicList={musicList}
                search={search}
                singerList={singerList}
                albumList={albumList}
                searchInputValue={searchInputValue}
              />
            </TabPane>
            <TabPane tab="歌手" key="2">
              <SingerItem singerArr={singerList} />
            </TabPane>
            <TabPane tab="专辑" key="3">
              <AlbumItem albumArr={albumList} />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <LayoutFooter />
    </>
  )
}

export default Search
