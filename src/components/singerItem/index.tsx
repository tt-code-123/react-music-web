import React from 'react'

import { SingerInfo } from '@/api/type'
import { BASE_URL } from '@/config'
import styles from './style.module.less'
import { useNavigate } from 'react-router-dom'

interface IProps {
  singerArr: SingerInfo[]
}

const SingerItem: React.FC<IProps> = ({ singerArr }) => {
  const navigate = useNavigate()
  return (
    <div className={styles.homeSingerWrapper}>
      {singerArr.length > 0
        ? singerArr.map((item) => {
            return (
              <div key={item._id} className={styles.homeSingerBox}>
                <div className={styles.homeSingerImgBox}>
                  <img onClick={() => navigate(`/t/singer/${item._id}`)} src={`${BASE_URL}/${item.singer_img}`} alt={item.singer_name} />
                </div>
                <p>
                  <span onClick={() => navigate(`/t/singer/${item._id}`)}>{item.singer_name}</span>
                </p>
              </div>
            )
          })
        : null}
    </div>
  )
}

export default SingerItem
