import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'

interface IProps {
  introduction: string
  name: string
}
export interface IPref {
  open: () => void
}
const SingerIntroModal: React.ForwardRefRenderFunction<IPref, IProps> = ({ introduction, name }, ref) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsModalVisible(true)
    },
  }))
  introduction = introduction && introduction.replace(/　　/g, '<br/>&nbsp;&nbsp;&nbsp;&nbsp;')
  return (
    <Modal
      bodyStyle={{ height: '500px', overflow: 'auto' }}
      okText="确定"
      cancelText="取消"
      title={name}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={() => setIsModalVisible(false)}>
      <div dangerouslySetInnerHTML={{ __html: introduction }}></div>
    </Modal>
  )
}

export default forwardRef(SingerIntroModal)
