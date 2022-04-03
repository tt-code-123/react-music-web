import { DELETE_CURRENT_MUSIC_INFO, SAVE_CURRENT_MUSIC_INDEX, SAVE_CURRENT_MUSIC_INFO,SAVE_CURRENT_MUSIC_LYRICS_INDEX,SAVE_IS_PLAYING } from "../action-types"
import { PlayingType } from "../type"

// 保存当前播放歌曲的信息
export const savePlayCurrentMusicInfo = (value:PlayingType['currentMusicInfo']) => {
  localStorage.setItem('currentMusic', JSON.stringify(value))
  return {type:SAVE_CURRENT_MUSIC_INFO,data:value}
}
// 删除当前播放歌曲的信息
export const deletePlayCurrentMusicInfo = () => {
  localStorage.removeItem('currentMusic')
  return {type:DELETE_CURRENT_MUSIC_INFO,data:null}
}
// 保存是否正在播放歌曲的状态
export const saveIsPlayingStatus = (value: boolean) => {
  return {type:SAVE_IS_PLAYING,data:value}
}
// 保存当前播放歌曲的索引位置
export const saveCurrentMusicIndex = (value: number) => {
  return {type:SAVE_CURRENT_MUSIC_INDEX,data:value}
}

// 保存当前播放歌曲的歌词索引位置
export const saveCurrentMusicLyricsIndex = (value: number) => {
  return {type:SAVE_CURRENT_MUSIC_LYRICS_INDEX,data:value}
}
