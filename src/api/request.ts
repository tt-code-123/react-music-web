import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import NProgress from 'nprogress'
import store from '@/redux'
import { deleteUserInfoAction } from '@/redux/action-creaters/login-action'
import 'nprogress/nprogress.css'
import { ResponseType } from './type'


const instance:AxiosInstance = axios.create({
  timeout:4000
})

// 请求拦截器
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  NProgress.start()
  // 从redux中获取之前保存的token
  const { token } = store.getState().userInfo
  // 向请求头中添加token用于校验身份
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ResponseType,any>) => {
    NProgress.done()
    return response.data
  },
  (error) => {
    // 进度条结束
    NProgress.done()
    if (error.response.status === 401) {
      message.error('身份校验失败,请重新登录', 1)
      // 分发一个删除用户信息的action
      store.dispatch(deleteUserInfoAction())
    } else {
      message.error(error.message, 1)
    }
    return new Promise(() => {})
  },
)

export default instance
