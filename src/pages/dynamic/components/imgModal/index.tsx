import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'

import { BASE_URL } from '@/config'

interface IPros {}

interface RefProps {}

const ImgModal: React.ForwardRefRenderFunction<RefProps, IPros> = ({}, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [file, setFile] = useState<string>('')
  useImperativeHandle(ref, () => ({
    open: (url: string) => {
      setFile(url)
      setIsModalVisible(true)
    },
  }))
  return (
    <Modal cancelText="取消" okText="确定" visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
      <img src={`${BASE_URL}/${file}`} alt="" />
    </Modal>
  )
}

export default forwardRef(ImgModal)
