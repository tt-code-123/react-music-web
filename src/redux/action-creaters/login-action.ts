import { SAVE_USER_INFO, DELETE_USER_INFO, UPDATE_USER_INFO } from '../action-types'
import { LoginStateType, UserInfoType } from '../type'

export const saveUserInfoAction = (value: LoginStateType) => {
  localStorage.setItem('user', JSON.stringify(value.user))
  localStorage.setItem('token', value.token)
  return { type: SAVE_USER_INFO, data: value }
}
export const updateUserInfoAction = (user: UserInfoType) => {
  localStorage.setItem('user', JSON.stringify(user))
  return { type: UPDATE_USER_INFO, data: { user } }
}
export const deleteUserInfoAction = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  return { type: DELETE_USER_INFO, data: null }
}
