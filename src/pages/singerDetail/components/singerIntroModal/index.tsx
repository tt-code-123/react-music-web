import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Form, Select } from 'antd'

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
      form.setFieldsValue({ aaa: 789 })
      setIsModalVisible(true)
    },
  }))
  introduction = introduction && introduction.replace(/　　/g, '<br/>&nbsp;&nbsp;&nbsp;&nbsp;')
  const [form] = Form.useForm()
  return (
    <Modal
      bodyStyle={{ height: '500px', overflow: 'auto' }}
      okText="确定"
      cancelText="取消"
      title={name}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      onOk={() => setIsModalVisible(false)}>
      <Form form={form}>
        <Form.Item name="aaa">
          <Select
            showSearch
            filterOption={true}
            onSearch={() => console.log('search')}
            onChange={() => {
              console.log('change')
            }}
            options={[
              { label: '12', value: '12' },
              { label: '45', value: '45' },
            ]}></Select>
        </Form.Item>
      </Form>
      <div dangerouslySetInnerHTML={{ __html: introduction }}></div>
    </Modal>
  )
}

export default forwardRef(SingerIntroModal)
