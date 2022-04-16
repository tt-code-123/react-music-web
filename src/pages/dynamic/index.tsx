import React, { useState, useEffect } from 'react'
import { Button, Input } from 'antd'
import { shallowEqual, useSelector } from 'react-redux'
import { UploadFile } from 'antd/lib/upload/interface'
import dayjs from 'dayjs'

import { getDynamic, releaseDynamic } from '@/api'
import { DynamicDataType } from '@/api/type'
import DynamicContent from './components/dynamicContent'
import { ReducerStates } from '@/redux/reducers'
import ImgUpload from '@/components/imgUpload'
import styles from './style.module.less'

const { TextArea } = Input
const Dynamic: React.FC = () => {
  const [dynamic, setDynamic] = useState<DynamicDataType[]>(null)
  const [inutValue, setInputValue] = useState<string>('')
  const [files, setFiles] = useState<UploadFile[]>([])
  const [fileRes, setFileRes] = useState<string[]>([])
  const { user } = useSelector(
    (state: ReducerStates) => ({
      user: state.userInfo.user,
    }),
    shallowEqual,
  )
  /** 上传图片的onChange */
  const handleUploadChange = (e) => {
    if (e.file.status === 'done') {
      const fileArr = []
      for (let i = 0; i < e.fileList.length; i++) {
        fileArr.push(e.fileList[i].response.data[0])
      }
      setFileRes(fileArr)
    }
    setFiles(e.fileList)
  }
  /** 发布动态的回调 */
  const handleRelease = () => {
    const time = dayjs().format('YYYY-MM-DD hh:mm')
    releaseDynamic(inutValue, user && user._id, fileRes, time).then((res) => {
      setInputValue('')
      setFileRes([])
      setFiles([])
      setDynamic((preState) => {
        const newState = [...preState]
        newState.unshift(res.data)
        return newState
      })
    })
  }
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
            <TextArea
              value={inutValue}
              onChange={(e) => setInputValue(e.target.value)}
              allowClear
              autoSize
              bordered={false}
              placeholder="这一刻的想法..."
            />
            <div className={styles.uploadBox}>
              <ImgUpload multiple value={files} onChange={(e) => handleUploadChange(e)} />
            </div>
            <Button className={styles.published} type="primary" onClick={handleRelease}>
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
