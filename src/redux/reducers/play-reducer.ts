import { DELETE_CURRENT_MUSIC_INFO, SAVE_CURRENT_MUSIC_INDEX, SAVE_CURRENT_MUSIC_INFO, SAVE_CURRENT_MUSIC_LYRICS_INDEX, SAVE_IS_PLAYING } from "../action-types";
import { PlayingType } from "../type";

/** Action类型定义 */
interface ActionType {
  data: any
  type:string
}
const currentMusic = JSON.parse(localStorage.getItem('currentMusic'))
const initState:PlayingType = {
  currentMusicInfo: currentMusic || null,
  isPlaying: false,
  currentMusicIndex: 0,
  currentMusicLyricsIndex:0
}

export default function playReducer(preState = initState, action: ActionType) {
  let newState: PlayingType = { ...preState }
  switch (action.type) {
    case SAVE_CURRENT_MUSIC_INFO:
      newState.currentMusicInfo = action.data
      return newState
    case DELETE_CURRENT_MUSIC_INFO:
      newState.currentMusicInfo = action.data
      return newState
    case SAVE_IS_PLAYING:
      newState.isPlaying = action.data
      return newState
    case SAVE_CURRENT_MUSIC_INDEX:
      newState.currentMusicIndex = action.data
      return newState
    case SAVE_CURRENT_MUSIC_LYRICS_INDEX:
      newState.currentMusicLyricsIndex = action.data
      return newState
    default:
      return preState
  }
}