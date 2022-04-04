import { MusicArrInfo } from '@/api/type'

/** 登录初始值类型 */
export interface LoginStateType {
  user: UserInfoType | ''
  token: string
  isLogin: boolean
}

export interface UserInfoType {
  username: string
  _id: string
  password: string
  avatar_url: string
}

/** 打开默认播放列表初始值类型 */
export type DefaultPlaylistType = string[]

/** 打开默认播放列表初始值类型 */
export type LikePlaylistType = string[]

/** 当前播放的信息类型 */
export type PlayingType = {
  isPlaying: boolean
  currentMusicInfo: MusicArrInfo | null
  currentMusicIndex: number
  currentMusicLyricsIndex: number
}
