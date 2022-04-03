import React, { useEffect, useRef } from 'react'
import { UpOutlined } from '@ant-design/icons'

import { footerData, footerText, footerTxt } from '@/config'
import styles from './style.module.less'
import { useNavigate } from 'react-router-dom'

const LayoutFooter: React.FC = () => {
  const footerTopBtnRef = useRef(null)
  const footerBtnRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  /**处理页面滚动 */
  const handleScroll = () => {
    var t = document.documentElement.scrollTop
    if (t >= 800) {
      footerTopBtnRef.current && (footerTopBtnRef.current.style.display = 'block')
    } else {
      footerTopBtnRef.current && (footerTopBtnRef.current.style.display = 'none')
    }
    if (t >= 1400) {
      footerTopBtnRef.current && (footerBtnRef.current.style.position = 'absolute')
      footerTopBtnRef.current && (footerBtnRef.current.style.top = '-110px')
      footerTopBtnRef.current && (footerBtnRef.current.style.bottom = '')
    } else if (t < 1400) {
      footerTopBtnRef.current && (footerBtnRef.current.style.position = 'fixed')
      footerTopBtnRef.current && (footerBtnRef.current.style.bottom = '55px')
      footerTopBtnRef.current && (footerBtnRef.current.style.top = '')
    }
  }
  /**回到顶部 */
  const toTop = () => {
    document.documentElement.scrollTop = 0
  }
  /**打开播放页面 */
  const handleOpen = () => {
    // window.open('http://localhost:3000/player', 'player')
    navigate('/player')
  }
  return (
    <div className={styles.footerOuter}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerTop}>
          <div className={styles.footerLeft}>
            {footerData.map((item) => {
              return (
                <dl key={item.title}>
                  <dd>{item.title}</dd>
                  {item.data.map((iten, index) => (
                    <dt key={index}>{iten}</dt>
                  ))}
                </dl>
              )
            })}
          </div>
          <div className={styles.footerRight}>
            <dl>
              <dd>音乐制作人</dd>
              <dt>
                <img src={require('@/assets/img/wechat.jpg')} alt="" />
              </dt>
            </dl>
          </div>
        </div>
        <div className={styles.footerBottom}>
          {footerText.map((item) => (
            <span key={item}>{item}</span>
          ))}
          <p>Copyright © 1998 - 2022 TT. All Rights Reserved.</p>
          {footerTxt.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className={styles.footerBtn} ref={footerBtnRef}>
        <span className={styles.footerTopBtn} ref={footerTopBtnRef} onClick={toTop}>
          <UpOutlined title="回到顶部" />
        </span>
        <div onClick={handleOpen}>
          <span className={styles.footerPlayBtn} title="打开播放器"></span>
        </div>
      </div>
    </div>
  )
}

export default LayoutFooter
