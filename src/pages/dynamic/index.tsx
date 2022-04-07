import React, { useState, useEffect } from 'react'

import { getDynamic } from '@/api'
import { DynamicDataType } from '@/api/type'
import DynamicContent from './components/dynamicContent'
import styles from './style.module.less'
import { shallowEqual, useSelector } from 'react-redux'
import { ReducerStates } from '@/redux/reducers'

const Dynamic: React.FC = () => {
  const [dynamic, setDynamic] = useState<DynamicDataType[]>(null)
  const { user } = useSelector(
    (state: ReducerStates) => ({
      user: state.userInfo.user,
    }),
    shallowEqual,
  )
  useEffect(() => {
    getDynamic(user && user._id).then((data) => {
      setDynamic(data.data)
    })
  }, [])
  return (
    <div className={styles.bigBox}>
      <div className={styles.dynamicWrapper}>
        <div className={styles.dynamicBox}>
          <div className={styles.releaseBox}></div>
          <div className={styles.dynamicContent}>
            {dynamic &&
              dynamic.map((item, index) => (
                <DynamicContent
                  data={item}
                  setDynamicItem={(dynamic: DynamicDataType) => {
                    setDynamic((prev) => {
                      const prevState = [...prev]
                      prevState[index] = dynamic
                      return prevState
                    })
                  }}
                  key={item?._id}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dynamic
