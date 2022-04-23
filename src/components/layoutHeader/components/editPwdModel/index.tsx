import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Form, Input, message, Modal } from 'antd'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { confirmOldPwd, updatePwd } from '@/api'
import { ReducerStates } from '@/redux/reducers'
import { deleteUserInfoAction } from '@/redux/action-creaters'
import { useNavigate } from 'react-router-dom'

interface IProps {}
interface IRef {
  open: () => void
}
const FormItem = Form.Item

const EditPwdModel: React.ForwardRefRenderFunction<IRef, IProps> = ({}, ref) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsModalVisible(true)
    },
  }))
  const { user } = useSelector(
    (state: ReducerStates) => ({
      user: state.userInfo.user,
    }),
    shallowEqual,
  )
  /**确认修改的回调 */
  const handleEdit = () => {
    form.validateFields().then((value) => {
      updatePwd(value.newPwd, user && user._id).then((data) => {
        if (data) {
          setIsModalVisible(false)
          dispatch(deleteUserInfoAction())
          Modal.confirm({
            okText: '确认',
            cancelText: '取消',
            content: '是否跳转到登陆界面',
            onCancel: () => {
              return Promise.resolve()
            },
            onOk: () => {
              navigate('/login')
            },
          })
        }
      })
    })
  }
  return (
    <Modal
      visible={isModalVisible}
      destroyOnClose
      maskClosable={false}
      okText="确认修改"
      cancelText="取消"
      onOk={handleEdit}
      onCancel={() => setIsModalVisible(false)}>
      <Form form={form} preserve={false} style={{ marginTop: 20 }}>
        <FormItem
          name="oldPwd"
          label="原密码"
          validateTrigger={['onBlur', 'onChange']}
          rules={[
            { required: true, message: '请输入原密码', validateTrigger: 'onChange' },
            {
              validator: async (_, value) => {
                if (!value) {
                  return Promise.resolve()
                }
                const data = await confirmOldPwd(value, user && user._id)
                if (data.data) {
                  return Promise.resolve()
                } else {
                  return Promise.reject(new Error('原密码不正确'))
                }
              },
              validateTrigger: 'onBlur',
            },
          ]}>
          <Input type="password" placeholder="请输入原密码" />
        </FormItem>
        <FormItem name="newPwd" label="新密码" rules={[{ required: true, message: '请输入新密码' }]}>
          <Input type="password" placeholder="请输入新密码" />
        </FormItem>
        <FormItem
          dependencies={['newPwd']}
          name="againPwd"
          label="确认密码"
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPwd') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('密码不一致'))
              },
            }),
          ]}>
          <Input type="password" placeholder="请确认新密码" />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default forwardRef(EditPwdModel)
