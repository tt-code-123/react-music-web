import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

import { saveUserInfoAction } from '@/redux/action-creaters'
import { login, register } from '@/api'
import { ReducerStates } from '@/redux/reducers'
import styles from './style.module.less'
interface IProps {
  tag: 'login' | 'registered'
}
interface ResponseType {
  status: number
  data: any
  token?: string
  msg?: string
}

const FormItem = Form.Item
const UserForm: React.FC<IProps> = ({ tag }) => {
  const isLogin = useSelector((state: ReducerStates) => state.userInfo.isLogin, shallowEqual)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /** 点击登录/注册按钮的回调 */
  const onFinish = async (formValue) => {
    const { username, password } = formValue
    let result: ResponseType
    if (tag === 'login') {
      result = await login(username, password)
      if (result.status === 1) {
        dispatch(saveUserInfoAction({ user: { ...result.data }, token: result.token, isLogin: true }))
        navigate('/t/home')
      } else {
        message.error(result.msg, 1)
      }
    } else if (tag === 'registered') {
      result = await register(username, password)
      if (result.status === 1) {
        message.success('注册成功', 1)
        navigate('/login')
      } else {
        message.error(result.msg, 1)
      }
    }
  }
  const tologOrReg = () => {
    tag === 'login' ? navigate('/registered') : navigate('/login')
  }
  return isLogin ? (
    <Navigate to="/t/home" />
  ) : (
    <div className={styles['login']}>
      {/* 背景 */}
      <div className={styles['login-bg']}>
        <div className={styles['bg-item'] + ' ' + styles['bg1']}></div>
        <div className={styles['bg-item'] + ' ' + styles['bg2']}></div>
        <div className={styles['bg-item'] + ' ' + styles['bg3']}></div>
      </div>
      <i className={styles['login-line']}></i>
      <i className={styles['login-dot']}></i>
      <header className={styles['login-header']}>音为有你，闪耀从这里开始！！！</header>
      {/* 登录表单 */}
      <div className={styles['login-form']}>
        <Form onFinish={onFinish} className={styles.form}>
          <FormItem key="username" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined style={{ color: '#aaa' }} className="site-form-item-icon" />} placeholder="用户名" />
          </FormItem>
          <FormItem key="password" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#aaa' }} className="site-form-item-icon" />} placeholder="密码" />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" block>
              {tag === 'login' ? '登录' : '注册'}
            </Button>
            <Button type="link" block style={{ textAlign: 'right' }} onClick={tologOrReg}>
              {tag === 'login' ? '去注册' : '去登录'}
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

export default UserForm
