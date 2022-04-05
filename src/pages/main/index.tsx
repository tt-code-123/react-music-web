import React, { useEffect, useRef, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CloseOutlined, CustomerServiceOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

import LayoutFooter from '@/components/layoutFooter'
import LayoutHeader from '@/components/layoutHeader'
import { headerData } from '@/config'
import { getSearchSuggest } from '@/api'
import { SeachSuggestResponseType } from '@/api/type'
import styles from './style.module.less'

const Main: React.FC = () => {
  const [history, setHistory] = useState<string[]>([])
  const [searchInfo, setSearchInfo] = useState<SeachSuggestResponseType['data']>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const inputSearchRef = useRef(null)
  const inputDropDownRef = useRef(null)
  useEffect(() => {
    const historyStr = localStorage.getItem('history')
    if (historyStr === JSON.stringify(history)) return
    historyStr && setHistory(JSON.parse(historyStr) as Array<string>)
  }, [JSON.stringify(history)])
  /** 搜索的回调 */
  const handleSearch = () => {
    const { value } = inputSearchRef.current
    if (value) {
      if (!history.includes(value)) {
        history.length == 5 && history.splice(history.length - 1, 1)
        history.unshift(value)
        localStorage.setItem('history', JSON.stringify(history))
      }
      navigate(`/search?keywords=${value}`)
    }
  }
  /** 点击搜索历史的回调 */
  const clickHistory = (value: string) => {
    navigate(`/search?keywords=${value}`)
  }
  /** 清除所有的搜索历史 */
  const clearAllHistory = () => {
    setHistory([])
    localStorage.removeItem('history')
  }
  /** 清除单个的搜索历史 */
  const clearSinHistory = (index, e) => {
    e.stopPropagation()
    const historyArr = [...history]
    historyArr.splice(index, 1)
    setHistory(historyArr)
    localStorage.setItem('history', JSON.stringify(historyArr))
  }
  /** 处理失去焦点的回调 */
  const handleBlur = () => {
    inputDropDownRef.current.style.maxHeight = '0px'
  }
  /** 处理集中焦点的回调 */
  const handleFocus = () => {
    if (inputSearchRef.current.value) {
      handleInput(inputSearchRef.current.value)
    }
    inputDropDownRef.current.style.maxHeight = '1000px'
  }
  const clickLenvo = (value: string) => {
    if (!history.includes(value)) {
      history.length == 5 && history.splice(history.length - 1, 1)
      history.unshift(value)
      localStorage.setItem('history', JSON.stringify(history))
    }
    navigate(`/search?keywords=${value}`)
  }
  const handleInput = debounce((value: string) => {
    if (value) {
      getSearchSuggest(value).then((data) => {
        setSearchInfo(data.data)
      })
    } else {
      setSearchInfo(null)
    }
  }, 500)
  return (
    <>
      <LayoutHeader>
        {headerData.map((item) => (
          <NavLink
            className={styles.headerLink}
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({ color: isActive ? '#fff' : 'black', background: isActive ? '#e91e63' : '' })}>
            {item.label}
          </NavLink>
        ))}
        <div className={styles.headerSearchInput}>
          <div className={styles.inputBox}>
            <input
              placeholder="搜索歌曲、歌手"
              ref={inputSearchRef}
              onInput={() => handleInput(inputSearchRef.current.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
            <div className={styles.inputDropDown} ref={inputDropDownRef}>
              <ul>
                <li>
                  {searchInfo ? (
                    <div className={styles.lenvoBox}>
                      {searchInfo.music.length ? (
                        <>
                          <p>
                            <CustomerServiceOutlined />
                            歌曲
                          </p>
                          {searchInfo.music.map((item) => {
                            return (
                              <div onClick={() => clickLenvo(item.music_name)} key={item._id}>
                                {item.music_name}
                              </div>
                            )
                          })}
                        </>
                      ) : null}
                      {searchInfo.singer.length ? (
                        <>
                          <p>
                            <UserOutlined />
                            歌手
                          </p>
                          {searchInfo.singer.map((item) => {
                            return (
                              <div onClick={() => clickLenvo(item.singer_name)} key={item._id}>
                                {item.singer_name}
                              </div>
                            )
                          })}
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </li>
                <li>
                  {history.length ? (
                    <div className={styles.historyBox}>
                      <p>
                        <span>搜索历史</span>
                        <span onClick={() => clearAllHistory()}>清空</span>
                      </p>
                      {history.map((item, index) => (
                        <div key={item}>
                          <p onClick={() => clickHistory(item)}>
                            {item}
                            <CloseOutlined onClick={(e) => clearSinHistory(index, e)} />
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </li>
              </ul>
            </div>
          </div>
          <span className={styles.headerIcon} onClick={handleSearch}>
            <SearchOutlined />
          </span>
        </div>
      </LayoutHeader>
      {location.pathname === '/t' ? <Navigate to="/t/home" /> : <Outlet />}
      <LayoutFooter />
    </>
  )
}

export default Main
