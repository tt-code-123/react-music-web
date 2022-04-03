import {  SAVE_LIKE_PLAYLIST} from "../action-types";
import { LikePlaylistType } from "../type";

/** Action类型定义 */
interface ActionType {
  data: LikePlaylistType | []
  type:string
}
const initState: LikePlaylistType = []
export default function likePlaylistReducer(preState = initState, action: ActionType) {
  let newState:LikePlaylistType
  switch (action.type) {
    case SAVE_LIKE_PLAYLIST:
      newState = [...action.data]
      return newState
    default:
      return preState
  }
}