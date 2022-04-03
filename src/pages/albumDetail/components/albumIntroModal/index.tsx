import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'

interface IProps {
  intro: string
  name: string
}
export interface IRef {
  open: () => void
}

const AlbumIntroModal: React.ForwardRefRenderFunction<IRef, IProps> = ({ intro, name }, ref) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsModalVisible(true)
    },
  }))
  intro = intro && intro.replace(/\\n/g, '<br/>')
  return (
    <Modal
      bodyStyle={{ height: '500px', overflow: 'auto' }}
      okText="确定"
      cancelText="取消"
      title={name}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={() => setIsModalVisible(false)}>
      <div dangerouslySetInnerHTML={{ __html: intro }}></div>
    </Modal>
  )
}

export default forwardRef(AlbumIntroModal)
