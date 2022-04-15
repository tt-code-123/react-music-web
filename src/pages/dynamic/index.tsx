import React, { useState, useEffect } from 'react'

import { getDynamic } from '@/api'
import { DynamicDataType } from '@/api/type'
import DynamicContent from './components/dynamicContent'
import { Button, Input } from 'antd'

import { shallowEqual, useSelector } from 'react-redux'
import { ReducerStates } from '@/redux/reducers'
import ImgUpload from '@/components/imgUpload'
import styles from './style.module.less'

const { TextArea } = Input
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
          <div className={styles.releaseBox}>
            <TextArea allowClear autoSize bordered={false} placeholder="这一刻的想法..." />
            <ImgUpload />
            <Button className={styles.published} type="primary">
              发表
            </Button>
          </div>
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
