import React, { useState } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { BASE_URL } from '@/config'

interface IProps {
  maxLength?: number
  value?: any
  multiple?: boolean
  showUploadList?: boolean
  onChange?: (obj: any) => void
}

const AvatarUpload: React.FC<IProps> = (props) => {
  const { value, onChange, maxLength = 6, showUploadList = true, multiple = false } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  /**
   * 取消预览图片
   */
  function handleCancel() {
    setPreviewVisible(false)
  }
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }
  /**
   * 预览图片
   */
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div>上传图片</div>
    </div>
  )

  /**
   * 上传前验证
   */
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 文件!')
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('图片不得大于5MB!')
    }
    return isLt5M && isJpgOrPng
  }
  const imgListChange = (e) => {
    onChange && onChange(e)
  }

  return (
    <>
      <Upload
        name="images"
        action={`${BASE_URL}/dynamic/file`}
        accept="image/png, image/jpeg, image/gif, image/jpg"
        beforeUpload={beforeUpload}
        listType="picture-card"
        fileList={value}
        multiple={multiple}
        showUploadList={showUploadList}
        headers={{ authorization: localStorage.getItem('token') }}
        onPreview={handlePreview}
        maxCount={maxLength}
        onChange={imgListChange}>
        {value?.length >= maxLength ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel} destroyOnClose>
        <img alt="example" src={previewImage} />
      </Modal>
    </>
  )
}

export default AvatarUpload
