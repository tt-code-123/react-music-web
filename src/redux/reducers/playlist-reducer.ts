import { removeDuplicate } from '@/utils'
import { message } from 'antd'
import { DELETE_DEFAULT_PLAYLIST, SAVE_DEFAULT_PLAYLIST } from '../action-types'
import { DefaultPlaylistType } from '../type'

/** Action类型定义 */
interface ActionType {
  data: DefaultPlaylistType | []
  type: string
}
const defaultPlaylist = JSON.parse(localStorage.getItem('defaultPlaylist'))
const initState: DefaultPlaylistType = defaultPlaylist || []
export default function defaultPlaylistReducer(preState = initState, action: ActionType) {
  let newState: DefaultPlaylistType
  switch (action.type) {
    case SAVE_DEFAULT_PLAYLIST:
      newState = removeDuplicate([...preState, ...action.data])
      message.success('添加歌曲成功', 1)
      return newState
    case DELETE_DEFAULT_PLAYLIST:
      if (action.data.length === 0) {
        message.success('删除歌曲成功', 1)
        return []
      }
      newState = [...preState]
      for (let i = 0; i < newState.length; i++) {
        for (let j = 0; j < action.data.length; j++) {
          if (newState[i] === action.data[j]) {
            newState.splice(i, 1)
            i--
          }
        }
      }
      message.success('删除歌曲成功', 1)
      return newState
    default:
      return preState
  }
}
