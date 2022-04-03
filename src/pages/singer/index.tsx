import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd'

import { getSingerByOther } from '@/api'
import { SingerAllType } from '@/api/type'
import SingerItem from '@/components/singerItem'
import styles from './style.module.less'

const languageArr = ['华语', '欧美']
const genderArr = ['男', '女']
const letterArr = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

const Singer: React.FC = () => {
  const [language, setLanguage] = useState<string>('华语')
  const [gender, setGender] = useState<string>('男')
  const [initial, setInitial] = useState<string>('A')
  const [current, setCurrent] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>()
  const [singerInfo, setSingerInfo] = useState<SingerAllType['data']['singerArr']>([])
  useEffect(() => {
    getSingerByOther(initial, language, gender, current).then((data) => {
      setSingerInfo(data.data.singerArr)
      setTotalCount(data.data.totalCount)
    })
  }, [language, gender, initial, current])

  const handlePageClick = (page: number, pageSize: number) => {
    setCurrent(page)
  }
  return (
    <div className={styles.singerBox}>
      <div className={styles.singerHeader}>
        <div className={styles.singerLanguage}>
          {genderArr.map((item) => (
            <span
              key={item}
              onClick={() => {
                setGender(item)
              }}
              className={gender === item ? styles.active : ''}>
              {item}
            </span>
          ))}
        </div>
        <div className={styles.singerGender}>
          {languageArr.map((item) => (
            <span
              key={item}
              onClick={() => {
                setLanguage(item)
              }}
              className={language === item ? styles.active : ''}>
              {item}
            </span>
          ))}
        </div>
        <div className={styles.singerInitial}>
          {letterArr.map((item) => (
            <span
              key={item}
              onClick={() => {
                setInitial(item)
              }}
              className={initial === item ? styles.active : ''}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.singerContent}>
        {singerInfo.length ? (
          <SingerItem singerArr={singerInfo} />
        ) : (
          <div className={styles.emptySinger}>
            <span>该分类下暂无歌手信息</span>
          </div>
        )}
        {singerInfo.length ? (
          <Pagination className={styles.pagination} current={current} total={totalCount} defaultPageSize={12} onChange={handlePageClick} />
        ) : null}
      </div>
    </div>
  )
}

export default Singer
