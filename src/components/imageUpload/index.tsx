import React, { useState } from 'react'
import { Upload, Modal, message, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.less'

interface IProps {
  maxLength?: number
  value?: any
  _id?: string
  onChange?: (obj: any) => void
}

const imgTempObj = {
  uid: '-1',
  name: 'image.png',
  size: 2048,
  type: 'image/png',
  status: 'done',
}
const ImgUpload: React.FC<IProps> = (props) => {
  const { value, onChange, maxLength = 1, _id } = props
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
    <Button type="dashed" icon={<PlusOutlined />} block>
      上传图片
    </Button>
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
  const imgList = value && value.length > 0 ? value.map((v, i) => ({ ...imgTempObj, uid: i, ...v })) : []

  const imgListChange = (e) => {
    if (onChange) {
      onChange(
        e.fileList.map((v) => {
          return v.status === 'done'
            ? {
                fileId: v?.response?.fileId ? v?.response?.fileId : v.id,
                fileUrl: v?.response?.fileUrl ? v?.response?.fileUrl : v.url,
                filename: v?.response?.filename ? v?.response?.filename : v.name,
                url: v?.response?.fileUrl,
                status: 'done',
              }
            : v
        }),
      )
    }
  }
  return (
    <>
      <Upload
        action="http://localhost:8081/user/upload/avatar"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        beforeUpload={beforeUpload}
        listType="picture"
        fileList={imgList}
        data={{ _id }}
        onPreview={handlePreview}
        className={style.imgList}
        maxCount={maxLength}
        onChange={imgListChange}>
        {imgList.length >= maxLength ? null : uploadButton}
      </Upload>
      <Modal maskClosable={false} visible={previewVisible} footer={null} onCancel={handleCancel} destroyOnClose>
        <img alt="example" className={style.img} src={previewImage} />
      </Modal>
    </>
  )
}

export default ImgUpload
