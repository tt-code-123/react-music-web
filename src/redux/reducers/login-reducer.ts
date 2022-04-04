import { SAVE_USER_INFO, DELETE_USER_INFO, UPDATE_USER_INFO } from '../action-types'
import { LoginStateType } from '../type'

/** Action类型定义 */
interface ActionType {
  data: LoginStateType | null
  type: string
}
const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')
const initState: LoginStateType = {
  user: user || '',
  token: token || '',
  isLogin: user && token ? true : false,
}
export default function (preState = initState, action: ActionType) {
  const { data, type } = action
  let newState: LoginStateType
  switch (type) {
    case SAVE_USER_INFO:
      newState = { user: data.user, token: data.token, isLogin: true }
      return newState
    case DELETE_USER_INFO:
      newState = { user: '', token: '', isLogin: false }
      return newState
    case UPDATE_USER_INFO:
      newState = { user: data.user, token: preState.token, isLogin: true }
      return newState
    default:
      return preState
  }
}
